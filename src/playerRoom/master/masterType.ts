interface UserSet {
    USER_ID: string;
    MENBER_GROUP: 'MASTER';
    MEMBER_ID: string;
}



interface RoomSet {
    ROOM_ID: string;
    MASTER_ID: string;
    MEMBER_ID: string;
    ROOM_ROUND: number;
    ROOM_ROUND_TOTLE: number;
    JOIN_ID: string;
    CREATE_DATE: string;
    CREATE_TIME: string;
    END_DATE: string;
    END_TIME: string;
}


export { UserSet, RoomSet };