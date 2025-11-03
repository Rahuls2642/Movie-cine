import mongoose from "mongoose";
const { Schema } = mongoose;
const ReviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    movie: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
    rating: { type: Number, required: true, min: 1, max: 10 },
    review: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Review", ReviewSchema);
