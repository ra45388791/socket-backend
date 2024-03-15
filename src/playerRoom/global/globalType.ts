import { Socket } from 'socket.io';


//Socket 擴充
interface UserSocket extends Socket {
    // global: any;
    userSet?: userSet;
}
type userSet = {
    token: string,
    id: string,
}







//player 帶上來的資料
type pleyerSet = {
    identity: string,
    id:string,
    room: string
}

//加入房間事件回傳格式
type joinRoom = {
    status: boolean;
    msg: string;
};




//socket
export { UserSocket };

//PLAYER
export { pleyerSet, joinRoom }