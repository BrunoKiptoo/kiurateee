"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = upload;
// src/shared/uploads/uploads.ts
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const env_1 = require("../../config/env");
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: env_1.accessKey,
    secretAccessKey: env_1.secretKey,
});
const filterImageFile = (_req, file, cb) => {
    const allowedMimeTypes = [
        "image/png",
        "image/jpg",
        "image/jpeg"
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Invalid file type! Only image files are allowed."), false);
    }
};
function upload() {
    return (0, multer_1.default)({
        fileFilter: filterImageFile,
        storage: (0, multer_s3_1.default)({
            s3,
            bucket: env_1.bucketName,
            acl: "public-read",
            metadata: (_reqst, _file, cb) => {
                cb(null, { fieldName: _file.fieldname });
            },
            key: (_request, file, cb) => {
                cb(null, `${file.fieldname}/${Date.now()}-${file.originalname}`);
            },
        }),
        limits: { fileSize: 10000000 }, // 10 Mb
    });
}
//# sourceMappingURL=uploads.js.map