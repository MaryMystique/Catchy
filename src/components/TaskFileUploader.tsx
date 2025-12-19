"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { uploadTaskFile, deleteTaskFile, listTaskFiles, formatFileSize, FileAttachment } from "@/lib/storage";
import toast from "react-hot-toast";
import { FaFile, FaDownload, FaTrash, FaUpload, FaFilePdf, FaFileImage, FaFileWord, FaFileExcel } from "react-icons/fa";

interface TaskFileUploaderProps {
    projectId: string;
    taskId: string;
}

export default function TaskFileUploader({ projectId, taskId }: TaskFileUploaderProps) {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load files
  const loadFiles = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const taskFiles = await listTaskFiles(user.uid, projectId, taskId);
      setFiles(taskFiles);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [user, projectId, taskId]);

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0 || !user) {
      console.log("No files selected or no user");
      return;
    }

    console.log("Starting upload for", selectedFiles.length, 'files');
    const filesToUpload = Array.from(selectedFiles);

    setIsUploading(true);

    for (const file of filesToUpload) {
      console.log("Processing file:", file.name, "Size:", file.size);
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 10MB`);
        continue;
      }

    try {
      console.log("Uploading", file.name, "...");
      const result = await uploadTaskFile(user.uid, projectId, taskId, file);
      console.log("Upload successful:", result);
      toast.success(`${file.name} uploaded successfully!`);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload ${file.name}: ${error.message || 'Unknown error'}`);
    }
  }
   setIsUploading(false);
   await loadFiles(); // Reload files list

   // Clear input
   if (fileInputRef.current) {
    fileInputRef.current.value = '';
   }
  };

  // Handle file delete
  const handleFileDelete = async (file: FileAttachment) => {
    if (!user || !confirm(`Delete ${file.name}?`)) return;

    try {
      await deleteTaskFile(user.uid, projectId, taskId, file.id);
      toast.success('File deleted successfully!');
      loadFiles();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
    }
  };

  // Get file icon based on type
  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FaFilePdf className="text-red-500" />;
    if (type.includes('image')) return <FaFileImage className="text-blue-500" />;
    if (type.includes('word') || type.includes('document')) return <FaFileWord className="text-blue-600" />;
    if (type.includes('sheet') || type.includes('excel')) return <FaFileExcel className="text-green-600" />;
    return <FaFile className="text-gray-500" />;
  };


return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">
          Attachments ({files.length})
        </h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaUpload className="text-xs" />
          {isUploading ? 'Uploading...' : 'Upload File'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          accept="*/*"
        />
      </div>

      {/* Files List */}
      <div className="space-y-2">
        {isLoading ? (
          <p className="text-sm text-gray-500 text-center py-4">Loading files...</p>
        ) : files.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <FaFile className="mx-auto text-gray-400 text-3xl mb-2" />
            <p className="text-sm text-gray-500">No files attached</p>
            <p className="text-xs text-gray-400 mt-1">Upload files to attach them to this task</p>
          </div>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="text-2xl shrink-0">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={file.name}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Download"
                >
                  <FaDownload />
                </a>
                <button
                  onClick={() => handleFileDelete(file)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload info */}
      <p className="text-xs text-gray-500 text-center">
        Max file size: 10MB • Supported: All file types
      </p>
    </div>
  );
}
