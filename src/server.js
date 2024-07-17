import * as dotenv from 'dotenv';
process.env.NODE_ENV == 'prod'
  ? dotenv.config({ path: './.env.prod' })
  : dotenv.config({ path: './.env.local' });
import express, { json } from 'express';
import mongoose, { connect } from 'mongoose';
import { blogRouter, commentRouter, userRouter } from './routes/index.js';
import { generateFakeData } from './faker.js';

const app = express();

//Database 설정
let mongodbConnection = await connect(process.env.MONGO_URI);
mongoose.set('debug', true);

if (mongodbConnection) {
  console.log('MongoDB connected');
  //await generateFakeData(20, 5, 30);
}

//body-parse 역할
app.use(json());
app.use('/user', userRouter);
app.use('/blog', blogRouter);
app.use('/blog/:blogId/comment', commentRouter);

app.listen(4000, () => {
  console.log('server listeing on port 4000');
});
