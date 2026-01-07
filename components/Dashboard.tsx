"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import PhotoEditor from "@/components/PhotoEditor";
import type { FilterSettings } from "@/components/PhotoEditor";
import ImageUpload from "@/components/ImageUpload";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaSignOutAlt,
  FaImage,
  FaEllipsisV,
  FaDownload,
} from "react-icons/fa";

interface Image {
  _id: string;
  title: string;
  tags: string[];
  imageData: string;
  filters?: FilterSettings;
  originalSize: number;
  createdAt: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [editingImage, setEditingImage] = useState<Image | null>(null);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const burgerButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>(
    {}
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchImages();
    }
  }, [status, router]);

  const fetchImages = async (search?: string) => {
    try {
      const url = search
        ? `/api/images?search=${encodeURIComponent(search)}`
        : "/api/images";
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setImages(data.images);
      }
    } catch (error) {
      console.error("Failed to fetch images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchImages(searchQuery);
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchImages(searchQuery);
      }
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  const handleEditClick = (image: Image) => {
    setSelectedImage(image);
    setShowEditor(true);
  };

  const handleSaveEdit = async (
    editedImageData: string,
    filters: FilterSettings
  ) => {
    if (!selectedImage) return;

    try {
      const response = await fetch(`/api/images/${selectedImage._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filters,
        }),
      });

      if (response.ok) {
        setShowEditor(false);
        setSelectedImage(null);
        fetchImages(searchQuery);
      }
    } catch (error) {
      console.error("Failed to save edited image:", error);
    }
  };

  const handleUpdateMetadata = async (
    imageId: string,
    title: string,
    tags: string[]
  ) => {
    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, tags }),
      });

      if (response.ok) {
        setEditingImage(null);
        fetchImages(searchQuery);
      }
    } catch (error) {
      console.error("Failed to update image:", error);
    }
  };

  const handleExportImage = (image: Image) => {
    // Create a canvas to apply filters if they exist
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");

      if (ctx && image.filters) {
        // Apply filters
        const {
          blur,
          brightness,
          contrast,
          grayscale,
          hueRotate,
          saturate,
          sepia,
          invert,
          opacity,
        } = image.filters;
        ctx.filter = `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) hue-rotate(${hueRotate}deg) saturate(${saturate}%) sepia(${sepia}%) invert(${invert}%) opacity(${opacity}%)`;
        ctx.drawImage(img, 0, 0);

        // Download filtered image
        const link = document.createElement("a");
        link.download = `${image.title.replace(/\s+/g, "-")}-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } else {
        // Download original image
        const link = document.createElement("a");
        link.download = `${image.title.replace(/\s+/g, "-")}-${Date.now()}.png`;
        link.href = image.imageData;
        link.click();
      }
    };

    img.src = image.imageData;
    setOpenMenuId(null);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaImage className="text-blue-500" size={28} />
            <h1 className="text-white text-2xl font-bold">PhotoEditor</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">
              {images.length}/10 images used
            </span>
            <span className="text-gray-300">{session.user.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaSignOutAlt size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Upload Bar */}
        <div className="flex gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or tags..."
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Search
            </button>
          </form>

          <button
            onClick={() => setShowUpload(true)}
            disabled={images.length >= 10}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPlus /> Upload Image
          </button>
        </div>

        {/* Images Grid */}
        {images.length === 0 ? (
          <div className="text-center py-16">
            <FaImage className="mx-auto text-gray-700 mb-4" size={64} />
            <h3 className="text-gray-400 text-xl mb-2">No images yet</h3>
            <p className="text-gray-600">
              Upload your first image to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div
                key={image._id}
                className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors"
              >
                {/* Image */}
                <div className="aspect-video bg-gray-800 relative group">
                  <img
                    src={image.imageData}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleEditClick(image)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors"
                      title="Edit Image"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(image._id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors"
                      title="Delete Image"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </div>

                {/* Image Info */}
                <div className="p-4">
                  {editingImage?._id === image._id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        defaultValue={image.title}
                        onBlur={(e) => {
                          const newTags = editingImage.tags;
                          handleUpdateMetadata(
                            image._id,
                            e.target.value,
                            newTags
                          );
                        }}
                        className="w-full bg-gray-800 text-white px-2 py-1 rounded border border-gray-700"
                      />
                      <input
                        type="text"
                        defaultValue={image.tags.join(", ")}
                        onBlur={(e) => {
                          const newTags = e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter((t) => t);
                          handleUpdateMetadata(
                            image._id,
                            editingImage.title,
                            newTags
                          );
                        }}
                        className="w-full bg-gray-800 text-white px-2 py-1 rounded border border-gray-700 text-sm"
                        placeholder="Tags (comma-separated)"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <div
                        onClick={() => setEditingImage(image)}
                        className="cursor-pointer"
                      >
                        <h3 className="text-white font-semibold mb-2 pr-8">
                          {image.title}
                        </h3>
                        {image.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {image.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-gray-500 text-xs">
                          {new Date(image.createdAt).toLocaleDateString()} •{" "}
                          {(image.originalSize / (1024 * 1024)).toFixed(2)}MB
                        </p>
                      </div>
                      {/* Burger Menu */}
                      <div className="absolute top-0 right-0">
                        <button
                          ref={(el) => {
                            if (el) burgerButtonRefs.current[image._id] = el;
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (openMenuId === image._id) {
                              setOpenMenuId(null);
                              setMenuPosition(null);
                            } else {
                              const rect =
                                burgerButtonRefs.current[
                                  image._id
                                ]?.getBoundingClientRect();
                              if (rect) {
                                setMenuPosition({
                                  top: rect.bottom + window.scrollY + 4,
                                  left: rect.right + window.scrollX - 160, // 160px = min-w-40 * 4
                                });
                              }
                              setOpenMenuId(image._id);
                            }
                          }}
                          className="text-gray-400 hover:text-white p-1 transition-colors"
                          title="Options"
                        >
                          <FaEllipsisV size={16} />
                        </button>
                        {openMenuId === image._id &&
                          menuPosition &&
                          typeof window !== "undefined" &&
                          createPortal(
                            <div
                              className="fixed bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden min-w-40"
                              style={{
                                top: `${menuPosition.top}px`,
                                left: `${menuPosition.left}px`,
                                zIndex: 9999,
                              }}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingImage(image);
                                  setOpenMenuId(null);
                                  setMenuPosition(null);
                                }}
                                className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors text-sm flex items-center gap-2"
                              >
                                <FaEdit size={14} /> Edit Details
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleExportImage(image);
                                }}
                                className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors text-sm flex items-center gap-2"
                              >
                                <FaDownload size={14} /> Export Image
                              </button>
                            </div>,
                            document.body
                          )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showUpload && (
        <ImageUpload
          onUploadSuccess={() => {
            setShowUpload(false);
            fetchImages(searchQuery);
          }}
          onClose={() => setShowUpload(false)}
        />
      )}

      {showEditor && selectedImage && (
        <PhotoEditor
          imageData={selectedImage.imageData}
          initialFilters={selectedImage.filters}
          onSave={handleSaveEdit}
          onClose={() => {
            setShowEditor(false);
            setSelectedImage(null);
          }}
        />
      )}
    </div>
  );
}
