const cloudinary = require('cloudinary').v2;
const config = require('./env');
const fs = require('fs');
const path = require('path');

// Configure Cloudinary if credentials exist
let isCloudinaryConfigured = false;
if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret
  });
  isCloudinaryConfigured = true;
}

/**
 * Uploads a local file path to Cloudinary or falls back to returning a local assets URL path.
 * @param {string} filePath - Absolute path to local file.
 * @param {string} folder - Destination folder.
 * @returns {Promise<string>} - Public accessible URL.
 */
const uploadToCloudinary = async (filePath, folder = 'delivery_partner_docs') => {
  if (isCloudinaryConfigured) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: folder,
        resource_type: 'auto'
      });
      // Delete temporary file after upload
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload failed, using local file path fallback.', error);
    }
  }

  // Local fallback: Return local relative file path URL
  const filename = path.basename(filePath);
  return `/uploads/${filename}`;
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  isCloudinaryConfigured
};
