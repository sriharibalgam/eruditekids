import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import StudentsModel from '../models/studentsSchema';
import { MongooseDocument } from 'mongoose';

// Assign Strategy
const LocalStrategy = passportLocal.Strategy;

function passportLocalStrategy()  {

    const configOptions = {
        usernameField: 'email',
        passwordField: 'password'
    };

    const verifyUserCallback = async (email: string, password: string, done: any) => {
        const userFound = await StudentsModel.findOne({ email });

        if (!userFound) {
            return done(null, false, { message: 'User not Found'});
        }

        try {
            console.log('Username Matched!! ', userFound.email);

            const passwordMatched = await bcrypt.compare(password, userFound.password);
            if (passwordMatched) {
                console.log('Password Matched Status: ', passwordMatched);
                return done(null, userFound);
            } else {
                return done(null, false, { message: 'Password Did Not Match'});
            }
        } catch (err) {
            console.log('error', err);
            return done(err);
        }
    };

    const localStrategy = new LocalStrategy(configOptions, verifyUserCallback);

    // use of passport
    passport.use(localStrategy);

    // serialize
    passport.serializeUser((user: any, done) => done(null, user.id));

    // De-serialize
    passport.deserializeUser(async (id, done) => {
        return await StudentsModel.findOne({ _id: id })
            .then((userFound: MongooseDocument) => {
                done(null, userFound);
            })
            .catch( (err: Error) => done(err));
    });

}

export default passportLocalStrategy;
