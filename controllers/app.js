const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const mysql = require("mysql");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.PASSWORD_PASS,
    database: process.env.DATABASE
});
exports.uploadImage = (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to upload image' });
    }
    
    console.log(req.body.email);
    const { email } = req.body;
    
    db.connect((error) => {
      if (error) {
        console.error('Failed to connect to the database:', error);
        return;
      }
      
      console.log('Connected to the database');
      
      const countQuery = 'SELECT COUNT(*) AS count FROM imagealbum';
      db.query(countQuery, (error, results) => {
        if (error) {
          console.error('Failed to execute count query:', error);
          db.end(); 
          return;
        }
        
        const count = results[0].count;
        console.log('Count:', count);
        
        const fileBuffer = req.file.buffer;
        const test = count + 1;
        console.log(test);
        const fileName = test + '.jpg';
        const link = 'https://storage.googleapis.com/test-gambar-estetikin123/' + test + '.jpeg';
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
        
        db.query('INSERT INTO imagealbum SET ?', { user_email: email, date_upload: formattedDate, link: link }, (err, results) => {
          if (err) {
            console.log(err);
            db.end();
            return res.status(500).json({ error: 'Failed to insert record' });
          }
          
          // Upload the image to GCS
          uploadToGCS(fileBuffer, fileName)
            .then(() => {
              res.json({ error: false, status: 'success', message: 'Image uploaded successfully',link: link });
            })
            .catch((error) => {
              console.error(error);
              res.status(500).json({ error: true, status: 'failed', message: 'Upload Failed' });
            });
          
          db.end();
        });
      });
    });
  });
};
async function uploadToGCS(fileBuffer, fileName) {
  const storage = new Storage();
  const bucket = storage.bucket('test-gambar-estetikin123');
  const file = bucket.file(fileName);
  await file.save(fileBuffer);
  console.log(`File ${fileName} uploaded to GCS`);
}



// const { Storage } = require('@google-cloud/storage');

// exports.uploadImage = async (req, res) => {
//   console.log(req.image);
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }
//   try {
//     const image = req.image;
//     const imgBuffer = image.buffer;
//     const imgName = image.originalname;
//     await uploadCloud(imgBuffer, imgName);
//     res.json({ error: false, status: 'success', message: 'Image uploaded' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: true, status: 'Upload failed' });
//   }
// };
// async function uploadCloud(buffer, name) {
//   const storage = new Storage();
//   const bucket = storage.bucket('test-gambar-estetikin123');
//   const file = bucket.file(name);
//   await file.save(buffer);
//   console.log(`Image ${name} uploaded`);
// }

//Local Storage File Upload
// const multer = require('multer');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'static/'); 
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname); 
//   }
// });

// const upload = multer({ storage });

// exports.uploadImage = (req, res) => {
//   upload.single('image')(req, res, (err) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Failed to upload image' });
//     }

//     res.json({ status: 'success', message: 'Image uploaded successfully' });
//   });
// };

exports.protectedRoute = (req, res) => {
  res.send('You are accessing a protected route');
};
