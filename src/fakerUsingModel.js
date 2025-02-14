import * as dotenv from 'dotenv';
process.env.NODE_ENV == 'prod'
  ? dotenv.config({ path: './.env.prod' })
  : dotenv.config({ path: './.env.local' });
import faker from 'faker';
import axios from 'axios';
import { User } from './models/index.js';

const URI = process.env.URI;

export const generateFakeData = async (
  userCount,
  blogsPerUser,
  commentsPerUser,
) => {
  try {
    if (typeof userCount !== 'number' || userCount < 1)
      throw new Error('userCount must be a positive integer');
    if (typeof blogsPerUser !== 'number' || blogsPerUser < 1)
      throw new Error('blogsPerUser must be a positive integer');
    if (typeof commentsPerUser !== 'number' || commentsPerUser < 1)
      throw new Error('commentsPerUser must be a positive integer');
    let users = [];
    let blogs = [];
    let comments = [];

    for (let i = 0; i < userCount; i++) {
      users.push(
        new User({
          username: faker.internet.userName() + parseInt(Math.random() * 100),
          name: {
            first: faker.name.firstName(),
            last: faker.name.lastName(),
          },
          age: 10 + parseInt(Math.random() * 50),
          email: faker.internet.email(),
        }),
      );
    }

    console.log('fake data inserting to database...');

    await User.insertMany(users);
    console.log(`${users.length} fake users generated!`);

    users.forEach((user) => {
      for (let i = 0; i < blogsPerUser; i++) {
        blogs.push(
          axios.post(`${URI}/blog`, {
            title: faker.lorem.words(),
            content: faker.lorem.paragraphs(),
            isLive: true,
            userId: user.id,
          }),
        );
      }
    });

    let newBlogs = await Promise.all(blogs);
    console.log(`${newBlogs.length} fake blogs generated!`);

    users.forEach((user) => {
      for (let i = 0; i < commentsPerUser; i++) {
        let index = Math.floor(Math.random() * blogs.length);
        comments.push(
          axios.post(`${URI}/blog/${newBlogs[index].data.blog._id}/comment`, {
            content: faker.lorem.sentence(),
            userId: user.id,
          }),
        );
      }
    });

    await Promise.all(comments);
    console.log(`${comments.length} fake comments generated!`);
    console.log('COMPLETE!!');
  } catch (err) {
    console.log(err);
  }
};
