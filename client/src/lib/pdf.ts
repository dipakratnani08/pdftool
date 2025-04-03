import { PDFDocument } from 'pdf-lib';

/**
 * Get metadata from a PDF file (page count, etc.)
 */
export async function getPdfMetadata(file: File): Promise<{pageCount: number}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        
        resolve({
          pageCount: pdfDoc.getPageCount()
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Merge multiple PDF files into one
 */
export async function mergePdfs(fileIds: number[]): Promise<Blob> {
  const response = await fetch('/api/merge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ fileIds }),
  });

  if (!response.ok) {
    throw new Error(`Failed to merge PDFs: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.file && result.file.id) {
    // Download the merged file
    const downloadResponse = await fetch(`/api/download/${result.file.id}`, {
      credentials: 'include',
    });
    
    if (!downloadResponse.ok) {
      throw new Error(`Failed to download merged PDF: ${downloadResponse.statusText}`);
    }
    
    return await downloadResponse.blob();
  } else {
    throw new Error('No merged file returned from server');
  }
}

/**
 * Split a PDF into separate files
 */
export async function splitPdf(fileId: number, options: any): Promise<any> {
  const response = await fetch('/api/split', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ fileId, options }),
  });

  if (!response.ok) {
    throw new Error(`Failed to split PDF: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Download split PDF files as a ZIP archive
 */
export async function downloadSplitFilesAsZip(fileIds: number[], fileName: string = "split-files.zip"): Promise<void> {
  try {
    const response = await fetch('/api/download-zip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileIds, zipFileName: fileName }),
    });

    if (!response.ok) {
      throw new Error(`Failed to download ZIP: ${response.statusText}`);
    }

    // Create a blob from the response
    const blob = await response.blob();
    
    // Create a download link and trigger download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading ZIP:", error);
    throw error;
  }
}

/**
 * Compress a PDF file
 */
export async function compressPdf(fileId: number, options: any = {}): Promise<any> {
  const response = await fetch('/api/compress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ fileId, options }),
  });

  if (!response.ok) {
    throw new Error(`Failed to compress PDF: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Download a file by ID
 */
export function downloadFile(fileId: number): void {
  window.open(`/api/download/${fileId}`, '_blank');
}
