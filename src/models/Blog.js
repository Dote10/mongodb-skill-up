import { model, Schema, Types } from 'mongoose';
import { CommentSchema } from './Comment.js';

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    isLive: { type: Boolean, require: true, default: false },
    user: {
      _id: { type: Types.ObjectId, required: true, ref: 'user' },
      //user에서 username unique는 true지만
      //comment에서는 user가 여러 comment를 쓸수
      //있으므로 username이 unique하지 않다.
      username: { type: String, require: true },
      name: {
        first: { type: String, require: true },
        last: { type: String, require: true },
      },
    },
    comments: [CommentSchema],
  },
  { timestamps: true },
);

// BlogSchema.virtual('comments', {
//   ref: 'comment',
//   localField: '_id',
//   foreignField: 'blog',
// });

//설정
// BlogSchema.set('toObject', { virtuals: true });
// BlogSchema.set('toJSON', { virtuals: true });

export const Blog = model('blog', BlogSchema);
