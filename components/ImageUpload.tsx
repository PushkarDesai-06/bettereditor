"use client";

import { useState, useRef } from "react";
import imageCompression from "browser-image-compression";
import { FaUpload, FaTimes } from "react-icons/fa";

interface ImageUploadProps {
  onUploadSuccess: () => void;
  onClose: () => void;
}

export default function ImageUpload({
  onUploadSuccess,
  onClose,
}: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCompression, setShowCompression] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const fileSize = selectedFile.size / (1024 * 1024); // Convert to MB
    setOriginalSize(fileSize);

    if (fileSize > 5) {
      setShowCompression(true);
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
    setShowCompression(false);
  };

  const handleCompress = async (quality: number) => {
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const options = {
        maxSizeMB: 5,
        maxWidthOrHeight:
          quality === 0.8 ? 1920 : quality === 0.6 ? 1280 : 1024,
        useWebWorker: true,
        initialQuality: quality,
      };

      const compressedFile = await imageCompression(file, options);
      processFile(compressedFile);
      setError("");
    } catch (err) {
      setError("Failed to compress image");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file || !title) {
      setError("Please provide a title and select an image");
      return;
    }

    const fileSize = file.size / (1024 * 1024);
    if (fileSize > 5) {
      setError("Image size must be less than 5MB. Please compress the image.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageData = reader.result as string;
        const tagsArray = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);

        const response = await fetch("/api/images", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            tags: tagsArray,
            imageData,
            originalSize: file.size,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to upload image");
        }

        onUploadSuccess();
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-semibold">Upload Image</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {showCompression && (
          <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 mb-4">
            <p className="text-yellow-200 mb-3">
              File size is {originalSize.toFixed(2)}MB, which exceeds the 5MB
              limit. Would you like to compress it?
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => handleCompress(0.8)}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                High Quality (80%)
              </button>
              <button
                onClick={() => handleCompress(0.6)}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Medium Quality (60%)
              </button>
              <button
                onClick={() => handleCompress(0.4)}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Low Quality (40%)
              </button>
              <button
                onClick={() => {
                  setShowCompression(false);
                  setFile(null);
                  setPreview("");
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* File Input */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-8 rounded-lg border-2 border-dashed border-gray-600 hover:border-gray-500 transition-colors flex flex-col items-center gap-2"
            >
              <FaUpload size={32} />
              <span>Click to select an image</span>
              <span className="text-sm text-gray-400">Max 5MB per file</span>
            </button>
          </div>

          {/* Preview */}
          {preview && (
            <div className="border border-gray-700 rounded-lg overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-contain bg-gray-900"
              />
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-gray-300 text-sm mb-2 block">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter image title"
              className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-gray-300 text-sm mb-2 block">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., nature, landscape, sunset"
              className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Upload Button */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleUpload}
              disabled={loading || !file || !title}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Uploading..." : "Upload Image"}
            </button>
            <button
              onClick={onClose}
              className="px-6 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
