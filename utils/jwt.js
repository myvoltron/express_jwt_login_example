const jwt = require('jsonwebtoken');

module.exports = {
    verifyToken(token) {
        try {
            return jwt.sign(token, process.env.JWT_SECRET); 
        } catch(err) {
            
            console.error(err); 
            return null; 
        }
    }
}