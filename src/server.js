import * as dotenv from 'dotenv';
process.env.NODE_ENV == 'prod'
  ? dotenv.config({ path: './.env.prod' })
  : dotenv.config({ path: './.env.local' });
import express, { json } from 'express';
import { connect, isValidObjectId } from 'mongoose';
import { User } from './models/User.js';
import { body, validationResult } from 'express-validator';

const app = express();

let mongodbConnection = await connect(process.env.MONGO_URI);

if (mongodbConnection) {
  console.log('MongoDB connected');
}

//body-parse 역할
app.use(json());

/**
 * GET - 모든 user 반환
 */
app.get('/user', async (req, res) => {
  try {
    const users = await User.find({});
    return res.send({ users });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ err: error.message });
  }
});

/**
 * GET - param userId에 해당하는 user 반환
 */
app.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId))
    return res.status(400).send({ err: 'Invalid userId' });

  try {
    const user = await User.findOne({ _id: userId });
    return res.send({ user });
  } catch (error) {
    console.error(error)
    return res.status(500).send({ err: error.message });
  }
});

/**
 * POST - user 생성
 */
app.post(
  '/user',
  [
    body('username').notEmpty().withMessage('username이 비어있습니다.'),
    body('name').notEmpty().withMessage('name이 비어있습니다.'),
  ],
  async (req, res) => {
    const validationError = validationResult(req);

    if (validationError.errors.length > 0) {
      return res.status(400).send({ err: validationError.array() });
    }

    try {
      const user = new User(req.body);
      await user.save();
      res.send(user);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ err: error.message });
    }
  }
);

/**
 * DELETE - user삭제
 */
app.delete('/user/:userId', async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId))
        return res.status(400).send({ err: 'Invalid userId' });
   
  try {
    const users = await User.findOneAndDelete({ _id: userId });
    return res.send({ users });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ err: error.message });
  }
});

/**
 * P - user 수정
 */
app.patch('/user/:userId',[
    body('age').notEmpty().withMessage('age가 비어있습니다.'),
  ],async(req, res) =>{

    const { userId } = req.params;

    if (!isValidObjectId(userId))
        return res.status(400).send({ err: 'Invalid userId' });
  
      const validationError = validationResult(req);
  
      if (validationError.errors.length > 0) {
        return res.status(400).send({ err: validationError.array() });
      }

    try {
        const { userId } = req.params;
        if (!isValidObjectId(userId))
          return res.status(400).send({ err: 'Invalid userId' });
         const { age }= req.body;
         const user = await User.findByIdAndUpdate(userId, { age } , { new : true} );
         return res.send({user});
      } catch (error) {
        console.log(error);
        return res.status(500).send({ err: error.message });
      }
});


app.listen(4000, () => {
  console.log('server listeing on port 4000');
});
