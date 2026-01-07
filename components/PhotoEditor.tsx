"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { FaSave, FaTimes, FaUndo, FaCircle, FaDownload } from "react-icons/fa";

interface PhotoEditorProps {
  imageData: string;
  initialFilters?: Partial<FilterSettings>;
  onSave: (editedImage: string, filters: FilterSettings) => void;
  onClose: () => void;
}

export interface FilterSettings {
  blur: number;
  brightness: number;
  contrast: number;
  grayscale: number;
  hueRotate: number;
  saturate: number;
  sepia: number;
  invert: number;
  opacity: number;
}

const DEFAULT_FILTERS: FilterSettings = {
  blur: 0,
  brightness: 100,
  contrast: 100,
  grayscale: 0,
  hueRotate: 0,
  saturate: 100,
  sepia: 0,
  invert: 0,
  opacity: 100,
};

export default function PhotoEditor({
  imageData,
  initialFilters,
  onSave,
  onClose,
}: PhotoEditorProps) {
  const [filters, setFilters] = useState<FilterSettings>(() => ({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  }));

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [lastSavedFilters, setLastSavedFilters] = useState<FilterSettings>(
    () => ({
      ...DEFAULT_FILTERS,
      ...initialFilters,
    })
  );

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.src = imageData;
    }
  }, [imageData]);

  // Check for unsaved changes
  useEffect(() => {
    const filtersChanged =
      JSON.stringify(filters) !== JSON.stringify(lastSavedFilters);
    setHasUnsavedChanges(filtersChanged);
  }, [filters, lastSavedFilters]);

  // Warn before page refresh/close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && hasUnsavedChanges) {
      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Set new timer for 2 seconds after last change
      autoSaveTimerRef.current = setTimeout(() => {
        handleSave();
      }, 2000);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [filters, autoSave, hasUnsavedChanges]);

  const getFilterString = () => {
    return `blur(${filters.blur}px) brightness(${filters.brightness}%) contrast(${filters.contrast}%) grayscale(${filters.grayscale}%) hue-rotate(${filters.hueRotate}deg) saturate(${filters.saturate}%) sepia(${filters.sepia}%) invert(${filters.invert}%) opacity(${filters.opacity}%)`;
  };

  const handleFilterChange = (
    filterName: keyof FilterSettings,
    value: number
  ) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleSave = useCallback(() => {
    // Only save filters, not the rendered image to avoid layering
    onSave(imageData, filters);
    setLastSavedFilters(filters);
    setHasUnsavedChanges(false);
  }, [filters, onSave, imageData]);

  const handleDownload = useCallback(
    (format: "png" | "jpg" | "jpeg") => {
      const canvas = canvasRef.current;
      const img = imageRef.current;

      if (!canvas || !img) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Apply filters and draw
      ctx.filter = getFilterString();
      ctx.drawImage(img, 0, 0);

      // Determine MIME type and extension
      const mimeType = format === "png" ? "image/png" : "image/jpeg";
      const extension = format;

      // Convert to data URL
      const downloadData = canvas.toDataURL(mimeType, 0.95);

      // Create download link
      const link = document.createElement("a");
      link.download = `edited-image-${Date.now()}.${extension}`;
      link.href = downloadData;
      link.click();

      setShowDownloadMenu(false);
    },
    [filters]
  );

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Are you sure you want to close? Your changes will be lost."
      );
      if (!confirmClose) return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex">
      {/* Left Sidebar - Filters */}
      <div className="w-80 bg-gray-900 border-r border-gray-700 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-white text-lg font-semibold">Adjustments</h2>
            {hasUnsavedChanges && (
              <div
                className="flex items-center gap-1 text-yellow-500"
                title="Unsaved changes"
              >
                <FaCircle size={8} className="animate-pulse" />
              </div>
            )}
          </div>
          <button
            onClick={handleReset}
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
          >
            <FaUndo /> Reset
          </button>
        </div>

        <div className="space-y-6">
          {/* Blur */}
          <div className="filter-control">
            <label className="text-gray-300 text-sm mb-2 block">Blur</label>
            <input
              type="range"
              min="0"
              max="20"
              step="0.1"
              value={filters.blur}
              onChange={(e) =>
                handleFilterChange("blur", parseFloat(e.target.value))
              }
              className="w-full"
            />
            <span className="text-gray-400 text-xs">
              {filters.blur.toFixed(1)}px
            </span>
          </div>

          {/* Brightness */}
          <div className="filter-control">
            <label className="text-gray-300 text-sm mb-2 block">
              Brightness
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={filters.brightness}
              onChange={(e) =>
                handleFilterChange("brightness", parseInt(e.target.value))
              }
              className="w-full"
            />
            <span className="text-gray-400 text-xs">{filters.brightness}%</span>
          </div>

          {/* Contrast */}
          <div className="filter-control">
            <label className="text-gray-300 text-sm mb-2 block">Contrast</label>
            <input
              type="range"
              min="0"
              max="200"
              value={filters.contrast}
              onChange={(e) =>
                handleFilterChange("contrast", parseInt(e.target.value))
              }
              className="w-full"
            />
            <span className="text-gray-400 text-xs">{filters.contrast}%</span>
          </div>

          {/* Grayscale */}
          <div className="filter-control">
            <label className="text-gray-300 text-sm mb-2 block">
              Grayscale
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.grayscale}
              onChange={(e) =>
                handleFilterChange("grayscale", parseInt(e.target.value))
              }
              className="w-full"
            />
            <span className="text-gray-400 text-xs">{filters.grayscale}%</span>
          </div>

          {/* Hue Rotate */}
          <div className="filter-control">
            <label className="text-gray-300 text-sm mb-2 block">
              Hue Rotate
            </label>
            <input
              type="range"
              min="0"
              max="360"
              value={filters.hueRotate}
              onChange={(e) =>
                handleFilterChange("hueRotate", parseInt(e.target.value))
              }
              className="w-full"
            />
            <span className="text-gray-400 text-xs">{filters.hueRotate}°</span>
          </div>

          {/* Saturate */}
          <div className="filter-control">
            <label className="text-gray-300 text-sm mb-2 block">
              Saturation
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={filters.saturate}
              onChange={(e) =>
                handleFilterChange("saturate", parseInt(e.target.value))
              }
              className="w-full"
            />
            <span className="text-gray-400 text-xs">{filters.saturate}%</span>
          </div>

          {/* Sepia */}
          <div className="filter-control">
            <label className="text-gray-300 text-sm mb-2 block">Sepia</label>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.sepia}
              onChange={(e) =>
                handleFilterChange("sepia", parseInt(e.target.value))
              }
              className="w-full"
            />
            <span className="text-gray-400 text-xs">{filters.sepia}%</span>
          </div>

          {/* Invert */}
          <div className="filter-control">
            <label className="text-gray-300 text-sm mb-2 block">Invert</label>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.invert}
              onChange={(e) =>
                handleFilterChange("invert", parseInt(e.target.value))
              }
              className="w-full"
            />
            <span className="text-gray-400 text-xs">{filters.invert}%</span>
          </div>

          {/* Opacity */}
          <div className="filter-control">
            <label className="text-gray-300 text-sm mb-2 block">Opacity</label>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.opacity}
              onChange={(e) =>
                handleFilterChange("opacity", parseInt(e.target.value))
              }
              className="w-full"
            />
            <span className="text-gray-400 text-xs">{filters.opacity}%</span>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-gray-800 border-b border-gray-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-white text-lg font-semibold">Photo Editor</h1>
            {hasUnsavedChanges && (
              <span className="text-yellow-500 text-sm flex items-center gap-1">
                <FaCircle size={6} className="animate-pulse" />
                Unsaved changes
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-gray-300 text-sm">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              Auto-save
            </label>
            <div className="h-6 w-px bg-gray-600"></div>
            <div className="relative">
              <button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
              >
                <FaDownload /> Download
              </button>
              {showDownloadMenu && (
                <div className="absolute top-full right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-10 min-w-35">
                  <button
                    onClick={() => handleDownload("png")}
                    className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors text-sm"
                  >
                    PNG
                  </button>
                  <button
                    onClick={() => handleDownload("jpg")}
                    className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors text-sm"
                  >
                    JPG
                  </button>
                  <button
                    onClick={() => handleDownload("jpeg")}
                    className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors text-sm"
                  >
                    JPEG
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors disabled:opacity-50"
              disabled={!hasUnsavedChanges}
            >
              <FaSave /> Save
            </button>
            <button
              onClick={handleClose}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
            >
              <FaTimes /> Close
            </button>
          </div>
        </div>

        {/* Image Preview */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-950">
          <div className="relative max-w-full max-h-full">
            <img
              ref={imageRef}
              alt="Edit preview"
              style={{ filter: getFilterString() }}
              className="max-w-full max-h-[calc(100vh-120px)] object-contain"
            />
          </div>
        </div>
      </div>

      {/* Hidden canvas for saving */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
