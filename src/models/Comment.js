import { Schema, model, Types } from 'mongoose';

export const CommentSchema = new Schema(
  {
    content: { type: String, require: true },
    user: { type: Types.ObjectId, require: true, ref: 'user' },
    userFullName: { type: String, required: true },
    blog: { type: Types.ObjectId, require: true, ref: 'blog' },
  },
  { timestamp: true },
);

export const Comment = model('comment', CommentSchema);
