import mongoose, { Schema, Document } from "mongoose";

export interface IFolder extends Document {
  link: string;
  category: Schema.Types.ObjectId;
  cover_image: string;
  title: string;
  description: string;
  user_id: Schema.Types.ObjectId;
}

const FolderSchema: Schema = new Schema(
  {
    link: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    cover_image: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export default mongoose.model<IFolder>("Folder", FolderSchema);
