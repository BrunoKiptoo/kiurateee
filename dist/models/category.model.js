"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String },
    coverImage: { type: String },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }
});
const Category = (0, mongoose_1.model)('Category', categorySchema);
exports.default = Category;
//# sourceMappingURL=category.model.js.map