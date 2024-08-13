import mongoose from "mongoose";
const { Schema, model } = mongoose;

const dislikesSchema = new Schema({
  name: String,
  when: Date
});


export default model('Disikes', dislikesSchema);