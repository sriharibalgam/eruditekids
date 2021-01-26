
import { Request, Response, NextFunction, Router } from 'express';
import { StudentService } from '../services/students.service';

let studentSerive = new StudentService();
let namespace = 'STUDENT_API';
let router = Router();

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
    console.log('request Body ', req.body);
    try {
        let loggedIn = await studentSerive.studentLogin(req);
        console.log('request studentLogin ', loggedIn);
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
        console.log(namespace, ' getStudentsList ', students);
        res.status(200).send(students);
    } catch (err) {
        console.error(namespace, 'getStudentsList', err);
        return res.status(500).send(err || 'Internal Server Error!!');
    }
}

/* Routes */
router.get('/getStudentsList', getStudentsList);
router.post('/studentRegistration', studentRegistration);
router.post('/studentLogin', studentLogin);

export default router; 