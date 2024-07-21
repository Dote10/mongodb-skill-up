import { Router } from 'express';
import {
  changeBlog,
  changeBlogIsLive,
  createBlog,
  findAllBlog,
  findBlog,
} from '../controllers/blogController.js';

export const blogRouter = Router();

blogRouter.post('/', createBlog);

blogRouter.get('/', findAllBlog);

blogRouter.get('/:blogId', findBlog);

blogRouter.put('/:blogId', changeBlog);

blogRouter.patch('/:blogId/live', changeBlogIsLive);
