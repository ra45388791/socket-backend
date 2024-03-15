
import express from 'express';
// import cors from 'cors';
// import path from 'path';
import { createServer } from 'http';
import { Server as Server_io } from 'socket.io';
//routers
// import defualt from './route/defualt';
// import user from './route/user';

//socket.io routes
import playerRoomRoute from './playerRoom/playerRoom';





const port = process.env.PORT || 3000;

const app = express();

const server = createServer(app);
server.listen(port, () => { console.log('http://localhost:' + port); });


//socket.io
const io = new Server_io(server, {
    // cors: { origin: 'http://127.0.0.1:5500' },
    cors: { origin: '*' },
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true,
    },         //連線狀態回復功能啟用
});



// app.use(cors());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/', defualt);
// app.use('/user', user);

//socket開始



//socket.io Router
playerRoomRoute(io, '/player');



// 監聽客戶端連線事件
io.on('connection', (socket) => {
    console.log('使用者連結主頁面');

    /**
     * 處裡重新連結
     * 無法回復時抓使用者最後狀態來撈資料
     */

    // if (!socket.recovered) {
    // }

});


app.get('/', (req, res) => {
    res.send('hello world!');
});
