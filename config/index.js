import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"

// Configuration
export default multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "soluzioni",
    },
  }),
}).single("avatar")
