import { Request, Response, NextFunction } from 'express';

/**
 * Sanitize string by removing potentially dangerous characters
 */
function sanitizeString(value: string): string {
  if (typeof value !== 'string') return value;
  
  // Remove null bytes
  let sanitized = value.replace(/\0/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Remove control characters except newlines and tabs
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  return sanitized;
}

/**
 * Recursively sanitize object properties
 */
function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
}

/**
 * Middleware to sanitize request body, query, and params
 */
export function sanitizeInput(req: Request, _res: Response, next: NextFunction) {
  try {
    // Sanitize body
    if (req.body) {
      req.body = sanitizeObject(req.body);
    }

    // Sanitize query parameters
    if (req.query) {
      req.query = sanitizeObject(req.query);
    }

    // Sanitize URL parameters
    if (req.params) {
      req.params = sanitizeObject(req.params);
    }

    next();
  } catch (error) {
    console.error('Sanitization error:', error);
    next(error);
  }
}

/**
 * Validate and sanitize file uploads
 */
export function validateFileUpload(
  allowedTypes: string[],
  maxSize: number
) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next();
    }

    // Check file type
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
      });
    }

    // Check file size
    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: `File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit`,
      });
    }

    // Sanitize filename
    if (req.file.originalname) {
      req.file.originalname = sanitizeString(req.file.originalname);
      // Remove path traversal attempts
      req.file.originalname = req.file.originalname.replace(/\.\./g, '');
      req.file.originalname = req.file.originalname.replace(/[\/\\]/g, '');
    }

    // Check for file content validation (magic numbers)
    if (req.file.buffer) {
      const isValidFile = validateFileContent(req.file.buffer, req.file.mimetype);
      if (!isValidFile) {
        return res.status(400).json({
          success: false,
          message: 'File content does not match the declared file type',
        });
      }
    }

    next();
  };
}

/**
 * Validate file content by checking magic numbers (file signatures)
 */
function validateFileContent(buffer: Buffer, mimetype: string): boolean {
  if (buffer.length < 4) return false;

  const magicNumbers: { [key: string]: number[][] } = {
    'image/jpeg': [[0xFF, 0xD8, 0xFF]],
    'image/png': [[0x89, 0x50, 0x4E, 0x47]],
    'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF
    'video/mp4': [
      [0x00, 0x00, 0x00], // ftyp at offset 4
      [0x66, 0x74, 0x79, 0x70], // ftyp
    ],
    'video/webm': [[0x1A, 0x45, 0xDF, 0xA3]],
  };

  const expectedSignatures = magicNumbers[mimetype];
  if (!expectedSignatures) {
    // If we don't have a signature for this type, allow it
    return true;
  }

  // Check if any of the expected signatures match
  return expectedSignatures.some(signature => {
    return signature.every((byte, index) => buffer[index] === byte);
  });
}
