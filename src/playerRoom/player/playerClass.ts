import { Socket, Namespace } from 'socket.io';
import { UserSocket, pleyerSet, joinRoom } from '../global/globalType';
import GlobalClass from '../global/globalClass';

export default class PlayerClass {
    private route: Namespace;
    private socket: UserSocket;
    private global: GlobalClass;
    public playerRoom: string = '';

    public constructor(route: Namespace, socket: UserSocket) {
        this.socket = socket;
        this.route = route;
        this.global = new GlobalClass(route);
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
            }
        });

        //更新上一個房間的使用者
        if (souseRoom !== undefined) {
            this.global.updateUserItem(souseRoom);
        }

        //加入新房間
        this.socket.join(roomName);
        this.playerRoom = roomName;
        console.log(`使用者 ${this.socket.id} 加入房間：${roomName}`);
        return Array.from(this.socket.rooms);
    }



}