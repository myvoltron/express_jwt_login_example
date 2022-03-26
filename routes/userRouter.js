const express = require('express');
const mysql = require('mysql2');
const authMiddleware = require('../middlewares/authMiddleware');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "111111",
    database: "express_jwt_db",
});

// 유저 목록
router.get('/', async (req, res) => {
    try {
        const [result] = await connection.promise().query("SELECT * FROM user");
        // console.log(result);
        res.json({
            success: true,
            users: result,
        });
    } catch (err) {
        console.error(err);
        res.json({
            success: false,
            err
        });
    }
});

// 회원가입
router.post('/', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const hash = await bcrypt.hash(password, saltRounds); 
        const result = await connection.promise().query("INSERT INTO user(email, password) values(?, ?)", [email, hash]); 
        const insertId = result[0].insertId
        // console.log(insertId);
        res.json({
            success: true,
            insertId,
        });
    } catch(err) {
        console.error(err);
        res.json({
            success: false,
            err
        });
    }
});

// 회원 상세보기 
router.get('/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;

    try {
        const result = await connection.promise().query(`SELECT * FROM user WHERE id=${id}`); 
        const user = result[0];
        // console.log(user);
        res.json({
            success: true,
            user,
        });
    } catch(err) {
        console.error(err);
        res.json({
            success: false,
            err
        });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    const id = req.params.id; 
    const email = req.body.email; 
    
    try {
        const result = await connection.promise().query(`UPDATE user SET email = ? WHERE id=${id}`, [email]); 
        res.json({
            success: true, 
        }); 
    } catch(err) {
        console.error(err);
        res.json({
            success: false,
            err,
        });
    }
});

// 회원 탈퇴
router.delete('/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;

    try {
        const result = await connection.promise().query(`DELETE FROM user WHERE id=${id}`)
        // console.log(result);
        res.json({
            success: true,
        });
    } catch(err) {
        console.error(err);
        res.json({
            success: false,
            err,
        });
    }
});

module.exports = router;

