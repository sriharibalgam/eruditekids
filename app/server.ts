/* NPM imports */
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import { ValidationError } from 'express-validation';

import session  from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import passportLocalStrategy from './config/passport.config';
import flassMessages from 'express-flash';

/* Project imports */
import configs from './config/index'; // We can use './config/.' too
import allRoutes from './routes/index';
import logger from './utils/logger';
let app = express();

/* ========= Parsing the request ========= */
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(express.json());
app.use(cors());

// CSP Policy Error 
app.use(helmet.contentSecurityPolicy({
    directives:{
      defaultSrc:["'self'", 'unsafe-inline'],
      scriptSrc:["'self'", 'code.jquery.com','maxcdn.bootstrapcdn.com', 'cdnjs.cloudflare.com', 'unsafe-inline'],
      styleSrc:["'self'",'maxcdn.bootstrapcdn.com', 'unsafe-inline'],
      fontSrc:["'self'",'maxcdn.bootstrapcdn.com']
    }
    })
);
// app.use(helmet()); // Helmet is the top-level middleware for express HTTP module, including all 11 Middlewares.

/* Authentication Middleware */
app.use(session({
    secret: configs.serverConfig.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(cookieParser(configs.serverConfig.SESSION_SECRET));
passportLocalStrategy(); // initialize passport local strategy config
app.use(passport.initialize());
app.use(passport.session());
app.use(flassMessages());

/* ========= Client Files ========= */
app.use('/public', express.static(path.join(__dirname, '../public')));

/* ========= Logging Request and Response Middleware ========= */
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.info('ERUDITE_KIDS Request', `[${new Date().toISOString()}]:: METHOD: [${req.method}], URL: [${req.url}], IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        console.info('ERUDITE_KIDS Response', `[${new Date().toISOString()}]:: METHOD: [${req.method}], URL: [${req.url}], IP: [${req.socket.remoteAddress}], STATUS: ${res.statusCode}`);
    });

    process.on('unhandledRejection', (err) => {
        console.error('UnhandledRejection ', err);
    });

    next();
})

/* ========= Routers ========= */
app.use('/', allRoutes);

/* ========= Database Connectivity ============= */
mongoose.connect(configs.dbConnectionConfig.dbUrl, configs.dbConnectionConfig.options)
.then((connected) => {
    logger.info('SERVER', 'Mongoose Connection Successful ');
})
.catch((err: Error) => {
    console.error('Mongoose Connection Failed ', err);
})
/* ========= End Database Connectivity ============= */


/* Error Handling Middleware */
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    const err = new Error('Not Found');
    res.status(404).json({
        message: err.message
    })
    next();
})

app.use(function (err: ValidationError, req: express.Request, res: express.Response, next: express.NextFunction) {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json(err);
    }
    return res.status(500).json(err);
})


/* Create Server */
app.listen(configs.serverConfig.serverConfig.port, () => {
    logger.info('SERVER', `Hurray Server is Up and Running on PORT ${configs.serverConfig.serverConfig.port}`);
});