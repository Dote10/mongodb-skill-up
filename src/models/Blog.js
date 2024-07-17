import { model, Schema, Types } from 'mongoose';

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    isLive: { type: Boolean, require: true, default: false },
    user: { type: Types.ObjectId, required: true, ref: 'user' },
  },
  { timestamps: true },
);

export const Blog = model('blog', BlogSchema);
