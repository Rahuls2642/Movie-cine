import mongoose from "mongoose";
const {Schema} = mongoose;

const MovieSchema = new Schema({
    title: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    genre: { type: [String], required: true },
    director: { type: String, required: true }
}, {
    timestamps: true
}); 
export default mongoose.model('Movie', MovieSchema);