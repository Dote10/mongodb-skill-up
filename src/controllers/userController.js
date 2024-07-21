import { isValidObjectId } from 'mongoose';
import { Blog, User } from '../models/index.js';
import { validationResult } from 'express-validator';

export const createUser = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send({ users });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ err: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    return res.status(400).send({ err: 'Invalid userId' });
  }

  const validationError = validationResult(req);

  if (validationError.errors.length > 0) {
    return res.status(400).send({ err: validationError.array() });
  }

  try {
    const { name, age } = req.body;

    let user = await User.findById(userId);
    if (age) user.age = age;
    if (name) {
      user.name = name;
      //blog,comment의 내장 user 정보 수정
      await Promise.all([
        Blog.updateMany({ 'user._id': userId }, { 'user.name': name }),
        Blog.updateMany(
          {},
          { 'comments.$[comment].userFullName': `${name.first} ${name.last}` },
          { arrayFilters: [{ 'comment.user': userId }] },
        ),
      ]);
    }

    //실제적으로 updateOne()이 호출된다.
    const updateUser = await user.save();

    return res.send({ user: updateUser });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ err: error.message });
  }
};
