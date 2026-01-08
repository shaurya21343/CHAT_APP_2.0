import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema({
    profilePhoto: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, default: 'offline'  }
}, { timestamps: true });

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const validatePassword = async function (this: any, password: string) {
  return bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", UserSchema);



export { User, validatePassword };