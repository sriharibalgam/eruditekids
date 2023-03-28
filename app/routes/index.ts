import express from 'express';
import studentsApi from  './studentEnrollment.api';
import phonicsApi from './phonics.api';
import paymentsAPI from './payments.api';
import packagesApi from './packages.api'

const router = express.Router({caseSensitive: true});

/* Server API Routing */
router.use('/', studentsApi);

/* Server API Routing */
router.use('/', phonicsApi);

/* Payments Gateway API Routing */
router.use('/', paymentsAPI);

/* Packages Gateway API Routing */
router.use('/', packagesApi);

/* Client Routing Routing */
router.use('/register', (req, res, next) => {
    res.sendfile('public/studentEnrollment.html');
});

router.use('/login', (req, res, next) => {
    res.sendfile('public/login.html');
});

router.use(['/', '/home'], (req, res, next) => {
    res.sendfile('public/index.html');
});

export default router;
