import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
  title: string;
  description: string;
  cover_image: string;
}

const AdminSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  cover_image: { type: String, required: true },
});

export default mongoose.model<IAdmin>("Category", AdminSchema);
