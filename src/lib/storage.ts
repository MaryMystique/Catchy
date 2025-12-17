import { ref, uploadBytes, getDownloadURL, deleteObject, listAll, getMetadata } from 'firebase/storage';
import { storage } from "./firebase"

export interface FileAttachment {
id: string;
name: string;
url: string;
size: number;
type: string;
uploadedAt: Date;
uploadedBy: string;
}

// Upload file to Firebase Storage
export async function uploadTaskFile(
userId: string,
projectId: string,
taskId: string,
file: File
): Promise<FileAttachment> {
try {
// Create unique filename with timestamp
const timestamp = Date.now();
const fileName = `${timestamp}_${file.name}`;
const filePath = `users/${userId}/projects/${projectId}/tasks/${taskId}/${fileName}`;

// Create storage reference
const storageRef = ref(storage, filePath);

// Upload file
const snapshot = await uploadBytes(storageRef, file);

// Get download URL
const downloadURL = await getDownloadURL(snapshot.ref);

// Return file metadata
return {
  id: fileName,
  name: file.name,
  url: downloadURL,
  size: file.size,
  type: file.type,
  uploadedAt: new Date(),
  uploadedBy: userId
};
} catch (error) {
console.error('Error uploading file:', error);
throw error;
  }
}

// Delete file from Firebase Storage
export async function deleteTaskFile(
userId: string,
projectId: string,
taskId: string,
fileName: string
): Promise<void> {
try {
const filePath = `users/${userId}/projects/${projectId}/tasks/${taskId}/${fileName}`;
const storageRef = ref(storage, filePath);
await deleteObject(storageRef);
} catch (error) {
console.error('Error deleting file:', error);
throw error;
  }
}

// List all files for a task
export async function listTaskFiles(
userId: string,
projectId: string,
taskId: string
): Promise<FileAttachment[]> {
try {
const folderPath = `users/${userId}/projects/${projectId}/tasks/${taskId}`;
const folderRef = ref(storage, folderPath);

const result = await listAll(folderRef);

const files: FileAttachment[] = [];

for (const itemRef of result.items) {
  const url = await getDownloadURL(itemRef);
  const metadata = await getMetadata(itemRef);
  
  files.push({
    id: itemRef.name,
    name: itemRef.name.split('_').slice(1).join('_'), // Remove timestamp prefix
    url,
    size: metadata.size,
    type: metadata.contentType || 'unknown',
    uploadedAt: new Date(metadata.timeCreated),
    uploadedBy: userId
  });
}

return files;
} catch (error) {
console.error('Error listing files:', error);
throw error;
}
}

// Format file size for display
export function formatFileSize(bytes: number): string {
if (bytes === 0) return '0 Bytes';

const k = 1024;
const sizes = ['Bytes', 'KB', 'MB', 'GB'];
const i = Math.floor(Math.log(bytes) / Math.log(k));

return Math.round(bytes / Math.pow(k, i) * 100) / 100 + '' + sizes[i];
}
