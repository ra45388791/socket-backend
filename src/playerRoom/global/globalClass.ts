import { Socket, Namespace } from 'socket.io';

//global
// import { pleyerSet, joinRoom } from 'globalType';
import { msg, user } from './globalEvent';

// import { Socket, Namespace } from "socket.io";
// import { pleyerSet, joinRoom } from "./globalType";

//redis
import { R_G_GetSet } from '../../db/redis/redis';

export default class GlobalClass {
    private route: Namespace;
    public socket: Socket;

    public constructor(route: Namespace, socket: Socket) {
        this.socket = socket;
        this.route = route;

    }


    //更新使用者清單
    public updateUserItem(roomName: string): void {
        //更新上線名單
        // console.log(route.adapter.rooms.get(roomName));

        const users: string[] = [];
        const roomUsers: Set<string> | undefined = this.route.adapter.rooms.get(roomName);
        roomUsers?.forEach(e => { users.push(e); });
        this.route.in(roomName).emit(user.SHOW_AUTH_USER, users.sort());
    }

    //取得所有玩家
    // public getPlayers(userid: string | string[]): Socket | Socket[] | undefined {

    // }

    //取得所有玩家ID
    public getPlayersID(roomName: string): string[] {
        const strings = R_G_GetSet(roomName);
        strings.then(e => {
            console.log(e);
        });
        return [];
    }




    //加入指定遊戲房間
    public joinPlayerRoom(

        roomName: string,
    ): Array<string> | undefined {

        const roomItem = this.route.adapter.rooms.get(roomName);
        let souseRoom: string | undefined = undefined;
        const UserRoomItem = [...this.socket.rooms];

        //檢查房間是否存在
        if (roomItem === undefined) { return undefined; }




        //離開上一個房間
        UserRoomItem.forEach(room => {
            if (room !== this.socket.id) {
                souseRoom = room;
                this.socket.leave(room);

                //更新上一個房間的使用者
                if (souseRoom !== undefined) {
                    this.updateUserItem(souseRoom);
                    souseRoom = undefined;
                }
            }
        });



        //加入新房間
        this.socket.join(roomName);
        // this.playerRoom = roomName;
        console.log(`使用者 ${this.socket.id} 加入房間：${roomName}`);
        return Array.from(this.socket.rooms);
    }


}
















/**
 * 舊code
 */

/*
//取得所有玩家
public getPlayers(userid: string | string[]): Socket | Socket[] | undefined {

    if (userid === undefined) { return undefined; }

    const players: Socket[] = [];

    if (Array.isArray(userid)) {
        userid.forEach((e) => {
            const socket: Socket | undefined = this.route.sockets.get(e);
            if (socket !== undefined) { players.push(socket); }
        });
    } else {
        const socket: Socket | undefined = this.route.sockets.get(userid);
        if (socket !== undefined) { players.push(socket); }
    }

    return players.length === 1 ? players[0] : players;
}

//取得所有玩家ID
public getPlayersID(roomName: string): string[] {
    const sids = Array.from(this.route.adapter.sids.values());
    let playersID_Set: Set<string>[];
    let playerID: string[];


    
    playersID_Set = sids.filter((player: Set<string>) => {
        let status = false;
        if (player.has(roomName)) {
            status = true;
            player.delete(roomName);
        }
        return status;
    });

    //!還沒測試會不會回傳id
    // eslint-disable-next-line prefer-const
    playerID = playersID_Set.map((ID_Set) => {
        return String(ID_Set.values().next().value);
    });


    return playerID;
}
*/