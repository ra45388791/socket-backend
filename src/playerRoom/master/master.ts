import MasterClass from './masterClass';
import { Socket, Namespace } from 'socket.io';

//db
// import { selectTest } from '../../db/firebase/DBFunc';

//global
import GlobalClass from '../global/globalClass';
import { UserSocket, pleyerSet, joinRoom } from '../global/globalType';
import { msg, room, user } from '../global/globalEvent';
import { RandomCode } from '../global/globalFunc';

//type
import { RoomSet, UserSet } from './masterType';
import { DB_Mod } from '../../db/dbType';












const master = async function (this: UserSocket, route: Namespace): Promise<void> {
    const global = new GlobalClass(route, this);
    const master = new MasterClass(route, this);
    const auth: pleyerSet = this.handshake.auth as pleyerSet;

    // let contDown: NodeJS.Timeout;


    this.emit(msg.CHAT_MESSAGE, '主機連接');

    //確認使用者是否存在
    // const CheckUser = await master.masterUser_ctl(DB_Mod.CHECK, "slx7qO_VSngIvTZDAAAB");

    //確定master使用者是否有還沒結束的房間


    //回複使用者狀態
    this.on(user.RETURN_USER_SET, async (sourReset: boolean) => {
        /**
         * 1.檢查
         * 2.取得使用者設定
         * 3.取得遊戲房設定
         * 4.丟回前端設定
         */
        if (!sourReset) return;
        const getUserSet: UserSet | undefined = await master.MasterUser_ctl(DB_Mod.SELECT,auth.id) as UserSet | undefined;
        if (getUserSet === undefined) {
            this.emit(msg.CHAT_MESSAGE, '查無紀錄，回復資料失敗。');
            return;
        } else if (getUserSet.USER_ID === undefined) {
            this.emit(msg.CHAT_MESSAGE, '資料異常，回復資料失敗。');
            return;
        };

        /**
         * socket id是唯獨
         * 1.更新redis的id
         * 
         */

        master.MasterUser_ctl(DB_Mod.UPDATE,)
        // global.joinPlayerRoom(getUserSet.USER_ID)


        // this.emit(user.SHOW_USER, this.id);
        //更新所有使用者目錄
        global.updateUserItem(auth.room);

        //! 20240315施工中 先有insert 這裡才能寫

    });




    /** 
     * 創建房間、等待玩家進入階段
    */
    this.on(user.CREATE_ROOM, async (sureCreate: boolean) => {
        const haveRoom: string | undefined = master.checkRoom();
        const joinRoom: joinRoom = { status: true, msg: '' };
        let createRoomName: string | undefined = '';

        //檢查是否已經開過房了
        if (haveRoom !== undefined) {
            // global.getAllPlayersID(haveRoom);


            this.emit(msg.CHAT_MESSAGE, `您已創建房間：${haveRoom}`);
            return false;
        }



        //!這只是測試資料真正的資料要從前端傳上來
        const dateNow = new Date();
        const room_Set: RoomSet = {
            ROOM_ID: '',
            MASTER_ID: this.id,
            MEMBER_ID: '',
            ROOM_ROUND: 0,
            ROOM_ROUND_TOTLE: 10,
            JOIN_ID: RandomCode(5),
            CREATE_DATE: new Date(dateNow.getFullYear(),
                dateNow.getMonth() + 1,
                dateNow.getDay())
                .toString(),
            CREATE_TIME: new Date(dateNow.getHours(),
                dateNow.getMinutes(),
                dateNow.getSeconds(),
            ).toString(),
            END_DATE: '',
            END_TIME: '',
        }


        //創建房間
        createRoomName = await master.createRoom(auth, room_Set);

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
        /**
         * 1.檢查是否已經開啟房間
         * 2.檢查是否已經開始遊戲
         */



        const haveRoom: string | undefined = master.checkRoom();
        // const test: Array<Map<string, Socket>> | undefined = global.getPlayers(haveRoom);

        if (haveRoom === undefined) {
            this.emit(msg.SERVER_MSG, '尚未創建房間!!!');
            return;
        }

        const allPlayers: string[] = global.getPlayersID(haveRoom);
        // const Players: Socket = this.global.getPlayers(allPlayers);
        // console.log(Players);


        return;

        // let sec = 5;

        // //更新使用者清單
        // global.updateUserItem(auth.room);

        // //先清空上一次的倒數;
        // clearInterval(contDown);

        // route.in(haveRoom).emit(msg.SERVER_MSG, '開始倒數!');
        // contDown = setInterval(() => {
        //     if (sec !== 0) {
        //         route.in(haveRoom).emit(msg.SERVER_MSG, `開始倒數! ${sec--}`);
        //     } else {
        //         //!做些事情
        //         //結束倒數
        //         clearInterval(contDown);

        //         //!執行開始遊戲方法
        //         /**
        //          * 這裡應該要接受前端丟上來的room設定包
        //          * 1.發送設定檔要求事件
        //          * 2.等待回傳設定檔
        //          * 3.insert設定
        //          * 4.play
        //          */
        //         // master.startGame(haveRoom);

        //     }
        // }, 1000);



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


    //完成上述事件後檢查
    //!20240315 MasterUser_ctl 第二個參數要傳 cookie紀錄的id
    const CheckUser = await master.MasterUser_ctl(DB_Mod.CHECK, auth.id);
    if (CheckUser !== undefined) {
        //呼叫是否回復詢問事件
        this.emit(user.RETURN_USER_CHECK);
    }
};

export default master;