import * as dotenv from "dotenv";
process.env.NODE_ENV == "prod"
  ? dotenv.config({ path: "./.env.prod" })
  : dotenv.config({ path: "./.env.local" });
import express, { json } from "express";
import { connect } from "mongoose";
import { User } from "./models/User.js";
import { body, validationResult } from "express-validator";

const app = express();

let mongodbConnection = await connect(process.env.MONGO_URI);

if (mongodbConnection) {
  console.log("MongoDB connected");
}

//body-parse 역할
app.use(json());

app.get("/user", async (req, res) => {
  try {
    const users = await User.find({});
    return res.send({ users });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ err: error.message });
  }
});

app.post(
  "/user",
  [
    body("username").notEmpty().withMessage("username이 비어있습니다."),
    body("name").notEmpty().withMessage("name이 비어있습니다."),
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
      console.log(error);
      return res.status(500).send({ err: error.message });
    }
  }
);

app.listen(4000, () => {
  console.log("server listeing on port 4000");
});
