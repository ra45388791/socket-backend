import { Server as SocketIoServer } from 'socket.io';

import global from './global/global';
import player from './player/player';
import master from './master/master';


//類型
import { UserSocket, pleyerSet } from './global/globalType';
// import { Socket } from 'dgram';

//持久保存使用者狀態 (進入時先檢查activeUser 有沒有對應id)
const activeUser = new Map<string, UserSocket>();


const playerRoomRoute = (io: SocketIoServer, path: string): void => {
    const route = io.of(path);

    //指定頁面如("/player")才觸發
    route.on('connection', (socket: UserSocket) => {

        const auth: pleyerSet = socket.handshake.auth as pleyerSet;

        /* 測試不同層級修改 socket 是否能取得修改後的資料
        // socket.userSet = {
        //     token: '123',
        //     integral: 0,
        // }
        // activeUser.set(socket.id, socket);
        // console.log(activeUser);
        */


        global.call(socket, route);

        //區分 主機、玩家
        switch (auth.identity) {

            //主機
            case 'master':
                master.call(socket, route);
                break;

            //玩家
            case 'player':
                player.call(socket, route);
                break;


        }


    });


    //共同事件






}


export default playerRoomRoute;