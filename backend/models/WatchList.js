import mongoose from "mongoose";
const { Schema } = mongoose;
const WatchListSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    movieId: { type: Number, require: true },
    title: { type: String },
    posterPath: { type: String },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("WatchList", WatchListSchema);
