import { UserSet as Master_UserSet } from '../../playerRoom/master/masterType';
import { UserSet as Player_UserSet } from '../../playerRoom/player/playerType';


// redis
type R_GetUser = Master_UserSet | Player_UserSet | string | undefined;



export { R_GetUser }