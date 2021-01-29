import dotenv from 'dotenv';
dotenv.config();



const PORT = process.env.PORT || 4000;
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SESSION_SECRET = process.env.SESSION_SECRET || 'ThisIsMyBiggestSecret'

const serverConfig = {
    hostname: SERVER_HOSTNAME,
    port: PORT
}


export default { serverConfig, SESSION_SECRET };
