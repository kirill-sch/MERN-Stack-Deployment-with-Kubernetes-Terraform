import mongoose from "mongoose";
const { Schema, model } = mongoose;

const messageSchema = new Schema({
  content: String,
  when: String,
  
});

export default model('Message', messageSchema);