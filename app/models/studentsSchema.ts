import mongoose, { Schema } from 'mongoose';
import { IStudent } from '../interfaces/students.interface';

const studentSchema: Schema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    role: { type: String },
    subscriptions: { type: Object },
    status: { type: Boolean }
}, {
    strict: false,
    collection: 'students'
});

const StudentsModel = mongoose.model< IStudent>('students', studentSchema);

export default StudentsModel;
