"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const videoSchema = new mongoose_1.Schema({
    videoId: { type: String, required: true },
    source: { type: String, required: true },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: "Category", required: true },
    date: { type: Date, default: Date.now },
    videodata: { type: Object, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
});
const Video = (0, mongoose_1.model)("Video", videoSchema);
exports.default = Video;
//# sourceMappingURL=video.model.js.map