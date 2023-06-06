const mysql = require("mysql");
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.PASSWORD_PASS,
    database: process.env.DATABASE
});
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
      return res.status(200).json({error:false, status: 'success', message: 'Album Successfuly Retrieved',arrAlbum });
    });
  };