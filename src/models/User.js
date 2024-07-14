import { model, Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    name: {
      first: { type: String, require: true },
      last: { type: String, require: true },
    },
    //age: {type:Nmber}
    age: Number,
    email: String,
  },
  { timestamps: true }
);

//mongoose에 모델 등록
export const User = model('user', UserSchema);
