
import { Request, Response, NextFunction, Router } from 'express';
import { StudentService } from '../services/students.service';
import passport from 'passport';
import { validate, Joi } from 'express-validation';
import logger from '../utils/logger';


let studentSerive = new StudentService();
let namespace = 'STUDENT_API';
let router = Router();

const validateRegistration = {
    body: Joi.object({
        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim(),
        email: Joi.string().email().required(),
        password: Joi.string().length(4)
    })
}


const studentRegistration = async (req: Request, res: Response, next: NextFunction) => {

    try {
        let enrolled: any = await studentSerive.enrollStudent(req, res, next);
        if (enrolled.status == 409) {
            res.status(409).send({
                status: 409,
                message: enrolled.message,
            });
        } else {
            res.status(200).send({
                message: "Successfully added",
            });
        }
    } catch (e) {
        res.status(500).send(e.message || 'Internal Server Error!!');
    }
}

/* Student Login */
const studentLogin = async (req: Request, res: Response, next: NextFunction) => {
    logger.info(namespace, 'request Body ', req.body);
    try {
        let loggedIn = await studentSerive.studentLogin(req);
        logger.info(namespace, 'request studentLogin ', loggedIn);
        if (loggedIn) {
            res.status(200).json(loggedIn);
        } else {
            res.status(401).send({ message: loggedIn });
        }
    } catch (err) {
        console.error('Http error', err);
        return res.status(500).send('Internal Server Error!!');
    }
}

/* Get Students List */
const getStudentsList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let students = await studentSerive.getStudents();
        logger.info(namespace, ' getStudentsList ', students);
        res.status(200).send(students);
    } catch (err) {
        console.error(namespace, 'getStudentsList', err);
        return res.status(500).send(err || 'Internal Server Error!!');
    }
}

const checkUserAuthenticated = (req: Request, res: Response, next: NextFunction) => {

    logger.info(namespace, 'req.isAuthenticated() ', req.isAuthenticated());
    if(req.isAuthenticated()) {
        logger.info(namespace, 'User Authenticated');
        return next();
    } 
    logger.info(namespace, 'User Not Authenticated .. Checked Auth');
    res.redirect('/login');
}

/* Routes */
router.get('/getStudentsList', checkUserAuthenticated, getStudentsList);
router.post('/studentRegistration', validate(validateRegistration, {}, {}), studentRegistration);

// Authenticate Use Before login
router.post('/studentLogin', passport.authenticate('local', { failureFlash: 'Invalid username or password.' }), studentLogin);

export default router; 