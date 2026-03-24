"use client";

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileImage, X } from 'lucide-react';

interface FileUploaderProps {
  // We pass the state up to the parent (page.tsx) so it can be sent to the API
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
}

export default function FileUploader({ selectedFile, onFileSelect }: FileUploaderProps) {
  // useCallback ensures this function isn't recreated on every render
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1, // We only want one architecture diagram at a time
  });

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ease-in-out flex flex-col items-center justify-center min-h-[160px]
            ${isDragActive 
              ? 'border-blue-500 bg-blue-50 shadow-inner' 
              : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50 bg-white'}`}
        >
          <input {...getInputProps()} />
          <UploadCloud 
            className={`w-12 h-12 mb-4 transition-colors duration-200 ${isDragActive ? 'text-blue-500' : 'text-slate-400'}`} 
          />
          <p className="text-sm font-medium text-slate-700">
            {isDragActive ? 'Drop your diagram here...' : 'Drag & drop a UML diagram here'}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            or click to browse (JPG, PNG, WEBP)
          </p>
        </div>
      ) : (
        // The "Selected File" State
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white shadow-sm transition-all">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
              <FileImage className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex flex-col text-left">
              <p className="text-sm font-medium text-slate-700 truncate max-w-[200px] sm:max-w-[300px]">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevents triggering the dropzone click event
              onFileSelect(null);
            }}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Remove file"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}