import { IStudent } from '../interfaces/stundents.interface';
import StudentsModel from '../models/studentsSchema';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import logger from '../utils/logger';

export class StudentService {
    namespace = 'STUDENT_SERVICE';

    constructor() {
        logger.info(this.namespace, 'Students Service Initialized');
    }

    /* Student Registration */
    async enrollStudent(req: Request, res: Response, next: NextFunction) {
        logger.info(this.namespace, ' enrollmentData ', req.body);

        const enrollmentData: IStudent = req.body;
        // Hash Password
        const hashedPassword = await bcrypt.hash(enrollmentData.password, 12);

        // Assign Hashed Password to Password
        enrollmentData.password = hashedPassword;

        const newUser = new StudentsModel(enrollmentData);

        return newUser
            .save()
            .then(data => data)
            .catch(err => {
                logger.info(this.namespace, ' studentExists ' + 'MONGO ERROR ', err.message);
                res.status(409).json({ message: err.message });
            });

    }

    /* Student Login */
    async studentLogin(req: Request) {
        const { email, password } = req.body;
        const userFound = await StudentsModel.findOne({ email });
        logger.info(this.namespace, 'UserFound!! ', userFound);
        const response = { status: 200, message: '' };

        if (userFound !== null) {
            logger.info(this.namespace, 'Username Matched!! ', userFound.email);

            const passwordMatched = await bcrypt.compare(password, userFound.password);
            logger.info(this.namespace, 'Password Matched!! ', passwordMatched);
            if (!passwordMatched) {
                response.status = 401;
                response.message = 'Password Not Matched';
                return response;
            }
            // Save User in Session
            // userFound;
            response.message = 'Login Successful';
            return response;

        } else {
            response.status = 401;
            response.message = 'User not Found in Database';
            return response;
        }

        /* findUser.then(async (user: any) => {
            logger.info(this.namespace, 'User Found!! ', user);
            if (!user) {
                return { "status": 400, "message": 'User Not Found' };
            }

            // If User Found Compare Password
            await bcrypt.compare(password, user.password)
                .then((result) => {
                    logger.info(this.namespace, 'Username Passowrd  NotMatched!! ', result);
                    if (!result) {
                        loginError.message = "Username Passowrd did not match!!"
                        return loginError;
                    }

                    // Store User details in Session of LocalStorage
                    return user;
                }).catch((err) => {
                    logger.info(this.namespace, err);
                });
                return user;
        }).catch((err: any) => {
            logger.info(this.namespace, 'Something Went Wrong!! ', err);
            return err;
        }); */
    }

    async getStudents() {
        try {
            return await StudentsModel.find({}).lean();
        } catch (err) {
            logger.error(this.namespace, this.namespace + ' getStudents ' + err);
        }
    }
}
