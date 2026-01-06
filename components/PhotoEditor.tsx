"use client";

import { useState, useRef, useEffect } from "react";
import { FaSave, FaTimes, FaUndo } from "react-icons/fa";

interface PhotoEditorProps {
  imageData: string;
  onSave: (editedImage: string) => void;
  onClose: () => void;
}

interface FilterSettings {
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

export default function PhotoEditor({
  imageData,
  onSave,
  onClose,
}: PhotoEditorProps) {
  const [filters, setFilters] = useState<FilterSettings>({
    blur: 0,
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    hueRotate: 0,
    saturate: 100,
    sepia: 0,
    invert: 0,
    opacity: 100,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.src = imageData;
    }
  }, [imageData]);

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
    setFilters({
      blur: 0,
      brightness: 100,
      contrast: 100,
      grayscale: 0,
      hueRotate: 0,
      saturate: 100,
      sepia: 0,
      invert: 0,
      opacity: 100,
    });
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;

    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.filter = getFilterString();
    ctx.drawImage(img, 0, 0);

    const editedImageData = canvas.toDataURL("image/png");
    onSave(editedImageData);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex">
      {/* Left Sidebar - Filters */}
      <div className="w-80 bg-gray-900 border-r border-gray-700 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-lg font-semibold">Adjustments</h2>
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
          <h1 className="text-white text-lg font-semibold">Photo Editor</h1>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
            >
              <FaSave /> Save
            </button>
            <button
              onClick={onClose}
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
