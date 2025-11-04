import mongoose from "mongoose";
const { Schema } = mongoose;
const ReviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    movieId: { type:Number , required: true },//TMDB movie ID
    rating: { type: Number, required: true, min: 1, max: 10 },
    comment: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Review", ReviewSchema);
