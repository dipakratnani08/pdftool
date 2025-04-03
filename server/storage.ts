import { 
  User, InsertUser, 
  PdfFile, InsertPdfFile, 
  PdfOperation, InsertPdfOperation 
} from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // PDF File operations
  getPdfFile(id: number): Promise<PdfFile | undefined>;
  getPdfFilesByUserId(userId: number): Promise<PdfFile[]>;
  createPdfFile(file: InsertPdfFile): Promise<PdfFile>;
  deletePdfFile(id: number): Promise<boolean>;
  
  // PDF Operations
  getPdfOperation(id: number): Promise<PdfOperation | undefined>;
  getPdfOperationsByUserId(userId: number): Promise<PdfOperation[]>;
  createPdfOperation(operation: InsertPdfOperation): Promise<PdfOperation>;
  updatePdfOperation(id: number, updates: Partial<PdfOperation>): Promise<PdfOperation | undefined>;
  getRecentOperations(userId: number, limit: number): Promise<PdfOperation[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private pdfFiles: Map<number, PdfFile>;
  private pdfOperations: Map<number, PdfOperation>;
  private currentUserId: number;
  private currentFileId: number;
  private currentOperationId: number;

  constructor() {
    this.users = new Map();
    this.pdfFiles = new Map();
    this.pdfOperations = new Map();
    
    this.currentUserId = 1;
    this.currentFileId = 1;
    this.currentOperationId = 1;
    
    // Add a default user
    this.createUser({
      username: "demo@example.com",
      password: "password123",
      displayName: "Alex Morgan",
      imageUrl: "https://ui-avatars.com/api/?name=Alex+Morgan&background=random"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      planType: "free",
      displayName: insertUser.displayName ?? null,
      imageUrl: insertUser.imageUrl ?? null
    };
    this.users.set(id, user);
    return user;
  }

  // PDF File operations
  async getPdfFile(id: number): Promise<PdfFile | undefined> {
    return this.pdfFiles.get(id);
  }

  async getPdfFilesByUserId(userId: number): Promise<PdfFile[]> {
    return Array.from(this.pdfFiles.values()).filter(
      (file) => file.userId === userId
    );
  }

  async createPdfFile(file: InsertPdfFile): Promise<PdfFile> {
    const id = this.currentFileId++;
    const timestamp = new Date();
    const storageLocation = file.storageLocation || `uploads/${randomUUID()}.pdf`;

    const pdfFile: PdfFile = { 
      id,
      userId: file.userId ?? null,
      fileName: file.fileName,
      originalSize: file.originalSize,
      processedSize: file.processedSize ?? null,
      pageCount: file.pageCount ?? null,
      storageLocation: storageLocation,
      createdAt: timestamp 
    };
    
    this.pdfFiles.set(id, pdfFile);
    return pdfFile;
  }

  async deletePdfFile(id: number): Promise<boolean> {
    return this.pdfFiles.delete(id);
  }

  // PDF Operations
  async getPdfOperation(id: number): Promise<PdfOperation | undefined> {
    return this.pdfOperations.get(id);
  }

  async getPdfOperationsByUserId(userId: number): Promise<PdfOperation[]> {
    return Array.from(this.pdfOperations.values())
      .filter((operation) => operation.userId === userId);
  }

  async createPdfOperation(operation: InsertPdfOperation): Promise<PdfOperation> {
    const id = this.currentOperationId++;
    const timestamp = new Date();
    
    const pdfOperation: PdfOperation = {
      id,
      userId: operation.userId ?? null,
      operationType: operation.operationType,
      sourceFileIds: operation.sourceFileIds,
      resultFileId: operation.resultFileId ?? null,
      options: operation.options ?? null,
      status: operation.status,
      message: operation.message ?? null,
      createdAt: timestamp
    };
    
    this.pdfOperations.set(id, pdfOperation);
    return pdfOperation;
  }

  async updatePdfOperation(id: number, updates: Partial<PdfOperation>): Promise<PdfOperation | undefined> {
    const operation = this.pdfOperations.get(id);
    
    if (!operation) {
      return undefined;
    }
    
    const updatedOperation = { ...operation, ...updates };
    this.pdfOperations.set(id, updatedOperation);
    
    return updatedOperation;
  }

  async getRecentOperations(userId: number, limit: number): Promise<PdfOperation[]> {
    return Array.from(this.pdfOperations.values())
      .filter(op => op.userId === userId)
      .sort((a, b) => {
        // Safely handle date comparison with possible null values
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
