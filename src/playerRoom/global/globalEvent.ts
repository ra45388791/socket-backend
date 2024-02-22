/**
 * 訊息
 */
enum msg {
    CHAT_MESSAGE = 'chat message',
    SERVER_MSG = 'server_Msg',
}

/**
 * 使用者事件
 */
enum user {
    SHOW_USER = 'showUser',           //設定使用者資訊
    SHOW_AUTH_USER = 'showAuthUser',     //設定其他使用者資訊
    CREATE_ROOM = 'createRoom',     //創建房間
    JOIN_ROOM = 'joinRoom',         //加入房間
}

/**
 * 房間事件
 */
enum room {
    START_GAME = 'startGame',
}




export { msg, user, room };