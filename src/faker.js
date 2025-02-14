import faker from 'faker';
import { User, Blog, Comment } from './models/index.js';

export const generateFakeData = async (
  userCount,
  blogsPerUser,
  commentsPerUser,
) => {
  if (typeof userCount !== 'number' || userCount < 1)
    throw new Error('userCount must be a positive integer');
  if (typeof blogsPerUser !== 'number' || blogsPerUser < 1)
    throw new Error('blogsPerUser must be a positive integer');
  if (typeof commentsPerUser !== 'number' || commentsPerUser < 1)
    throw new Error('commentsPerUser must be a positive integer');
  const users = [];
  const blogs = [];
  const comments = [];
  console.log('Preparing fake data.');

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

  users.forEach((user) => {
    for (let i = 0; i < blogsPerUser; i++) {
      blogs.push(
        new Blog({
          title: faker.lorem.words(),
          content: faker.lorem.paragraphs(),
          isLive: true,
          user,
        }),
      );
    }
  });

  users.forEach((user) => {
    for (let i = 0; i < commentsPerUser; i++) {
      let index = Math.floor(Math.random() * blogs.length);
      comments.push(
        new Comment({
          content: faker.lorem.sentence(),
          user,
          blog: blogs[index]._id,
        }),
      );
    }
  });

  console.log('fake data inserting to database...');
  await User.insertMany(users);
  console.log(`${users.length} fake users generated!`);
  await Blog.insertMany(blogs);
  console.log(`${blogs.length} fake blogs generated!`);
  await Comment.insertMany(comments);
  console.log(`${comments.length} fake comments generated!`);
  console.log('COMPLETE!!');
};
