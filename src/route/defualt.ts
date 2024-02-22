import express from 'express';

const app = express.Router();


//主路由指定app.use('/', defualt);
//對應路徑
//http://localhost:3000/user
app.get('/', (req, res) => {
  res.send('hello world');
});


export default app;