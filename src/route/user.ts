import express from 'express';

const user = express.Router();

//主路由指定app.use('/user', user);
//對應路徑
//http://localhost:3000/user
user.get('/', (req, res) => {
    res.send('hello world user');
});

//在user路徑後接著 /date 就會接到這頁
//http://localhost:3000/user/date
user.get('/date', (req, res) => {
    res.send('hello world user12313123');
});


export default user;