import { Router } from 'express';
import multer from 'multer';
import { uploadThumbnail, uploadVideo } from '../controllers/uploadController';
import { authenticate, authorize } from '../middleware/auth';
import { uploadLimiter } from '../middleware/rateLimiter';
import { validateFileUpload } from '../middleware/sanitization';
import { Role } from '../types';

const router = Router();

// Configure multer for memory storage with security limits
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB max
    files: 1, // Only allow 1 file per request
    fields: 10, // Limit number of fields
  },
  fileFilter: (_req, file, cb) => {
    // Basic file filter - detailed validation in middleware
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'video/mp4',
      'video/webm',
      'video/ogg',
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

/**
 * @route   POST /api/upload/thumbnail
 * @desc    Upload course thumbnail image
 * @access  Private (Instructor, Admin)
 */
router.post(
  '/thumbnail',
  uploadLimiter,
  authenticate,
  authorize(Role.INSTRUCTOR, Role.ADMIN),
  upload.single('thumbnail'),
  validateFileUpload(
    ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    5 * 1024 * 1024 // 5MB
  ),
  uploadThumbnail
);

/**
 * @route   POST /api/upload/video
 * @desc    Upload lesson video
 * @access  Private (Instructor, Admin)
 */
router.post(
  '/video',
  uploadLimiter,
  authenticate,
  authorize(Role.INSTRUCTOR, Role.ADMIN),
  upload.single('video'),
  validateFileUpload(
    ['video/mp4', 'video/webm', 'video/ogg'],
    500 * 1024 * 1024 // 500MB
  ),
  uploadVideo
);

export default router;
