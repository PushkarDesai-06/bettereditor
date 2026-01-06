import mongoose, { Schema, Model } from "mongoose";

export interface IImage {
  _id: string;
  userId: string;
  title: string;
  tags: string[];
  imageData: string; // Base64 encoded image
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
