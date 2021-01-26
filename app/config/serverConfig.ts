import dotenv from 'dotenv';
dotenv.config();



const PORT = process.env.PORT || 4000;
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';

const serverConfig = {
    hostname: SERVER_HOSTNAME,
    port: PORT
}


export default serverConfig;
