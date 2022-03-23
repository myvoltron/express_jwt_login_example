const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const saltRounds = 10; 
const router = express.Router(); 
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "111111", 
    database: "express_jwt_db", 
});

router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password; 

    const [result] = await connection.promise().query('SELECT * FROM user WHERE email = ?', [email]);
    const user = result[0]; 

    // 해당 이메일의 회원이 없을 때 
    if (!user) {
        return res.json({
            success: false, 
            msg: 'no user by input email', 
        });
    } 

    console.log(user);

    const compareResult = await bcrypt.compare(password, user.password); 
    if (compareResult) { // 비밀번호가 올바르면 토큰 반환
        jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1m'}, (err, token) => {
            if (err) {
                console.error(err); 
                return res.json({
                    success: false, 
                    message: err, 
                });
            } 

            // 로그인 성공 시 성공 여부와 토큰 반환
            res.json({
                success: true, 
                accessToken: token, 
            });
        }); 
    } else { // 틀린 비밀번호 
        return res.json({
            success: false, 
            msg: 'wrong password'
        });
    }
}); 

module.exports = router; 