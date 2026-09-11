const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const logger = require('../logger');
const { ERROR_CODES, sendError } = require('../lib/errors');

const router = express.Router();

// Configure multer for memory storage (buffer, not disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// POST /api/upload — admin-only image upload to Cloudinary
router.post('/', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 400, 'No image file provided', ERROR_CODES.VALIDATION_ERROR);
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return sendError(res, 500, 'Cloudinary not configured', ERROR_CODES.INTERNAL_ERROR);
    }

    // Upload buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'drape-products',
          resource_type: 'image',
          transformation: [
            { width: 800, height: 800, crop: 'limit' }, // Resize for web
            { quality: 'auto', fetch_format: 'auto' }    // Auto-optimize
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    logger.info('Image uploaded to Cloudinary', { url: result.secure_url, bytes: result.bytes });

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    });
  } catch (err) {
    logger.error('Upload error', { message: err.message, stack: err.stack });
    sendError(res, 500, 'Upload failed', ERROR_CODES.INTERNAL_ERROR);
  }
});

// Error handler for multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendError(res, 400, 'File too large (max 5MB)', ERROR_CODES.VALIDATION_ERROR);
    }
    return sendError(res, 400, err.message, ERROR_CODES.VALIDATION_ERROR);
  }
  next(err);
});

module.exports = router;