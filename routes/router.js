const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid')
const db = require('../lib/db.js')
const { validateRegister, isLoggedIn } = require('../midlleware/users.js');

// const mysql=require('mysql');

// const db=mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     database:'users',
//     password:''
// })

router.post('/sign-up', validateRegister, (req, res, next) => {
    // console.log("Connected!");
    // var sql = `INSERT INTO user (id, username, password, registered) VALUES ('${uuid.v4()}', '${req.body.username}', '${req.body.password}', now())`;
    // db.query(sql, function (err, result) {
    //   if (err) throw err;
    //   console.log("1 record inserted");
    // });
    db.query(`SELECT id FROM users WHERE LOWER(username)=LOWER(${req.body.username})`, (err, result) => {
        if (result && !result.length) {
            return res.status(400).send({
                message: 'This username is already'
            })
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).send({
                        message: err
                    });
                } else {
                    db.query(`INSERT INTO users (id, username, password, registered) VALUES ('${uuid.v4()}', ${db.escape(req.body.username)}, '${hash}', now())`, (err, result) => {
                        if (err) {
                            throw err;
                            return res.status(400).send({
                                message: err
                            })
                        }
                        return res.status(201).send('Registered!')
                    })
                }
            })

        }
    })
})

router.post('/login', (req, res, next) => {
    db.query(`SELECT * FROM users WHERE username=${db.escape(req.body.username)};`, (err, result) => {
        if (err) {
            throw err;
            return res.status(400).send({
                message: err
            });
        }
        if (!result.length) {
            return res.status(400).send({
                message: 'Username or Password incorrected!!!'
            })
        }
        bcrypt.compare(req.body.password, result[0]['password'], (bErr, bResult) => {
            if (bErr) {
                return res.status(400).send({
                    message: 'Username or Password incorrected!!!'
                });
            }
            if (bResult) {
                const token = jwt.sign({
                    username: result[0].username,
                    userId: result[0].id,
                }, 'SECRETKEY', { expiresIn: '7d' }
                )
                db.query(`UPDATE users SET last_login=now() WHERE id='${result[0].id}';`)
                return res.status(200).send({
                    message: 'Logged In',
                    token,
                    user: result[0]
                })
            }
            return res.status(400).send({
                message: 'Username or Password incorrected!!!'
            })
        })
    })
})

router.get('/secret-route', isLoggedIn, (req, res, next) => {
    console.log(req.userData);
    res.status(200).send(req.userData)
})

module.exports = router