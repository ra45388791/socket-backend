import { Socket, Namespace } from 'socket.io';

//global
// import { pleyerSet, joinRoom } from 'globalType';
import { msg, user } from './globalEvent';
import { platform } from 'os';

// import { Socket, Namespace } from "socket.io";
// import { pleyerSet, joinRoom } from "./globalType";



export default class GlobalClass {
    private route: Namespace;
    // public socket: Socket;

    public constructor(route: Namespace) {
        // this.socket = socket;
        this.route = route;



    }


    //更新使用者清單
    public updateUserItem(
        roomName: string,
    ): void {
        //更新上線名單
        // console.log(route.adapter.rooms.get(roomName));

        const users: string[] = [];
        const roomUsers: Set<string> | undefined = this.route.adapter.rooms.get(roomName);
        roomUsers?.forEach(e => { users.push(e); });
        this.route.in(roomName).emit(user.SHOW_AUTH_USER, users.sort());
    }

    //取得所有玩家
    public getPlayers(RoomID?: string | string[]): Array<Map<string, Socket>> | undefined {

        // if (playerID === undefined) { return undefined; }

        const players: Array<Map<string, Socket>> = [];
        let tmpSockets: [string, Socket][] = Array.from(this.route.sockets);
        if (RoomID !== undefined) {
            tmpSockets = tmpSockets.filter(e => {
                return Array.from(e[1].rooms).find(room => room === RoomID);
            });
        }

        tmpSockets.forEach((e: [string, Socket]) => {
            const playerMap = new Map<string, Socket>();
            //<e[0],e[1]> = <id,Socket>
            playerMap.set(e[0], e[1]);
            players.push(playerMap);
        });

        // this.route.sockets: Map


        return players;
    }

    //取得所有玩家ID
    public getPlayersID(roomName: string): string[] {
        const sids = Array.from(this.route.adapter.sids.values());
        let playersID_Set: Set<string>[];
        let playerID: string[];


        // eslint-disable-next-line prefer-const
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
}