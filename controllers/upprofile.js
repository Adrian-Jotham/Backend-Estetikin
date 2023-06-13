const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const mysql = require("mysql");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const jwt = require("jsonwebtoken");
const shortid = require("shortid");
exports.uploadprofile = (req, res) => {
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

            const authorizationHeader = req.headers.authorization;
            const token = authorizationHeader.split(' ')[1];
            const decoded = jwt.decode(token, process.env.JWT_SECRET);
            const email = decoded.email;
            db.connect((error) => {
                if (error) {
                    console.error('Failed to connect to the database:', error);
                    return;
                }
                const fileBuffer = req.file.buffer;
                db.query('SELECT profilepicture FROM user WHERE email = ?',[email],(err,results)=>{
                    if (err) {
                        console.log(err);
                        return db.end(() => {
                            res.status(500).json({ error: 'Failed reading DB' });
                        });
                    }
                    if (results[0].profilepicture!= null){
                        picname = results[0].profilepicture.replace(process.env.PROFILE_LINK, '');
                        console.log(picname);
                        deleteFileinGCS(picname);
                    }
                })
                const random=shortid.generate();
                const fileName = email + random + '.jpeg';
                const link = process.env.PROFILE_LINK + email + random + '.jpeg';
                db.query('UPDATE user SET profilepicture = ? WHERE email = ?', [link, email], (err, results) => {
                    if (err) {
                        console.log(err);
                        return db.end(() => {
                            res.status(500).json({ error: 'Failed to insert DB' });
                        });
                    }
                    //Upload the image to GCS
                    uploadToGCS(fileBuffer, fileName)
                        .then(() => {
                            db.end(() => {
                                res.json({ error: false, status: 'success', message: 'Profile image uploaded successfully', link: link });
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
    } catch (err) {
        console.log(err);
        console.log('Upload Profile handler error');
        res.status(500).json({ error: 'Upload Profile handler error' });
    }
};
async function deleteFileinGCS(fileName) {
    try {
      const storage = new Storage();
      const bucket = storage.bucket(process.env.PROFILE_BUCKET);
      await bucket.file(fileName).delete();
      console.log(`File ${fileName} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
}
async function uploadToGCS(fileBuffer, fileName) {
    try {
    const storage = new Storage();
    const bucket = storage.bucket(process.env.PROFILE_BUCKET);
    const file = bucket.file(fileName);
    await file.save(fileBuffer);
    console.log(`File ${fileName} uploaded to GCS`);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

exports.protectedRoute = (req, res) => {
    res.send('You are accessing a protected route');
};