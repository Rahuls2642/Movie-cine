import mongoose from "mongoose";
const { Schema } = mongoose;
const WatchListSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    movies: [{ type: Number, require: true }],
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("WatchList", WatchListSchema);
