import { Schema, model, Document } from 'mongoose';

interface IMetadata {
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
    // thumbnail: string;
    userId: Schema.Types.ObjectId;
    date: Date;
    metadata: IMetadata;
}

const videoSchema = new Schema<IVideo>({
    videoId: { type: String, required: true },
    source: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    // thumbnail: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    metadata: { type: Object, required: true }
});

const Video = model<IVideo>('Video', videoSchema);
export default Video;
