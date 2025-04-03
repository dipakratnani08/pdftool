import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  imageUrl: text("image_url"),
  planType: text("plan_type").default("free"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  imageUrl: true,
});

// PDF File model
export const pdfFiles = pgTable("pdf_files", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  fileName: text("file_name").notNull(),
  originalSize: integer("original_size").notNull(), // size in bytes
  processedSize: integer("processed_size"), // size after processing
  pageCount: integer("page_count"),
  storageLocation: text("storage_location"), // path or identifier where file is stored
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPdfFileSchema = createInsertSchema(pdfFiles).pick({
  userId: true,
  fileName: true,
  originalSize: true,
  processedSize: true,
  pageCount: true,
  storageLocation: true,
});

// PDF Operation model
export const pdfOperations = pgTable("pdf_operations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  operationType: text("operation_type").notNull(), // merge, split, compress, convert, edit, secure
  sourceFileIds: jsonb("source_file_ids").notNull(), // array of source file IDs
  resultFileId: integer("result_file_id").references(() => pdfFiles.id),
  options: jsonb("options"), // operation-specific options as JSON
  status: text("status").notNull(), // completed, failed, processing
  message: text("message"), // error message or success details
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPdfOperationSchema = createInsertSchema(pdfOperations).pick({
  userId: true,
  operationType: true,
  sourceFileIds: true,
  resultFileId: true,
  options: true,
  status: true,
  message: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type PdfFile = typeof pdfFiles.$inferSelect;
export type InsertPdfFile = z.infer<typeof insertPdfFileSchema>;

export type PdfOperation = typeof pdfOperations.$inferSelect;
export type InsertPdfOperation = z.infer<typeof insertPdfOperationSchema>;

// PDF Operation Types
export const OperationTypes = {
  MERGE: 'merge',
  SPLIT: 'split',
  COMPRESS: 'compress',
  CONVERT: 'convert',
  EDIT: 'edit',
  SECURE: 'secure'
} as const;

// PDF File formats for conversions
export const FileFormats = {
  PDF: 'pdf',
  DOCX: 'docx',
  XLSX: 'xlsx',
  PPTX: 'pptx',
  JPG: 'jpg',
  PNG: 'png',
  TXT: 'txt'
} as const;
