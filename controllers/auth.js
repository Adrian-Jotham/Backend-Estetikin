const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
});
exports.login = async (req, res) => {
    try {
        console.log(req.body.email);
        console.log(req.body.password);
        const { email, password } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^.{8,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error:'true', message: 'invalid email format' });
        };
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error:'true', message: 'invalid password format' });
        };
        if (!email || !password) {
            return res.status(400).json({status : 'invalid input'});
        }
        db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
            console.log(results);
            if (!results || !await bcrypt.compare(password, results[0].password)) {
                res.status(401).json({
                    error : true,
                    message : 'Email or Password is incorrect'
                })
            } else {
                const id = results[0].id;
                const email=results[0].email;
                const nickname = results[0].nickname

                const token = jwt.sign({ id,email }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("the token is " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    // httpOnly: true
                }
                res.cookie('userSave', token, cookieOptions);
                res.status(200).json({
                    error : false,
                    message : 'successful login',
                    token : token,
                    nickname : nickname
                });
            }
        })
    } catch (err) {
        console.log(err);
        console.log('Login handler Error')
    }
}
exports.register = (req, res) => {
    try {
    console.log(req.body);
    const { name, nickname, email, password, passwordConfirm } = req.body;
    console.log(req.body.name); 
    console.log(req.body.nickname);
    console.log(req.body.email);
    console.log(req.body.password);
    console.log(req.body.passwordConfirm);

    const passwordConfirmRegex = /^.{8,}$/;
    const nameRegex = /^.{1,}$/;
    const nicknameRegex = /^.{1,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^.{8,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error:'true', message: 'invalid email format' });
    };
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error:'true', message: 'invalid password format' });
    };
    if (!nameRegex.test(name)) {
        return res.status(400).json({ error:'true', message: 'invalid name format' });
    };
    if (!passwordConfirmRegex.test(passwordConfirm)) {
        return res.status(400).json({ error:'true', message: 'invalid passwordConfirm format' });
    };
    if (!nicknameRegex.test(nickname)) {
        return res.status(400).json({ error:'true', message: 'invalid nickname format' });
    };

    db.query('SELECT email from user WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.log(err);
        } else {
            if (results.length > 0) {
                return res.status(503).json({
                    error : true,
                    message : 'email already used'
                })
            } else if (password != passwordConfirm) {
                return res.status(504).json({
                    error : true,
                    message : 'password do not match'
                })
            }
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO user SET ?', { name: name, email: email, password: hashedPassword, nickname: nickname }, (err, results) => {
            if (err) {
                console.log(err);
            } else {
                return res.status(200).json({
                    error : false,
                    message : 'account registered'
                });
            }
        })
    })
    // res.send("Form submitted");
} catch (err) {
    console.log(err);
    console.log('Register handler Error')
}
}

exports.isLoggedIn = async (req, res, next) => {
    console.log('isLoggedIn middleware executed');
    console.log(req.headers.authorization);
    try {
            const authorizationHeader = req.headers.authorization;
            if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
            const token = authorizationHeader.split(' ')[1];
            // 1. Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // 2. Check if the user still exists
            db.query('SELECT * FROM user WHERE id = ?', [decoded.id], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                status: 'failed',
                message: 'Internal server error',
                });
            }
            //Check token expiration.
            if (decoded.exp < Date.now() / 1000) {
                return res.status(401).json({
                error: true,
                status: 'failed',
                message: 'Token has expired',
                });
            }
            if (!results || results.length === 0) {
                return res.status(401).json({
                status: 'failed',
                message: 'Invalid token',
                });
            }
    
            // 3. Store the user information in the request object
            req.user = results[0];
    
            // Continue to the next middleware or route handler
            next();
            });
        } else {
            // No token found, user is not logged in
            return res.status(401).json({
            status: 'failed',
            message: 'Unauthorized',
            });
        }
        } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 'failed',
            message: 'Internal server error',
        });
        }
    };
exports.logout = (req, res) => {
    res.cookie('userSave', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    });
    res.status(200).json({
                    status : 'success',
                    message : 'account logout'
                });
}