import { isValidObjectId } from 'mongoose';
import { Blog, User } from '../models/index.js';
import { checkSchema } from 'express-validator';

export const createBlog = async (req, res) => {
  const validationResult = await checkSchema(
    {
      title: {
        notEmpty: { errorMessage: 'title이 값이 오지 않았습니다.' },
        isString: { errorMessage: 'title은 문자열이어야 합니다.' },
      },
      content: {
        notEmpty: { errorMessage: 'content이 값이 오지 않았습니다.' },
        isString: { errorMessage: 'content는 문자열이어야 합니다.' },
      },
      isLive: {
        notEmpty: { errorMessage: 'isLive이 값이 오지 않았습니다.' },
        isBoolean: { errorMessage: 'title은 boolean 타입이어야 합니다.' },
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

  const { userId } = req.body;

  if (!isValidObjectId(userId)) {
    return res.status(400).send({ err: 'Invaliad UserId' });
  }

  try {
    //실제 존재하는 User인지 조회
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(400)
        .send({ err: '존재하지 않는 user의 userId 입니다.' });
    }

    let blog = new Blog({ ...req.body, user });
    await blog.save();

    return res.send({ blog });
  } catch (error) {
    console.error(error);
    res.status(500).send({ err: error.message });
  }
};

export const findAllBlog = async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .limit(200)
      .populate([
        { path: 'user' },
        { path: 'comments', populate: { path: 'user' } },
      ]);

    return res.send({ blogs });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ err: error.message });
  }
};

export const findBlog = async (req, res) => {
  const { blogId } = req.params;
  if (!isValidObjectId(blogId)) {
    return res
      .status(400)
      .send({ err: '요청하신 블로그id는 유효하지 않습니다.' });
  }
  try {
    const blog = await Blog.findById(blogId);
    return res.send({ blog });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ err: error.message });
  }
};

export const changeBlog = async (req, res) => {
  const validationResult = await checkSchema(
    {
      title: {
        notEmpty: { errorMessage: 'title이 값이 오지 않았습니다.' },
        isString: { errorMessage: 'title은 문자열이어야 합니다.' },
      },
      content: {
        notEmpty: { errorMessage: 'content이 값이 오지 않았습니다.' },
        isString: { errorMessage: 'content는 문자열이어야 합니다.' },
      },
      isLive: {
        notEmpty: { errorMessage: 'isLive이 값이 오지 않았습니다.' },
        isBoolean: { errorMessage: 'isLive은 boolean 타입이어야 합니다.' },
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

  const { blogId } = req.params;

  if (!isValidObjectId(blogId)) {
    return res.status(400).send({ err: '유효한 블로그ID가 아닙니다.' });
  }
  try {
    const blog = await Blog.findByIdAndUpdate(blogId, req.body, { new: true });

    if (!blog) {
      return res
        .status(400)
        .send({ err: '해당 블로그ID의 블로그가 존재하지 않습니다.' });
    }

    return res.send({ blog });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ err: error.message });
  }
};

export const changeBlogIsLive = async (req, res) => {
  const [validationError] = await checkSchema({
    isLive: {
      notEmpty: { errorMessage: 'isLive이 값이 오지 않았습니다.' },
      isBoolean: { errorMessage: 'title은 boolean 타입이어야 합니다.' },
    },
  }).run(req);

  if (validationError.errors.length > 0) {
    console.log(validationError);
    return res.status(400).send({ err: validationError.array() });
  }

  const { blogId } = req.params;

  if (!isValidObjectId(blogId)) {
    return res.status(400).send({ err: '유효한 블로그ID가 아닙니다.' });
  }

  try {
    const blog = await Blog.findByIdAndUpdate(blogId, req.body, { new: true });
    return res.send({ blog });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ err: error.message });
  }
};
