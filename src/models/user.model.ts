// src/models/user.model.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  mobileNumber: string;
  password: string;
  tag: string;
  resetCode?: number;
  selectedCategories: Schema.Types.ObjectId[];
  profile_picture?: {
    public_id: string;
    url: string;
  };
  following: Schema.Types.ObjectId[];
  followers: Schema.Types.ObjectId[];
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  password: { type: String, required: true },
  tag: { type: String, required: true, unique: true },
  resetCode: { type: Number },
  selectedCategories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  profile_picture: {
    public_id: { type: String },
    url: { type: String },
  },
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model<IUser>("User", UserSchema);
