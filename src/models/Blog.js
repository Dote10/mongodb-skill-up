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

BlogSchema.virtual('comments', {
  ref: 'comment',
  localField: '_id',
  foreignField: 'blog',
});

//설정
BlogSchema.set('toObject', { virtuals: true });
BlogSchema.set('toJSON', { virtuals: true });

export const Blog = model('blog', BlogSchema);
