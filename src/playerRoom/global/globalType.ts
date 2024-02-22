import { Socket } from 'socket.io';

//Socket 擴充
interface UserSocket extends Socket {
    userSet?: userSet;
}
type userSet = {
    token: string,
    integral:number
}



//master 
type masterModel = {
    RoomID: string,
    master_ID: string,
    Member_ID: string,
}

//player
type playerModel = {
    Player_ID: string,
    Player_Nmae: string,
    Player_Image: string,
    Player_Defualt_Image: number,
    Player_Score: number,
    room_id: string
}

//player 帶上來的資料
type pleyerSet = {
    identity: string,
    room: string
}

//加入房間事件回傳格式
type joinRoom = {
    status: boolean;
    msg: string;
};




export {
    UserSocket,
    masterModel,
    playerModel,
    pleyerSet,
    joinRoom,
};