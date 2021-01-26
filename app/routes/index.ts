import express from 'express';
import studentsApi from  './studentEnrollment.api';

let router = express.Router({caseSensitive: true});

/* Server API Routing */
router.use('/', studentsApi);


/* Client Routing Routing */
router.use('/register', (req, res, next) => {
    res.sendfile('public/studentEnrollment.html');
})

router.use('/login', (req, res, next) => {
    res.sendfile('public/login.html');
})

router.use('/home', (req, res, next) => {
    res.sendfile('public/index.html');
})


export default router;