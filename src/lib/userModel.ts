import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  age: number;
  email: string;
  password: string;
  phone: string;
  tier: "basic" | "plus" | "pro" | "enterprise";
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  tier: { type: String, enum: ["basic", "plus", "pro", "enterprise"], default: "basic" },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
