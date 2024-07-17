import { Schema, model, Types } from 'mongoose';

const CommentSchema = new Schema(
  {
    content: { type: String, require: true },
    user: { type: Types.ObjectId, require: true, ref: 'user' },
    blog: { type: Types.ObjectId, require: true, ref: 'blog' },
  },
  { timestamp: true },
);

export const Comment = model('comment', CommentSchema);
