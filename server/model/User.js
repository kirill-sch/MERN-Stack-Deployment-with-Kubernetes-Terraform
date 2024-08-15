import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  email: String,
  profilePicture: String,
  userPreferences: Object,
  baseStat: Number,
  createdAt: Date
});

export default model('User', userSchema);