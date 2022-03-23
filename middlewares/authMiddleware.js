const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 

const authMiddleware = async (req, res, next) => {
    const accessToken = req.header('Access-Token'); 
    if (accessToken == null) {
        res.json({
            success: false, 
            msg: 'Authentication fail', 
        }); 
    } else {
        try {
            const tokenInfo = await new Promise((resolve, reject) => {
                jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
                    if (err) reject(err);
                    else resolve(decoded); 
                }); 
            }); 
            req.tokenInfo = tokenInfo; 
            next(); 
        } catch(err) {
            console.error(err);
            res.json({
                success: false,
                msg: err, 
            }); 
        }
    }
}; 

module.exports = authMiddleware; 