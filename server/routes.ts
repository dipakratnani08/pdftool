import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import os from "os";
import { PDFDocument } from "pdf-lib";
import { OperationTypes } from "@shared/schema";

// Get directory path
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(os.tmpdir(), "pdf-utility-uploads");

// Create uploads directory if it doesn't exist
try {
  await fs.mkdir(uploadsDir, { recursive: true });
} catch (err) {
  console.error("Failed to create uploads directory:", err);
}

// Configure multer storage
const storage_config = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ 
  storage: storage_config,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (_req, file, cb) => {
    // Accept PDF files only
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API for user management
  app.get("/api/user/current", async (req, res) => {
    // In a real app, this would use session/JWT
    const user = await storage.getUser(1); // Using demo user for simplicity
    if (user) {
      // Don't send password in response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });

  // API for file uploads
  app.post("/api/upload", upload.array("files"), async (req, res) => {
    try {
      const userId = 1; // Using demo user
      const uploadedFiles = req.files as Express.Multer.File[];
      
      if (!uploadedFiles || uploadedFiles.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const filesData = await Promise.all(uploadedFiles.map(async (file) => {
        try {
          // Read PDF and get page count
          const pdfBytes = await fs.readFile(file.path);
          const pdfDoc = await PDFDocument.load(pdfBytes);
          const pageCount = pdfDoc.getPageCount();

          // Save file info to storage
          const pdfFile = await storage.createPdfFile({
            userId,
            fileName: file.originalname,
            originalSize: file.size,
            pageCount,
            storageLocation: file.path,
            processedSize: null,
          });

          return {
            id: pdfFile.id,
            fileName: pdfFile.fileName,
            originalSize: pdfFile.originalSize,
            pageCount: pdfFile.pageCount,
          };
        } catch (error) {
          console.error("Error processing PDF file:", error);
          return null;
        }
      }));

      const validFiles = filesData.filter(Boolean);
      
      res.status(200).json({ 
        message: "Files uploaded successfully", 
        files: validFiles 
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Error uploading files" });
    }
  });

  // API to get uploaded files
  app.get("/api/files", async (_req, res) => {
    try {
      const userId = 1; // Using demo user
      const files = await storage.getPdfFilesByUserId(userId);
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Error fetching files" });
    }
  });

  // API to merge PDFs
  app.post("/api/merge", async (req, res) => {
    try {
      const userId = 1; // Using demo user
      
      const schema = z.object({
        fileIds: z.array(z.number()),
        options: z.object({
          mergeMode: z.string().optional(),
          orientation: z.string().optional(),
          includeBookmarks: z.boolean().optional(),
        }).optional(),
      });
      
      const { fileIds, options } = schema.parse(req.body);
      
      if (!fileIds || fileIds.length < 2) {
        return res.status(400).json({ message: "At least 2 files are required for merging" });
      }
      
      // Get files
      const files = await Promise.all(fileIds.map(id => storage.getPdfFile(id)));
      const validFiles = files.filter(Boolean) as any[];
      
      if (validFiles.length !== fileIds.length) {
        return res.status(400).json({ message: "Some files were not found" });
      }
      
      // Create a new merged PDF
      const mergedPdf = await PDFDocument.create();
      
      let totalSize = 0;
      
      for (const file of validFiles) {
        const pdfBytes = await fs.readFile(file.storageLocation);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
        totalSize += file.originalSize;
      }
      
      // Save the merged PDF
      const mergedPdfBytes = await mergedPdf.save();
      const mergedFileName = `merged-${Date.now()}.pdf`;
      const mergedFilePath = path.join(uploadsDir, mergedFileName);
      
      await fs.writeFile(mergedFilePath, mergedPdfBytes);
      
      // Save file info to storage
      const pdfFile = await storage.createPdfFile({
        userId,
        fileName: mergedFileName,
        originalSize: totalSize,
        processedSize: mergedPdfBytes.length,
        pageCount: mergedPdf.getPageCount(),
        storageLocation: mergedFilePath,
      });
      
      // Record the operation
      const operation = await storage.createPdfOperation({
        userId,
        operationType: OperationTypes.MERGE,
        sourceFileIds: fileIds,
        resultFileId: pdfFile.id,
        options,
        status: "completed",
        message: `Merged ${fileIds.length} files into one PDF with ${pdfFile.pageCount} pages`
      });
      
      res.json({ 
        message: "PDFs merged successfully",
        file: pdfFile,
        operation
      });
    } catch (error) {
      console.error("Merge error:", error);
      res.status(500).json({ message: "Error merging PDFs" });
    }
  });

  // API to split PDF
  app.post("/api/split", async (req, res) => {
    try {
      const userId = 1; // Using demo user
      
      const schema = z.object({
        fileId: z.number(),
        options: z.object({
          ranges: z.array(z.string()).optional(), // e.g. ["1-3", "4-8"]
          splitMode: z.string().optional(), // single, ranges, every
        }),
      });
      
      const { fileId, options } = schema.parse(req.body);
      
      // Get file
      const file = await storage.getPdfFile(fileId);
      
      if (!file) {
        return res.status(400).json({ message: "File not found" });
      }
      
      const pdfBytes = await fs.readFile(file.storageLocation);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pageCount = pdfDoc.getPageCount();
      
      const resultFiles = [];
      const resultFileIds = [];
      
      // Simple split - one file per page
      if (options.splitMode === 'single' || !options.ranges) {
        for (let i = 0; i < pageCount; i++) {
          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
          newPdf.addPage(copiedPage);
          
          const newPdfBytes = await newPdf.save();
          const newFileName = `${file.fileName.replace('.pdf', '')}-page-${i+1}.pdf`;
          const newFilePath = path.join(uploadsDir, newFileName);
          
          await fs.writeFile(newFilePath, newPdfBytes);
          
          // Save file info to storage
          const pdfFile = await storage.createPdfFile({
            userId,
            fileName: newFileName,
            originalSize: file.originalSize,
            processedSize: newPdfBytes.length,
            pageCount: 1,
            storageLocation: newFilePath,
          });
          
          resultFiles.push(pdfFile);
          resultFileIds.push(pdfFile.id);
        }
      }
      
      // Record the operation
      const operation = await storage.createPdfOperation({
        userId,
        operationType: OperationTypes.SPLIT,
        sourceFileIds: [fileId],
        resultFileId: resultFileIds[0] || null,
        options,
        status: "completed",
        message: `Split PDF into ${resultFiles.length} files`
      });
      
      res.json({ 
        message: "PDF split successfully",
        files: resultFiles,
        operation
      });
    } catch (error) {
      console.error("Split error:", error);
      res.status(500).json({ message: "Error splitting PDF" });
    }
  });

  // API to compress PDF
  app.post("/api/compress", async (req, res) => {
    try {
      const userId = 1; // Using demo user
      
      const schema = z.object({
        fileId: z.number(),
        options: z.object({
          quality: z.number().min(1).max(100).optional(), // compression quality
        }).optional(),
      });
      
      const { fileId, options } = schema.parse(req.body);
      
      // Get file
      const file = await storage.getPdfFile(fileId);
      
      if (!file) {
        return res.status(400).json({ message: "File not found" });
      }
      
      const pdfBytes = await fs.readFile(file.storageLocation);
      
      // In a real app, you would implement actual compression
      // For now, we'll simulate compression by creating a new PDF
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const compressedPdfBytes = await pdfDoc.save({
        useObjectStreams: true, // This can reduce file size
      });
      
      const compressedFileName = `compressed-${file.fileName}`;
      const compressedFilePath = path.join(uploadsDir, compressedFileName);
      
      await fs.writeFile(compressedFilePath, compressedPdfBytes);
      
      // Save file info to storage
      const pdfFile = await storage.createPdfFile({
        userId,
        fileName: compressedFileName,
        originalSize: file.originalSize,
        processedSize: compressedPdfBytes.length,
        pageCount: pdfDoc.getPageCount(),
        storageLocation: compressedFilePath,
      });
      
      // Calculate compression percentage
      const compressionPercent = Math.round(
        ((file.originalSize - compressedPdfBytes.length) / file.originalSize) * 100
      );
      
      // Record the operation
      const operation = await storage.createPdfOperation({
        userId,
        operationType: OperationTypes.COMPRESS,
        sourceFileIds: [fileId],
        resultFileId: pdfFile.id,
        options,
        status: "completed",
        message: `Reduced from ${(file.originalSize / (1024 * 1024)).toFixed(1)} MB to ${(compressedPdfBytes.length / (1024 * 1024)).toFixed(1)} MB (${compressionPercent}% reduction)`
      });
      
      res.json({ 
        message: "PDF compressed successfully",
        file: pdfFile,
        operation,
        compressionPercent
      });
    } catch (error) {
      console.error("Compress error:", error);
      res.status(500).json({ message: "Error compressing PDF" });
    }
  });

  // API to download a file
  app.get("/api/download/:id", async (req, res) => {
    try {
      const fileId = parseInt(req.params.id);
      const file = await storage.getPdfFile(fileId);
      
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      
      res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`);
      res.setHeader('Content-Type', 'application/pdf');
      
      const fileStream = await fs.readFile(file.storageLocation);
      res.send(fileStream);
    } catch (error) {
      console.error("Download error:", error);
      res.status(500).json({ message: "Error downloading file" });
    }
  });

  // API to get recent activities
  app.get("/api/activities", async (_req, res) => {
    try {
      const userId = 1; // Using demo user
      const limit = parseInt(req.query.limit as string) || 10;
      
      const activities = await storage.getRecentOperations(userId, limit);
      
      // Get file info for each activity
      const activitiesWithFiles = await Promise.all(
        activities.map(async (activity) => {
          let resultFile = null;
          if (activity.resultFileId) {
            resultFile = await storage.getPdfFile(activity.resultFileId);
          }
          
          // Get source files
          const sourceFiles = await Promise.all(
            activity.sourceFileIds.map(async (id) => {
              return await storage.getPdfFile(id as number);
            })
          );
          
          return {
            ...activity,
            resultFile,
            sourceFiles: sourceFiles.filter(Boolean),
          };
        })
      );
      
      res.json(activitiesWithFiles);
    } catch (error) {
      console.error("Activities error:", error);
      res.status(500).json({ message: "Error fetching activities" });
    }
  });

  // API to get user statistics
  app.get("/api/stats", async (_req, res) => {
    try {
      const userId = 1; // Using demo user
      
      // Get all files for the user
      const files = await storage.getPdfFilesByUserId(userId);
      const operations = await storage.getPdfOperationsByUserId(userId);
      
      // Calculate stats
      const filesProcessed = operations.length;
      const totalStorage = files.reduce((sum, file) => sum + file.originalSize, 0);
      const storageUsedMB = totalStorage / (1024 * 1024);
      
      // Get percentage of storage used (assuming 2GB limit for free plan)
      const storageLimitMB = 2 * 1024; // 2GB
      const storagePercentage = (storageUsedMB / storageLimitMB) * 100;
      
      // Calculate increase percentage (mock value for now)
      // In a real app, you would compare with previous period
      const increasePercentage = 12;
      
      res.json({
        filesProcessed,
        storageUsedMB,
        storagePercentage,
        increasePercentage,
        storageLimitMB
      });
    } catch (error) {
      console.error("Stats error:", error);
      res.status(500).json({ message: "Error fetching statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
