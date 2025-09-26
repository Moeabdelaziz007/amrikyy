const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${req.userId}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Define allowed file types
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip',
    'application/x-rar-compressed',
    'video/mp4',
    'video/avi',
    'video/mov',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  }
});

// @route   POST /api/files/upload
// @desc    Upload a file
// @access  Private
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const fileData = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
      uploadedBy: req.userId,
      uploadedAt: new Date()
    };

    logger.info(`File uploaded: ${req.file.originalname} by user ${req.userId}`);

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: { file: fileData }
    });
  } catch (error) {
    logger.error('File upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading file'
    });
  }
});

// @route   POST /api/files/upload-multiple
// @desc    Upload multiple files
// @access  Private
router.post('/upload-multiple', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const filesData = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
      uploadedBy: req.userId,
      uploadedAt: new Date()
    }));

    logger.info(`${req.files.length} files uploaded by user ${req.userId}`);

    res.status(201).json({
      success: true,
      message: 'Files uploaded successfully',
      data: { files: filesData }
    });
  } catch (error) {
    logger.error('Multiple file upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading files'
    });
  }
});

// @route   GET /api/files/:filename
// @desc    Get file information
// @access  Private
router.get('/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../public/uploads', filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    
    // Check if user owns the file (filename starts with userId)
    if (!filename.startsWith(req.userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const fileInfo = {
      filename,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      url: `/uploads/${filename}`
    };

    res.json({
      success: true,
      data: { file: fileInfo }
    });
  } catch (error) {
    logger.error('Get file info error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching file information'
    });
  }
});

// @route   DELETE /api/files/:filename
// @desc    Delete a file
// @access  Private
router.delete('/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../public/uploads', filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check if user owns the file
    if (!filename.startsWith(req.userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Delete file
    fs.unlinkSync(filePath);

    logger.info(`File deleted: ${filename} by user ${req.userId}`);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    logger.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting file'
    });
  }
});

// @route   GET /api/files
// @desc    Get user's files
// @access  Private
router.get('/', async (req, res) => {
  try {
    const uploadPath = path.join(__dirname, '../public/uploads');
    
    if (!fs.existsSync(uploadPath)) {
      return res.json({
        success: true,
        data: { files: [] }
      });
    }

    const files = fs.readdirSync(uploadPath)
      .filter(filename => filename.startsWith(req.userId))
      .map(filename => {
        const filePath = path.join(uploadPath, filename);
        const stats = fs.statSync(filePath);
        
        return {
          filename,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          url: `/uploads/${filename}`
        };
      })
      .sort((a, b) => new Date(b.modified) - new Date(a.modified));

    res.json({
      success: true,
      data: { files }
    });
  } catch (error) {
    logger.error('Get files error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching files'
    });
  }
});

module.exports = router;
