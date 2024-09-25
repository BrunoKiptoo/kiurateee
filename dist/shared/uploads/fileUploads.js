"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coverImageUpload = coverImageUpload;
const uploads_1 = require("./uploads");
const multer_1 = require("multer");
function coverImageUpload(req, res, next) {
    const uploadMiddleware = (0, uploads_1.upload)().single("cover_image");
    uploadMiddleware(req, res, (err) => {
        if (err instanceof multer_1.MulterError) {
            console.log(err);
            return res.status(400).json({
                status: "Failed",
                message: "File Upload Error",
            });
        }
        if (!err) {
            return next();
        }
        return next(err);
    });
}
//# sourceMappingURL=fileUploads.js.map