import { IStudent } from "../interfaces/stundents.interface";
import StudentsModel from "../models/studentsSchema";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";

export class StudentService {
    namespace = "STUDENT_SERVICE";

    constructor() {
        console.log("Students Service Initialized");
    }

    /* Student Registration */
    async enrollStudent(req: Request, res: Response, next: NextFunction) {
        console.log(this.namespace, " enrollmentData ", req.body);

        let enrollmentData: IStudent = req.body;

        // Hash Password
        let hashedPassword = await bcrypt.hash(enrollmentData.password, 12);

        // Assign Hashed Password to Password
        enrollmentData.password = hashedPassword;

        const newUser = new StudentsModel(enrollmentData);

        return newUser
            .save()
            .then(data => data)
            .catch(err => {
                console.log(this.namespace, " studentExists ", "MONGO ERROR ", err.message);
                res.status(409).json({ message: err.message });
            });

    }

    /* Student Login */
    async studentLogin(req: Request) {
        let { email, password } = req.body;
        let userFound = await StudentsModel.findOne({ email: email });
        console.log('UserFound!! ', userFound);
        let response = { status: 200, message: '' };

        if (userFound !== null) {
            console.log('Username Matched!! ', userFound.email);

            let passwordMatched = await bcrypt.compare(password, userFound.password);
            console.log('Password Matched!! ', passwordMatched);
            if (!passwordMatched) {
                response.message = 'Password Not Matched';
                return response;
            }
            // Save User in Session
            //userFound;
            response.message = 'Login Successful';
            return response;

        } else {
            response.message = 'User not Found in Database';
            console.log()
            return response;
        }

        /* findUser.then(async (user: any) => {
            console.log('User Found!! ', user);
            if (!user) {
                return { "status": 400, "message": 'User Not Found' };
            }
            
            // If User Found Compare Password
            await bcrypt.compare(password, user.password)
                .then((result) => {
                    console.log('Username Passowrd  NotMatched!! ', result);
                    if (!result) {
                        loginError.message = "Username Passowrd did not match!!"
                        return loginError;
                    } 
                    
                    // Store User details in Session of LocalStorage
                    return user;
                }).catch((err) => {
                    console.log(err);
                });
                return user;
        }).catch((err: any) => {
            console.log('Something Went Wrong!! ', err);
            return err;
        }); */
    }

    async getStudents() {
        try {
            return await StudentsModel.find({}).lean();
        } catch (err) {
            console.log(this.namespace, ' getStudents ', 'Error ', err);
        }
        
    }
}
