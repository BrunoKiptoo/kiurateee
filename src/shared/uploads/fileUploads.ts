// src/shared/uploads/fileUploads.ts
import { Request, Response, NextFunction } from "express";
import { upload } from "./uploads";
import { MulterError } from "multer";

export function coverImageUpload(req: Request, res: Response, next: NextFunction) {
  const uploadMiddleware = upload().single("cover_image");
  uploadMiddleware(req, res, (err: any) => {
    if (err instanceof MulterError) {
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
