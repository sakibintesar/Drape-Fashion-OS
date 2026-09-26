const multer = require('multer');

// Multer config: memory storage (buffer) for Cloudinary upload_stream
// 5MB limit, images only
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    // Allow common web image formats
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Unsupported image format. Use JPEG, PNG, WebP, or GIF'), false);
    }
    cb(null, true);
  }
});

/**
 * Upload a buffer to Cloudinary.
 * Requires CLOUDINARY_URL env var (or CLOUDINARY_CLOUD_NAME + API_KEY + API_SECRET).
 * Returns a promise resolving to the Cloudinary upload result (includes secure_url).
 */
async function uploadToCloudinary(buffer, options = {}) {
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudinaryUrl && !(cloudName && apiKey && apiSecret)) {
    throw new Error('Cloudinary credentials not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET');
  }

  // Dynamic import to avoid hard dependency if not used
  const { v2: cloudinary } = await import('cloudinary');

  // Configure if using discrete env vars
  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });
  }

  const uploadOptions = {
    folder: 'drape-products',
    resource_type: 'image',
    transformation: [
      { quality: 'auto:good', fetch_format: 'auto' },
      { width: 1200, height: 1200, crop: 'limit' }
    ],
    ...options
  };

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(uploadOptions, (err, result) => {
      if (err) {
        console.error('Cloudinary upload error:', err);
        return reject(new Error('Image upload to Cloudinary failed'));
      }
      if (!result || !result.secure_url) {
        return reject(new Error('Cloudinary upload returned no URL'));
      }
      resolve(result);
    });
    stream.end(buffer);
  });
}

/**
 * Delete an image from Cloudinary by public_id.
 * Useful when replacing or removing a product image.
 */
async function deleteFromCloudinary(publicId) {
  const { v2: cloudinary } = await import('cloudinary');
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudinaryUrl && !(cloudName && apiKey && apiSecret)) {
    throw new Error('Cloudinary not configured');
  }

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });
  }

  return cloudinary.uploader.destroy(publicId);
}

module.exports = {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary
};
