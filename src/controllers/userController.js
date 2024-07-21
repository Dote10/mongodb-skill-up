import { User } from '../models/index.js';

export const createUser = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send({ users });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ err: error.message });
  }
};
