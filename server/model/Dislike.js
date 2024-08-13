import mongoose from "mongoose";
const { Schema, model } = mongoose;

const dislikeSchema = new Schema({
  likedBy: String,
  likedCharachter: String,
  likedAt: Date
});

export default model('Disike', dislikeSchema);