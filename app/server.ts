/* NPM imports */
import dotenv, { config } from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';

/* Project imports */
import configs from './config/index'; // We can use './config/.' too
import allRoutes from './routes/index';

let app = express();

/* ========= Parsing the request ========= */
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(express.json());
app.use(cors());
app.use(helmet());

/* ========= Client Files ========= */
app.use('/public', express.static(path.join(__dirname, '../public')));

/* ========= Logging Request and Response Middleware ========= */
app.use((req, res, next) => {
    console.log('ERUDITE_KIDS Request: ', `[${new Date().toISOString()}]:: METHOD: [${req.method}], URL: [${req.url}], IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        console.log('ERUDITE_KIDS Response: ', `[${new Date().toISOString()}]:: METHOD: [${req.method}], URL: [${req.url}], IP: [${req.socket.remoteAddress}], STATUS: ${res.statusCode}`);
    });

    next();
})
/* ========= Routers ========= */
app.use('/', allRoutes);

/* ========= Database Connectivity ============= */


mongoose.connect(configs.dbConnectionConfig.dbUrl, configs.dbConnectionConfig.options)
.then((connected) => {
    console.error('Mongoose Connection Successful ');
})
.catch((err) => {
    console.error('Mongoose Connection Failed ', err);
    throw new Error('Connection Error sadasda' + err);
})
/* ========= End Database Connectivity ============= */




/* Error Handling Middleware */
app.use((req, res, next) => {
    const err = new Error('Not Found');
    res.status(404).json({
        message: err.message
    })
    next();
})

/* Create Server */
app.listen(configs.serverConfig.port, () => {
    console.log(`Hurray Server is Up and Running on PORT ${configs.serverConfig.port}`);
});