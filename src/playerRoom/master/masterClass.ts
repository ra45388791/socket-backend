import { Socket, Namespace } from 'socket.io';

//global
import { RandomCode } from '../global/globalFunc';
import { UserSocket, pleyerSet, joinRoom } from '../global/globalType';
import { msg, room, user } from '../global/globalEvent';
import GlobalClass from '../global/globalClass';
//db
// import { Timestamp } from 'firebase/firestore';
// import { DB_Room } from '../../db/firebase/DBType';

//redis
import { R_G_GetUser, R_M_CreateRoom } from '../../db/redis/redis';
import { DB_Mod } from '../../db/dbType';


//MASTER
import { randomUUID } from 'crypto';
import { RoomSet, UserSet } from './masterType';
import { assert } from 'console';













export default class MasterClass {
    private route: Namespace;
    private socket: UserSocket;
    private global: GlobalClass;
    public masterRoom: string = '';

    public constructor(route: Namespace, socket: UserSocket) {
        this.route = route;
        this.socket = socket;
        this.global = new GlobalClass(route, socket);
    }

    public async MasterUser_ctl(ctl_Mod: DB_Mod, userID?: string): Promise<string | UserSet | undefined> {
        switch (ctl_Mod) {
            case DB_Mod.CHECK:
                return await R_G_GetUser(DB_Mod.CHECK, "slx7qO_VSngIvTZDAAAB", 'MASTER') as string | undefined;
            case DB_Mod.SELECT:
                return await R_G_GetUser(DB_Mod.SELECT, "slx7qO_VSngIvTZDAAAB", 'MASTER') as UserSet | undefined;
                break;
            case DB_Mod.UPDATE:
                break;
            case DB_Mod.INSERT:
                break;
            case DB_Mod.DELETE:
                break;
            default:
                return undefined;
        }
    }
    // public masterUserSet(userID: string): Promise<boolean> {
    //     return new Promise<boolean>(async (resolve, reject) => {
    //         const MasterSet = await R_G_GetUser(userID);

    //     });
    // }


    //確認房間是否存在
    public checkRoom(roomName?: string): string | undefined {
        //尋找房間前綴詞
        const haveRoom: string | undefined = [...this.socket.rooms].find((e) => {
            const name = roomName === undefined ? 'playerRoom#' : roomName;
            if (e.indexOf(name) !== -1) {
                return true;
            } else {
                return false;
            }
        });



        return haveRoom;

    }


    //創建遊戲房間
    public async createRoom(auth: pleyerSet, roomSet: RoomSet): Promise<string | undefined> {

        let randomRoomName = `playerRoom#${randomUUID()}`;
        const rooms = this.route.adapter.rooms;

        //檢查現有房間防止重複開房
        try {
            let room = rooms.get(randomRoomName);
            while (room !== undefined) {
                randomRoomName = `playerRoom#${randomUUID()}`;
                room = rooms.get(randomRoomName);
            }
        } catch (ex) { return undefined; }

        //填上 roomid
        roomSet.ROOM_ID = randomRoomName;

        //寫入redis
        const CreateStatus: boolean = await R_M_CreateRoom(roomSet);


        if (CreateStatus) {
            this.masterRoom = randomRoomName;
            this.socket.join(randomRoomName);
            auth.identity = randomRoomName;
            return randomRoomName;
        } else {
            return undefined;
        }


    }







    // 啟動遊戲
    public startGame(roomId: string): void {

        // const dateNow = new Date();
        // const PlayersID = this.global.getPlayersID(roomId);
        // const Players = this.global.getPlayers(roomId);


        // const data: DB_Room = {
        //     RoomID: roomId,
        //     Master_ID: this.socket.id,
        //     Member_ID: '',
        //     RoomRound: 0,
        //     RoomRoundTotle: 10,
        //     JoinID: RandomCode(5),  //隨機碼
        //     Players: [],
        //     Question: [],
        //     CreateDate: Timestamp.fromDate(
        //         new Date(dateNow.getFullYear(), dateNow.getMonth() + 1, dateNow.getDay())),
        //     EndDate: null,
        // };



    }



}