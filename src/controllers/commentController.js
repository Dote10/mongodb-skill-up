import { checkSchema } from 'express-validator';
import { isValidObjectId } from 'mongoose';
import { Blog, Comment, User } from '../models/index.js';

export const createComment = async (req, res) => {
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

    const comment = new Comment({
      content,
      user,
      userFullName: `${user.name.first} ${user.name.last}`,
      blog,
    });

    //comment생성 뿐 아니라
    //해당 comment를 내장하게될 blog의 정보도 수정
    await Promise.all([
      await comment.save(),
      await Blog.updateOne({ _id: blogId }, { $push: { comments: comment } }),
    ]);

    return res.send({ comment });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ err: error.message });
  }
};

export const findAllComment = async (req, res) => {
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
};

export const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  const validationResult = await checkSchema(
    {
      content: {
        notEmpty: { onErrorMesage: 'constent 값은 필수입니다.' },
        isString: { onErrorMesage: 'content는 문자열이어야 합니다.' },
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

  //blog 내장comment 수정추가
  try {
    const [comment] = await Promise.all([
      Comment.findOneAndUpdate({ _id: commentId }, { content }, { new: true }),
      Blog.updateOne(
        { 'comments._id': commentId },
        { 'comments.$.content': content },
      ),
    ]);

    return res.send({ comment });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ err: error.massage });
  }
};
