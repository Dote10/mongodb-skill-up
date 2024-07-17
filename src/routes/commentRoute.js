import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { isValidObjectId } from 'mongoose';
import { User, Blog, Comment } from '../models/index.js';

export const commentRouter = Router({ mergeParams: true });

/**
 *   /comment  독립적으로 호출하지 않는다.
 *   /blog/:blogId/comment
 */

commentRouter.post('/', async (req, res) => {
  const validationResult = await checkSchema(
    {
      content: {
        notEmpty: { errorMessage: 'content이 값이 오지 않았습니다.' },
        isString: { errorMessage: 'content는 문자열이어야 합니다.' },
      },
      userId: {
        notEmpty: { errorMessage: 'user이 값이 오지 않았습니다.' },
      },
    },
    ['body'],
  ).run(req);

  const validationError = validationResult
    .filter((err) => err.errors.length > 0)
    .map((err) => err.errors[0]);

  if (validationError.length > 0) {
    return res.status(400).send({ err: validationError });
  }

  const { content, userId } = req.body;

  if (!isValidObjectId(userId)) {
    return res.status(400).send({ err: '유효하지 않은 userId 타입 입니다.' });
  }

  const { blogId } = req.params;

  if (!isValidObjectId(blogId)) {
    return res.status(400).send({ err: '유효하지 않은 blogId 타입 입니다.' });
  }

  try {
    const [user, blog] = await Promise.all([
      User.findById(userId),
      Blog.findById(blogId),
    ]);

    if (!user || !blog) {
      return res.status(400).send({ err: '존재하지 않는 user or blog입니다.' });
    }

    if (!blog.isLive) {
      return res.status(400).send({ err: '아직 게시 되지 않은 blog입니다.' });
    }

    const comment = new Comment({ content, user, blog });
    await comment.save();

    return res.status(400).send({ comment });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ err: error.message });
  }
});

commentRouter.get('/', async (req, res) => {
  const { blogId } = req.params;

  if (!isValidObjectId(blogId)) {
    return res.status(400).send({ err: '유효하지 않은 blogId 타입 입니다.' });
  }

  try {
    const comments = await Comment.find({ blog: blogId });
    return res.status(400).send(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ err: error.message });
  }
});
