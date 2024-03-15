
import { Socket, Namespace } from 'socket.io';

import PlayerClass from './playerClass';

//global
import { UserSocket, pleyerSet, joinRoom } from '../global/globalType';
import { msg, user } from '../global/globalEvent';
import GlobalClass from '../global/globalClass';













const pleyer = function (this: UserSocket, route: Namespace): void {

    const global = new GlobalClass(route, this);
    const player = new PlayerClass(route, this);
    let playRoom = "";
    // const auth: pleyerSet = this.handshake.auth as pleyerSet;
    // let roomItem = [...this.rooms];

    // console.log(route);
    this.emit(msg.CHAT_MESSAGE, '玩家連接');

    //加入房間
    this.on(user.JOIN_ROOM, (RoomId: string) => {
        const joinRoom = global.joinPlayerRoom(RoomId);
        const returnMsg: joinRoom = {
            status: true,
            msg: RoomId,
        };


        //是否成功加入房間
        if (joinRoom !== undefined) {
            //成功
            global.updateUserItem(RoomId);
            playRoom = RoomId;
            this.emit(user.JOIN_ROOM, returnMsg);
        } else {
            //失敗
            returnMsg.status = false;
            returnMsg.msg = '房間加入失敗!!!';
            this.emit(user.JOIN_ROOM, returnMsg);
        }

    });


    // 監聽客戶端斷開連線事件
    this.on('disconnect', () => {

        //拿事先存的id找房間
        // const room = playRoom;

        //離開並更新其他人的狀態
        this.leave(playRoom);
        global.updateUserItem(playRoom);
        console.log('使用者關閉連結', '離開:' + playRoom);

    });
};


// //加入指定遊戲房間
// function joinPlayerRoom(
//   socket: Socket,
//   route: Namespace,
//   roomName: string,
// ): Array<string> | undefined {

//   const roomItem = route.adapter.rooms.get(roomName);
//   const UserRoomItem = Array.from(socket.rooms);

//   //檢查房間是否存在
//   if (roomItem === undefined) { return undefined; }

//   //加入房間
//   UserRoomItem.forEach(room => {
//     if (room !== socket.id) { socket.leave(room); }
//   });
//   socket.join(roomName);
//   console.log(`使用者 ${socket.id} 加入房間：${roomName}`);
//   return Array.from(socket.rooms);
// }






export default pleyer;