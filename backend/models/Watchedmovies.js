import mongoose from "mongoose";

const {Schema} = mongoose;
const WatchedMoviesSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    movies: [{ type:Number,require:true }] 
}, {
    timestamps: true
}); 
export default mongoose.model('WatchedMovies', WatchedMoviesSchema);