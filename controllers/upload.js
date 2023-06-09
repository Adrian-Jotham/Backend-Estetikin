const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const mysql = require("mysql");
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.uploadImage = (req, res) => {
  try {
    const db = mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS,
      database: process.env.DATABASE
    });

    upload.single('image')(req, res, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to upload image' });
      }

      console.log(req.body.email);
      console.log(req.body.class1);
      console.log(req.body.class2);
      console.log(req.body.class3);
      console.log(req.body.class4);
      const { email, class1, class2, class3, class4 } = req.body;

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
            return db.end(() => {
              res.status(500).json({ error: 'Failed to execute count query' });
            });
          }

          const count = results[0].count;
          console.log('Count:', count);

          const fileBuffer = req.file.buffer;
          const test = count + 1;
          console.log(test);
          const fileName = test + '.jpeg';
          const link = 'https://storage.googleapis.com/test-gambar-estetikin123/' + test + '.jpeg';
          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');

          db.query('INSERT INTO imagealbum SET ?', { user_email: email, date_upload: formattedDate, link: link, class1: class1, class2: class2, class3: class3, class4: class4 }, (err, results) => {
            if (err) {
              console.log(err);
              return db.end(() => {
                res.status(500).json({ error: 'Failed to insert record' });
              });
            }

            // Upload the image to GCS
            uploadToGCS(fileBuffer, fileName)
              .then(() => {
                db.end(() => {
                  res.json({ error: false, status: 'success', message: 'Image uploaded successfully', link: link });
                });
              })
              .catch((error) => {
                console.error(error);
                db.end(() => {
                  res.status(500).json({ error: true, status: 'failed', message: 'Upload Failed' });
                });
              });
          });
        });
      });
    });
  } catch (err) {
    console.log(err);
    console.log('Upload handler error');
    res.status(500).json({ error: 'Upload handler error' });
  }
};

async function uploadToGCS(fileBuffer, fileName) {
  const storage = new Storage();
  const bucket = storage.bucket('test-gambar-estetikin123');
  const file = bucket.file(fileName);
  await file.save(fileBuffer);
  console.log(`File ${fileName} uploaded to GCS`);
}

exports.protectedRoute = (req, res) => {
  res.send('You are accessing a protected route');
};
