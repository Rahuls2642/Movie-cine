import mongoose from "mongoose";

const {Schema} = mongoose;
const WatchedMoviesSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    movieId: { type:Number,require:true } ,
    title: { type: String  },
    posterPath: { type: String  }   
}, {
    timestamps: true
}); 
export default mongoose.model('WatchedMovies', WatchedMoviesSchema);