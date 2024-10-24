import { Schema, model, Document } from "mongoose";

interface IVideodata {
  author_name: string;
  author_url: string;
  height: number;
  html: string;
  provider_name: string;
  provider_url: string;
  thumbnail_height: number;
  thumbnail_url: string;
  thumbnail_width: number;
  title: string;
  type: string;
  version: string;
  width: number;
  thumbnail: string;
}

interface IVideo extends Document {
  videoId: string;
  source: string;
  category: Schema.Types.ObjectId;
  date: Date;
  videodata: IVideodata;
  user: Schema.Types.ObjectId;
}

const videoSchema = new Schema<IVideo>({
  videoId: { type: String, required: true },
  source: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  date: { type: Date, default: Date.now },
  videodata: { type: Object, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Video = model<IVideo>("Video", videoSchema);
export default Video;
