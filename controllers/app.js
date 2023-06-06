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
    console.log(req.body.class1);
    console.log(req.body.class2);
    console.log(req.body.class3);
    console.log(req.body.class4);
    const { email,class1,class2,class3,class4 } = req.body;
    
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
        const fileName = test + '.jpeg';
        const link = 'https://storage.googleapis.com/test-gambar-estetikin123/' + test + '.jpeg';
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
        
        db.query('INSERT INTO imagealbum SET ?', { user_email: email, date_upload: formattedDate, link: link, class1: class1, class2: class2, class3: class3, class4: class4 }, (err, results) => {
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

exports.album = (req,res) => {
  const {email} =req.body
  console.log(email);
  db.query('SELECT * FROM imagealbum WHERE user_email = ? ORDER BY date_upload DESC', [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: true,message:"Failed to GET Album from DB" });
    }
    const arrAlbum = [];
    for (const row of results){
      const {date_upload,link,class1,class2,class3,class4}=row;
      arrAlbum.push({date_upload,link,class1,class2,class3,class4});
    }
    console.log(arrAlbum);
    return res.status(200).json({error:false, status: 'success', message: 'Album GET Successful',arrAlbum });
  });
};

exports.protectedRoute = (req, res) => {
  res.send('You are accessing a protected route');
};
