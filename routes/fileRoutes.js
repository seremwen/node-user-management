const express = require('express');
const multer = require('multer');
const File = require('../models/file');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken"); // Your authenticateToken middleware


// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });
// User registration
/**
 * @swagger
 * tags:
 *   name: File Upload Api
 *   description: API endpoints for Files
 */
/**
 * @swagger
 * /api/v1/files/upload:
 *   post:
 *     summary: Upload a file
 *     tags: [File Upload Api]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       500:
 *         description: Internal server error
 */
router.post('/upload',authenticateToken, upload.single('file'), async (req, res) => {
    try {
      const filePath = req.file.path.replace(/\\/g, '/'); // Normalize path for storage
      const file = await File.create({ path: filePath });
      res.status(200).json({ message: 'File uploaded successfully', file });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ message: 'Internal server error', error });
    }
  });
/**
 * @swagger
 * /api/v1/files:
 *   get:
 *     summary: Get a file by its saved path
 *     tags: [File Upload Api]
 *     parameters:
 *       - in: query
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The full saved path of the file to retrieve
 *     responses:
 *       200:
 *         description: File retrieved successfully
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal server error
 */
router.get('/file', async (req, res) => {
    try {
      const filePath = req.query.path;
  
      if (!filePath) {
        return res.status(400).json({ message: 'Path query parameter is required' });
      }
  
      const file = await File.findOne({ where: { path: filePath } });
  
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }
  
      if (fs.existsSync(filePath)) {
        return res.sendFile(path.resolve(filePath));
      } else {
        return res.status(404).json({ message: 'File not found on server' });
      }
    } catch (error) {
      console.error('Error retrieving file:', error);
      res.status(500).json({ message: 'Internal server error', error });
    }
  });
  
  module.exports = router;
