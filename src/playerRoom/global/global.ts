import { Namespace } from 'socket.io';

//db


//global
import GlobalClass from '../global/globalClass';
import { UserSocket, pleyerSet } from './globalType';
import { msg, user } from './globalEvent';















// const global = (route: Namespace, socket: UserSocket): void => {
//     const global = new GlobalClass(route, socket);
//     const auth: pleyerSet = socket.handshake.auth as pleyerSet;

//     let roomItem = [...socket.rooms];
//     socket.emit(user.SHOW_USER, socket.id);

//     //更新所有使用者目錄
//     global.updateUserItem(auth.room);
//     console.log("player頁面連接成功 ID：" + socket.id + ' 角色：' + auth.identity + " 房間：" + roomItem.join(", "));




//     //監聽客戶端發送的訊息
//     socket.on(msg.CHAT_MESSAGE, (client_msg: string) => {
//         // socket.username = {}


//         console.log(auth.identity + '訊息： ' + client_msg);

//         //發送給除了玩家的其他人
//         roomItem = Array.from(socket.rooms);
//         roomItem.forEach(e => {
//             route.in(e).except(socket.id).emit(msg.CHAT_MESSAGE, client_msg);
//         });
//         // route.in(auth.room).except(socket.id).emit('chat message', msg);
//         //只發送給發送者
//         socket.emit(msg.CHAT_MESSAGE, '發送成功');
//     });





//     // 監聽客戶端斷開連線事件
//     socket.on('disconnect', () => {


//         // console.log('123');
//     });

// };



const global = function (this: UserSocket, route: Namespace): void {
    const global = new GlobalClass(route);
    const auth: pleyerSet = this.handshake.auth as pleyerSet;

    let roomItem = [...this.rooms];
    this.emit(user.SHOW_USER, this.id);

    //更新所有使用者目錄
    global.updateUserItem(auth.room);
    console.log("player頁面連接成功 ID：" + this.id + ' 角色：' + auth.identity + " 房間：" + roomItem.join(", "));

    //監聽客戶端發送的訊息
    this.on(msg.CHAT_MESSAGE, (client_msg: string) => {



        console.log(auth.identity + '訊息： ' + client_msg);

        //發送給除了玩家的其他人
        roomItem = Array.from(this.rooms);
        roomItem.forEach(e => {
            route.in(e).except(this.id).emit(msg.CHAT_MESSAGE, client_msg);
        });
        // route.in(auth.room).except(socket.id).emit('chat message', msg);
        //只發送給發送者
        this.emit(msg.CHAT_MESSAGE, '發送成功');
    });





    // 監聽客戶端斷開連線事件
    this.on('disconnect', () => {


        // console.log('123');
    });

};





export default global;