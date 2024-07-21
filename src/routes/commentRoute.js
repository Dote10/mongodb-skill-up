import { Router } from 'express';
import {
  createComment,
  findAllComment,
  updateComment,
} from '../controllers/commentController.js';

export const commentRouter = Router({ mergeParams: true });

/**
 *   /comment  독립적으로 호출하지 않는다.
 *   /blog/:blogId/comment
 */

commentRouter.post('/', createComment);

commentRouter.get('/', findAllComment);

commentRouter.patch('/:commentId', updateComment);
