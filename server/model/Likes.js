import mongoose from "mongoose";
const { Schema, model } = mongoose;

const likesSchema = new Schema({
  name: String,
  when: Date
});


export default model('Likes', likesSchema);