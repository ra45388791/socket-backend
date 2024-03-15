import { Redis } from 'ioredis';
import { RoomSet } from '../../playerRoom/master/masterType';
import { R_GetUser } from './redisType';
import { UserSet as Master_UserSet } from '../../playerRoom/master/masterType';
import { UserSet as Player_UserSet } from '../../playerRoom/player/playerType';

//type
import { DB_Mod } from '../dbType';

/**
 * globle
 */

type member_Group = 'MASTER' | 'PLAYER';

function R_G_GetUser(db_Mod: DB_Mod, userID: string, group: member_Group): Promise<R_GetUser> {
    // USERS:${group}:${userID}
    
    return new Promise<R_GetUser>(async (resolve, reject) => {
        const client = new Redis();
        client.on('error', err => { console.log('error：', err); reject(false); });

        let userData: R_GetUser = undefined;

        /**
         * 1.確認是否存在
         * 2.寫入使用者資料
         */
        try {
            switch (db_Mod) {
                //檢查是否存在
                case DB_Mod.CHECK:
                    let checkUser = await client.hget(`USERS:${group}:${userID}`, 'USER_ID');
                    if (checkUser === userID) { userData = checkUser; }
                    else { userData = undefined; }
                    break;

                //查詢
                case DB_Mod.SELECT:
                    userData = await client.hgetall(`USERS:${group}:${userID}`, (err, result) => {
                        if (result) {
                            if (result.USER_ID !== undefined) {
                                let user: R_GetUser = undefined;
                                switch (result.MENBER_GROUP) {
                                    case 'MASTER':
                                        user = result as unknown as Master_UserSet;
                                        break;
                                    case 'PLAYER':
                                        user = result as unknown as Player_UserSet;
                                        break;
                                }
                                return user;
                            }
                        } else {
                            console.error('error R_G_GetUser', err);
                            return undefined;
                        }
                    }) as unknown as R_GetUser;
                    break;
            }
        } catch (err) {
            console.log('error R_G_GetUser CATCH', err);
            reject(undefined);
        } finally {
            client.quit();
        }

        if (userData !== undefined) {
            resolve(userData);
        } else {
            resolve(undefined);
        }
    });
}

// function R_G_SetUser(userSet: Master_UserSet | Player_UserSet): Promise<boolean> {
//先找有沒有資料
//沒有才進來寫入
// return new Promise<boolean>((resolve, reject) => {
//     const client = new Redis();
//     client.on('error', err => { console.log('error：', err); reject(false); });

//     const userGroup = userSet.MENBER_GROUP;
//     const userID = userSet.USER_ID;

//     /**
//      * 1. 使用者資料
//      * 2. 使用者索引
//      *      USERS:MASTER:QWEASFORW
//      *      USERS:PLAYER:QWEASFORW 
//      */
//     const userSet = client.hgetall(`USERS:${userGroup}:${userID}`);


//     client.hset(`USERS:${userGroup}:${userID}`, userSet, (err, result) => {
//         if (result) {
//             resolve(true);
//         } else {
//             console.log('error：', err);
//             reject(false);
//         }
//     });
// });
// }

async function R_G_GetSet(searchKey: string): Promise<string[] | 'error'> {

    return new Promise<string[] | 'error'>((resolve, reject) => {
        const client = new Redis();
        client.on('error', err => { console.log('error：', err); reject(err); });

        const souseData = client.smembers('USERID');
        client.quit();
        resolve(souseData);
    });
}

/**
 * MASTER
 */
function R_M_CreateRoom(roomSet: RoomSet): Promise<boolean> {

    return new Promise<boolean>(function (resolve, reject) {
        const client = new Redis();
        client.on('error', err => { console.log('error：', err); reject(false); });

        //批次寫入
        // HASH : 房間設定
        // SET  : 房間ID
        client.multi()
            .hset(`ROOM:${roomSet.ROOM_ID}`, roomSet)
            .sadd('ROOM_ID', roomSet.ROOM_ID)
            .exec((err, result) => {
                if (result) {
                    resolve(true);
                } else {
                    console.log('error：', err);
                    reject(false);
                }
            });
    });

}



//通用
export { R_G_GetSet };

//MASTER
export { R_G_GetUser, R_M_CreateRoom };