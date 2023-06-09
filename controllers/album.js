const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
});
exports.album = (req,res) => {
  try{
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const email=decoded.email;
    console.log(email);
    db.query('SELECT * FROM imagealbum WHERE user_email = ? ORDER BY date_upload DESC', [email], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: true,message:"Failed to GET Album from DB" });
      }
      const arrAlbum = [];
      for (const row of results){
        const {date_upload,link,class1,class2,class3,class4}=row;
        const datefor = new Date(date_upload);
        const formattedDate = datefor.toLocaleString("en-US", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        function getRandomText() {
          if (Math.random() < 0.5) {
            return "Foto anda Blur!\n Coba Fokuskan kamera anda ke objek dan hindari objek yang bergerak terlalu cepat.";
          } else {
            return "Foto anda Gelap\n Coba naikkan ISO kamera anda atau aktifkan flash anda.";
          }
        }        
        const dummytext = getRandomText();
        console.log(dummytext);
        arrAlbum.push({formattedDate,link,dummytext});
      }
      console.log(arrAlbum);
      return res.status(200).json({error:false, status: 'success', message: 'Album Successfuly Retrieved',arrAlbum });
    });
  }
    catch (err) {
      console.log(err);
      console.log('Album Handler Error')
  }
  };