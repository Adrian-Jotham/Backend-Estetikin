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
        function classifyText(model1, model2, model3, model4) {
          let str1 = "";
          let str2 = "";
          let str3 = "";
          let str4 = "";
          switch (model2) {
            case 0:
              str2 = "Gambar Makanan/Minuman ya?\nKamu bisa melihat referensi fotografi makanan dan minuman seperti dibawah ini untuk mencoba-coba gaya berfoto atau angle baru!\nKamu juga bisa belajar teknik fotografi makanan melalui modul yang kami miliki!";
              break;
            case 1:
              str2 = "Sedang Fotografi Model? Kamu bisa melihat beberapa rekomendasi fotografi model yang kami punya di database ^_^\nKamu juga bisa meningkatkan skill fotografi model yang kamu miliki dengan membuka modul kami!";
              break;
            case 2:
              str2 = "Sedang Berada di ruang indoor? Kamu bisa melihat beberapa rekomendasi fotografi Indoor yang kami sediakan!\nKami sarankan juga kamu meningkatkan skill fotografi indoor dengan membuka modul kami!";
              break;
            case 3:
              str2 = "Sedang berada di luar ruangan ya? Coba lihat rekomendasi gambar fotografi outdoor kami! Barangkali bisa menambah inspirasi berfotomu..\nKamu juga bisa belajar teknik fotografi outdoor melalui modul yang kami miliki!\n";
              break;
          }
        
          switch (model1) {
            case 0:
              str1 = "Bagus! Gambar yang kamu ambil jernih dan kami dapat melihatnya dengan jelas ^_^!\nKami rekomendasikan kamu untuk meningkatkan kemampuan fotografimu dengan membuka modul pembelajaran kami\n";
              break;
            case 1:
              str1 = "Gambar terlihat blur dan kurang jernih? Kalau kamu tidak sengaja, kami sarankan untuk memfokuskan lensamu terlebih dahulu sebelum mengambil gambar lagi..\nCoba juga periksa dan bersihkan kaca lensamu agar tidak kotor dan mengganggu hobi berfoto kita semua ^_^\nMasih belum bisa mengambil gambar dengan jernih? Coba buka buku modul panduan dari kami!";
              break;
          }
        
          switch (model3) {
            case 0:
              str3 = "Wow! Pencahayaan pada gambar ini sudah pas! Gambar yang kamu tangkap memiliki detail dengan baik dan terlihat jelas.\nKarena kamu sudah bisa mengatur pencahayaan dengan sempurna. Teruslah mengambil foto dengan pencahayaan yang baik seperti ini dan periksa modul modul belajar fotografi kami untuk meningkatkan skill mu!";
              break;
            case 1:
              str3 = "Gambar ini terlihat terlalu gelap.. apabila tidak sengaja, mungkin Anda perlu menyesuaikan pengaturan pencahayaan pada kamera hape Anda untuk mendapatkan hasil yang lebih terang dan jelas.\nJika masih kurang cukup, coba mencari sumber cahaya yang lebih terang disekitarmu!\nButuh bantuan lebih lengkap? Cek modul kami!";
              break;
            case 2:
              str3 = "Foto Anda terlihat terlalu terang kawan ☹ Anda bisa mencoba mengurangi pencahayaan atau menyesuaikan pengaturan kecerahan pada kamera hape Anda agar mendapatkan hasil yang lebih seimbang.\nButuh bantuan lebih lengkap? Cek modul kami!";
              break;
          }
        
          switch (model4) {
            case 0:
              str4 = "Kami merasa gambar yang anda tangkap terlihat estetik! Semua ini karena anda berhasil menangkap gambar dengan objek tepat berada di tengah frame!\nKomposisi yang baik memberikan fokus yang jelas pada objek utama dan membuat gambar lebih menarik secara visual.";
              break;
            case 1:
              str4 = "Oops, Untuk hasil yang lebih baik, coba perhatikan posisi objek utama agar tepat berada di tengah frame. Ini akan membantu menciptakan keseimbangan visual dan membuat gambar lebih menonjol.\nMasih belum bisa mengambil gambar dengan objek berada ditengah? Coba buka buku modul panduan dari kami!";
              break;
          }
          const text=str2+'\n'+'\n'+str1+'\n'+'\n'+str3+'\n'+'\n'+str4
          return text;
      } 
        const dummytext = classifyText(class1,class2,class3,class4);
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