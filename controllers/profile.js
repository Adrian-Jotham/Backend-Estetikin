const mysql = require("mysql");
const jwt = require("jsonwebtoken");
exports.getProfile = (req, res) => {
    try {
        const db = mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASS,
            database: process.env.DATABASE
        });
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.split(' ')[1];
        const decoded = jwt.decode(token, process.env.JWT_SECRET);
        const email = decoded.email;
        db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
            if (err) {
                console.log(err);
                return db.end(() => {
                    res.status(500).json({ error: true, message: 'Upload Error' });
                });
            }
            if (results[0].profilepicture != null) {
                res.status(200).json({
                    error: false,
                    status: 'success',
                    message: 'Get Profile Called',
                    nopicture: 1,
                    picture: results[0].profilepicture,
                    nickname: results[0].nickname,
                })
            } else {
                res.status(200).json({
                    error: false,
                    status: 'success',
                    message: 'Get Profile Called',
                    nopicture: 1,
                    picture: results[0].profilepicture,
                    nickname: results[0].nickname,
                })
            }
        })

    }
    catch (err) {
        console.log('getProfile Error:')
        console.log(err);
        return res.status(500).json({ error: true, message: "Failed getProfile" });
    }
}