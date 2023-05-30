const multer = require('multer');

// Create multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'static/'); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original file name for the uploaded file
  }
});

// Create multer upload instance
const upload = multer({ storage });

exports.uploadImage = (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      // Handle any multer errors for file upload
      console.error(err);
      return res.status(500).json({ error: 'Failed to upload image' });
    }

    // Multer successfully processed the file upload
    res.json({ status: 'success', message: 'Image uploaded successfully' });
  });
};

exports.protectedRoute = (req, res) => {
  res.send('You are accessing a protected route');
};

// Other controller functions...
