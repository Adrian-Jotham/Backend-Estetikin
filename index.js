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
app.use(upload.none()); // Parse form-data
app.use(cookieParser());

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.PASSWORD_PASS,
    database: process.env.DATABASE
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("MYSQL CONNECTED")
    }
})

// Define Routes
// app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/upload', require('./routes/routes'));
app.use('/module', require('./routes/module'));

app.listen(5000)