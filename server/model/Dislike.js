import mongoose from "mongoose";
const { Schema, model } = mongoose;

const dislikeSchema = new Schema({
  dislikedBy: String,
  dislikedCharacterId: String,
  dislikedAt: Date
});

export default model('Disike', dislikeSchema);