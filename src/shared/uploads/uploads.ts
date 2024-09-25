// src/shared/uploads/uploads.ts
import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import { Request } from "express";
import { accessKey, bucketName, secretKey } from "../../config/env";

const s3: any = new AWS.S3({
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
});

const filterImageFile = (_req: Request, file: Express.Multer.File, cb: (error: any, mime?: boolean) => void) => {
  const allowedMimeTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg"
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type! Only image files are allowed."), false);
  }
};

export function upload(): multer.Multer {
  return multer({
    fileFilter: filterImageFile,
    storage: multerS3({
      s3,
      bucket: bucketName as string,
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
