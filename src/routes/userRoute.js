import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/index.js';
import { isValidObjectId } from 'mongoose';
import { createUser, updateUser } from '../controllers/userController.js';

//userRouter 인스턴스만들기
export const userRouter = Router();

/**
 * GET - 모든 user 반환
 */
userRouter.get('/', createUser);

/**
 * GET - param userId에 해당하는 user 반환
 */
userRouter.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId))
    return res.status(400).send({ err: 'Invalid userId' });

  try {
    const user = await User.findOne({ _id: userId });
    return res.send({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ err: error.message });
  }
});

/**
 * POST - user 생성
 */
userRouter.post(
  '/',
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
  },
);

/**
 * DELETE - user삭제
 */
userRouter.delete('/:userId', async (req, res) => {
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
 * PATCH - user name과 age 수정
 */

userRouter.patch(
  '/:userId',
  [
    body('name').notEmpty().withMessage('name이 비어있습니다.'),
    body('age').notEmpty().withMessage('age가 비어있습니다.'),
  ],
  updateUser,
);

/**
 * PATCH - user의 age 수정
 */
//   userRouter.patch('/:userId',[
//       body('age').notEmpty().withMessage('age가 비어있습니다.'),
//     ],async(req, res) =>{

//       const { userId } = req.params;

//       if (!isValidObjectId(userId))
//           return res.status(400).send({ err: 'Invalid userId' });

//         const validationError = validationResult(req);

//         if (validationError.errors.length > 0) {
//           return res.status(400).send({ err: validationError.array() });
//         }

//       try {
//            const { age }= req.body;
//            const user = await User.findByIdAndUpdate(userId, { age } , { new : true} );
//            return res.send({user});
//         } catch (error) {
//           console.log(error);
//           return res.status(500).send({ err: error.message });
//         }
//   });
