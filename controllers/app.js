const { Storage } = require ('@google-cloud/storage');
exports.uploadImage = async (req,res) => {
  if(!req.file){
    return res.status(400).json({error : 'No file Uploaded' });
  }
  try{
    const image = img.file;
    const imgBuffer = image.buffer;
    const imgName = image.originalname;
    await uploadCloud(imgBuffer, imgName);
    res.json({
      status : 'success',
      error : false,
      message : 'Image uploaded',
    });
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Upload Failed' });
  }
};
async function uploadCloud(Buffer,name){
  const storage = new Storage();
  const bucket = storage.bucket('test-gambar-estetikin123');
  const file = bucket.file(name);
  await file.save(Buffer);
  console.log(`Image ${name} uploaded to cloud`);
}
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
