import { Request, Response } from 'express';
import { uploadToS3, generateFileKey, isS3Configured } from '../utils/s3';

/**
 * Upload thumbnail image
 */
export async function uploadThumbnail(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Check if S3 is configured
    if (!isS3Configured()) {
      return res.status(503).json({
        success: false,
        message: 'File storage is not configured. Please set up AWS S3 credentials.',
      });
    }

    // File validation is handled by middleware
    // Generate unique key
    const key = generateFileKey('thumbnails', req.file.originalname);

    // Upload to S3
    const url = await uploadToS3(req.file.buffer, key, req.file.mimetype);

    return res.status(200).json({
      success: true,
      message: 'Thumbnail uploaded successfully',
      data: { url },
    });
  } catch (error) {
    console.error('Upload thumbnail error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload thumbnail',
    });
  }
}

/**
 * Upload video file
 */
export async function uploadVideo(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Check if S3 is configured
    if (!isS3Configured()) {
      return res.status(503).json({
        success: false,
        message: 'File storage is not configured. Please set up AWS S3 credentials.',
      });
    }

    // File validation is handled by middleware
    // Generate unique key
    const key = generateFileKey('videos', req.file.originalname);

    // Upload to S3
    const url = await uploadToS3(req.file.buffer, key, req.file.mimetype);

    return res.status(200).json({
      success: true,
      message: 'Video uploaded successfully',
      data: { url },
    });
  } catch (error) {
    console.error('Upload video error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload video',
    });
  }
}
