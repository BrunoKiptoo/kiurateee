import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  title: string;
  description: string;
  cover_image: string;
  videos?: Schema.Types.ObjectId[];
}

const CategorySchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  cover_image: { type: String, required: true },
  videos: [{ type: Schema.Types.ObjectId, ref: "Video" }],
});

export default mongoose.model<ICategory>("Category", CategorySchema);
