const express = require("express");
const path = require("path")
const mysql = require("mysql");
const app = express();
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const multer = require("multer");
const upload = multer();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cookieParser());

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.PASSWORD_PASS,
    database: process.env.DATABASE
});
// const db = mysql.createPool({
//     connectionLimit: 10,
//     user: process.env.DATABASE_USER,
//     password: process.env.PASSWORD,
//     socketPath: '/cloudsql/estetikin:asia-southeast2:estetikin-db-protect',
//     database: 'nodejs-database',
// });
db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("MYSQL CONNECTED")
    }
})

// Define Routes
app.use('/auth', (req, res, next) => {
    upload.none()(req, res, next);
}, require('./routes/auth'));

app.use('/album', (req, res, next) => {
    upload.none()(req, res, next);
}, require('./routes/album'));

app.use('/upload', require('./routes/upload'));
app.use('/module', require('./routes/module'));
app.use('/articles', require('./routes/artikel'));

app.use('/', require('./routes/landingtest'));

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
