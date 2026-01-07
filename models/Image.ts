import mongoose, { Schema, Model } from "mongoose";

export interface IImage {
  _id: string;
  userId: string;
  title: string;
  tags: string[];
  imageData: string; // Base64 encoded image
  filters?: {
    blur: number;
    brightness: number;
    contrast: number;
    grayscale: number;
    hueRotate: number;
    saturate: number;
    sepia: number;
    invert: number;
    opacity: number;
  };
  originalSize: number;
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema<IImage>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  imageData: {
    type: String,
    required: true,
  },
  filters: {
    type: {
      blur: { type: Number, required: true },
      brightness: { type: Number, required: true },
      contrast: { type: Number, required: true },
      grayscale: { type: Number, required: true },
      hueRotate: { type: Number, required: true },
      saturate: { type: Number, required: true },
      sepia: { type: Number, required: true },
      invert: { type: Number, required: true },
      opacity: { type: Number, required: true },
    },
    required: false,
  },
  originalSize: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ImageSchema.index({ userId: 1, title: 1 });
ImageSchema.index({ userId: 1, tags: 1 });

const Image: Model<IImage> =
  mongoose.models.Image || mongoose.model<IImage>("Image", ImageSchema);

export default Image;
