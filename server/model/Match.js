import mongoose from "mongoose";
const { Schema, model } = mongoose;

const matchSchema = new Schema ({
    username: String,
    charactersName: String,
    charactersId: String,
    matchedAt: Date
});

export default model('Match', matchSchema, 'matches')