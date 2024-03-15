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
        this.global = new GlobalClass(route, socket);
    }



}