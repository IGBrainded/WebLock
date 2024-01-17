const express = require('express');
const path = require('path');
const multer = require('multer');
const app = express();
const port = 3002;

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    // Set a unique file name (you can modify this logic based on your needs)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024, // Limit file size to 1 MB
  },
  fileFilter: function (req, file, cb) {
    // Allow only certain file types (you can modify this based on your needs)
    const allowedFileTypes = /jpeg|jpg|png/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (jpeg/jpg/png) are allowed!'));
    }
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Handle GET request for the file upload page
app.get('/file-upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'file-upload.html'));
});

// Handle POST request for file uploads
app.post('/upload', upload.single('file'), (req, res, next) => {
  try {
    // File upload successful
    res.send('File uploaded successfully!');
  } catch (error) {
    // Handle errors during file upload
    res.status(400).send('Error uploading file: ' + error.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
