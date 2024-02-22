import { initializeApp } from 'firebase/app';


//firebase介面
import {
    getFirestore, collection, getDocs, addDoc, where, query,
} from 'firebase/firestore';


//firebase型別
import { Firestore, CollectionReference } from 'firebase/firestore';

import { DB_Room } from './DBType';
import dbConfig from './ConnectConfig';


// 用firebase連接字初始化firebase
const firebaseApp = initializeApp(dbConfig);

// 初始化 Cloud Firestore 並取得對該服務的引用
const db: Firestore = getFirestore(firebaseApp);


//初始化集合
const room: CollectionReference = collection(db, 'Room');
// const question: CollectionReference = collection(db, 'question');




//查詢測試
async function selectTest(): Promise<void> {

    const citiesRef = query(room, where('JoinID', '==', 'SD5QH'));

    //查題目
    // const citiesRef = query(
    //   collection(db, 'question'),
    //   where('Mode.Type', '==', 0),
    // );

    const select = await getDocs(citiesRef);

    select.forEach((doc) => {
        // const room: Room = doc.data() as Room;
    });
}

async function insertTest(payload: DB_Room): Promise<void> {

    const docRef = await addDoc(room, payload);
    console.log('建立文件ID：', docRef.id);
}


export { selectTest, insertTest };










