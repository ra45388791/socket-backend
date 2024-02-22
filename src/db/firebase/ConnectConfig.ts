import dotenv from 'dotenv';

import { firebaseConfig } from "./DBType";


dotenv.config();


const config = process.env;

console.log(config.NODE_ENV);

//預設連接字
const dbConfig: firebaseConfig = {
    apiKey: config.apiKey || '',
    authDomain: config.authDomain || '',
    projectId: config.projectId || '',
    storageBucket: config.storageBucket || '',
    messagingSenderId: config.messagingSenderId || '',
    appId: config.appId || '',
    measurementId: config.measurementId || '',
};

export default dbConfig;