import { Schema, model, Document } from 'mongoose';

interface ICategory extends Document {
    title: string;
    description?: string;
    coverImage?: string;
    userId: Schema.Types.ObjectId;
}

const categorySchema = new Schema<ICategory>({
    title: { type: String, required: true },
    description: { type: String },
    coverImage: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
});

const Category = model<ICategory>('Category', categorySchema);
export default Category;
