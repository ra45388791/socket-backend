import { Namespace } from 'socket.io';

//db


//global
import GlobalClass from '../global/globalClass';
import { UserSocket, pleyerSet } from './globalType';
import { msg, user } from './globalEvent';

const global = function (this: UserSocket, route: Namespace): void {
    const global = new GlobalClass(route, this);
    const auth: pleyerSet = this.handshake.auth as pleyerSet;

    const roomItem = [...this.rooms];
    this.emit(user.SHOW_USER, this.id);

    //更新所有使用者目錄
    global.updateUserItem(auth.room);
    console.log("player頁面連接成功 ID：" + this.id + ' 角色：' + auth.identity + " 房間：" + roomItem.join(", "));

    //監聽客戶端發送的訊息
    this.on(msg.CHAT_MESSAGE, (client_msg: string) => {

        console.log(auth.identity + '訊息： ' + client_msg);

        //發送給除了玩家的其他人
        const roomItem = Array.from(this.rooms);
        route.in(roomItem).except(this.id).emit(msg.CHAT_MESSAGE, client_msg);
        //只發送給發送者
        this.emit(msg.CHAT_MESSAGE, '發送成功');
    });





    // 監聽客戶端斷開連線事件
    this.on('disconnect', () => {


        // console.log('123');
    });

};





export default global;