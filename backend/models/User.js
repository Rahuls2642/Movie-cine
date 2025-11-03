import mongoose from "mongoose";
const { Schema } = mongoose;
import isEmail from "validator/lib/isEmail.js";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validator: {
        validator: (v) => isEmail(v),
        message: "Invalid email format",
      },
    },
    password: { type: String, required: true, minlength: 6 },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};


export default mongoose.model("User", userSchema);
