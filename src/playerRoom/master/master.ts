import MasterClass from './masterClass';
import { Socket, Namespace } from 'socket.io';

//db
// import { selectTest } from '../../db/firebase/DBFunc';

//global
import GlobalClass from '../global/globalClass';
import { UserSocket, pleyerSet, joinRoom } from '../global/globalType';
import { msg, room, user } from '../global/globalEvent';













const master = function (this: UserSocket, route: Namespace): void {
    const global = new GlobalClass(route);
    const master = new MasterClass(route, this);
    const auth: pleyerSet = this.handshake.auth as pleyerSet;

    let contDown: NodeJS.Timeout;


    this.emit(msg.CHAT_MESSAGE, '主機連接');




    /** 
     * 創建房間、等待玩家進入階段
    */
    this.on(user.CREATE_ROOM, () => {
        const haveRoom: string | undefined = master.checkRoom();
        const joinRoom: joinRoom = { status: true, msg: '' };
        let createRoomName: string | undefined = '';


        //檢查是否已經開過房了
        if (haveRoom !== undefined) {
            // global.getAllPlayersID(haveRoom);


            this.emit(msg.CHAT_MESSAGE, `您已創建房間：${haveRoom}`);
            return false;
        }



        //創建房間
        createRoomName = master.createRoom(auth);

        //創建新房間
        if (createRoomName !== undefined) {
            joinRoom.msg = createRoomName;
            this.emit(user.JOIN_ROOM, joinRoom);
            this.emit(user.SHOW_USER, `使用者id ${this.id} 房間id：${createRoomName} `);

            global.updateUserItem(createRoomName);
        } else {
            joinRoom.status = false;
            joinRoom.msg = '創建房間失敗';
            this.emit(user.JOIN_ROOM, joinRoom);
        }
    });






    /** 
     * 處裡遊戲事件、模組，並發送開始遊戲事件
    */
    this.on(room.START_GAME, () => {
        const haveRoom: string | undefined = master.checkRoom();
        // const test: Array<Map<string, Socket>> | undefined = global.getPlayers(haveRoom);

        if (haveRoom === undefined) {
            this.emit(msg.SERVER_MSG, '尚未創建房間!!!');
        } else {
            let sec = 5;

            //更新使用者清單
            global.updateUserItem(auth.room);

            //先清空上一次的倒數;
            clearInterval(contDown);

            route.in(haveRoom).emit(msg.SERVER_MSG, '開始倒數!');
            contDown = setInterval(() => {
                if (sec !== 0) {
                    route.in(haveRoom).emit(msg.SERVER_MSG, `開始倒數! ${sec--}`);
                } else {
                    //!做些事情
                    //結束倒數
                    clearInterval(contDown);

                    //!執行開始遊戲方法
                    /**
                     * 這裡應該要接受前端丟上來的room設定包
                     * 1.發送設定檔要求事件
                     * 2.等待回傳設定檔
                     * 3.insert設定
                     * 4.play
                     */
                    // master.startGame(haveRoom);

                }
            }, 1000);


        }
    });



    // 監聽客戶端斷開連線事件
    this.on('disconnect', () => {

        //拿事先存的id找房間
        const room = master.masterRoom;

        route.in(room).except(this.id).emit(msg.CHAT_MESSAGE, '與主機連線中斷...');
        this.emit(msg.CHAT_MESSAGE, '與伺服器斷開連接...')

        //離開並更新其他人的狀態
        this.leave(room);
        // global.updateUserItem(room);
        console.log('使用者關閉連結', '離開:' + room);

    });
};

export default master;