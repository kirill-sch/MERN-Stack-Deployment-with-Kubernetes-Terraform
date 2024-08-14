import mongoose from "mongoose";
const { Schema, model } = mongoose;

const likeSchema = new Schema({
  likedBy: String,
  likedCharacterId: String,
  likedAt: Date
});

export default model('Like', likeSchema);