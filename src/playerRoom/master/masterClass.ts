import { Socket, Namespace } from 'socket.io';

//global
import { RandomCode } from '../global/globalFunc';
import { UserSocket, pleyerSet, joinRoom } from '../global/globalType';
import { msg, room, user } from '../global/globalEvent';
import GlobalClass from '../global/globalClass';
//db
import { Timestamp } from 'firebase/firestore';
import { DB_Room } from '../../db/firebase/DBType';

//事件
import { randomUUID } from 'crypto';












export default class MasterClass {
    private route: Namespace;
    private socket: UserSocket;
    private global: GlobalClass;
    public masterRoom: string = '';

    public constructor(route: Namespace, socket: UserSocket) {
        this.socket = socket;
        this.route = route;
        this.global = new GlobalClass(route);
    }



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
    public createRoom(auth: pleyerSet): string | undefined {

        let randomRoomName = `playerRoom#${randomUUID()}`;
        const rooms = this.route.adapter.rooms;

        try {
            let room = rooms.get(randomRoomName);

            //防止重複開房
            while (room !== undefined) {
                randomRoomName = `playerRoom#${randomUUID()}`;
                room = rooms.get(randomRoomName);
            }

            this.masterRoom = randomRoomName;
            this.socket.join(randomRoomName);
            auth.identity = randomRoomName;

        } catch (ex) {

            return undefined;

        }
        return randomRoomName;
    }









    public startGame(roomId: string): void {

        const dateNow = new Date();
        const PlayersID = this.global.getPlayersID(roomId);
        const Players = this.global.getPlayers(roomId);


        const data: DB_Room = {
            RoomID: roomId,
            Master_ID: this.socket.id,
            Member_ID: '',
            RoomRound: 0,
            RoomRoundTotle: 10,
            JoinID: RandomCode(5),  //隨機碼
            Players: [],
            Question: [],
            CreateDate: Timestamp.fromDate(
                new Date(dateNow.getFullYear(), dateNow.getMonth() + 1, dateNow.getDay())),
            EndDate: null,
        };



    }



}