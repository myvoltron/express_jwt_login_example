const express = require('express');
const dotenv = require('dotenv'); 
const app = express(); 

dotenv.config(); 

app.set('port', 8084);

app.use(express.json());
app.use(express.urlencoded({ extended: false })); 

// 라우팅
const userRouter = require('./routes/userRouter');
const authRouter = require('./routes/authRouter'); 
app.use('/users', userRouter);
app.use('/auth', authRouter); 

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '에서 대기 중'); 
}); 