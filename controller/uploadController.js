import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from '../config/cloudinaryConfig.js';

// 🔹 Step 1: File type filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("❌ Only PNG, JPG, JPEG files are allowed"), false);
    }
};

// 🔹 Step 2: Cloudinary storage with custom filename
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'uploads',
        format: async () => 'jpg', // optional: force jpg
        public_id: (req, file) => Date.now() + '-' + file.originalname.split('.')[0]
    }
});

// 🔹 Step 3: Multer upload instance
const upload = multer({
    storage,
    fileFilter
});

// 🔹 Step 4: Controller function
export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        res.status(200).json({
            message: "✅ File uploaded successfully",
            file: {
                url: req.file.path,
                filename: req.file.filename,
                type: req.file.mimetype
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Export multer middleware separately to use in routes
export const uploadMiddleware = upload.single('file');
