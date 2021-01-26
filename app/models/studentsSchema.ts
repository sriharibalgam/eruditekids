import mongoose, { Schema } from "mongoose";
import { IStudent } from "../interfaces/stundents.interface";

const StudentSchema:Schema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    role: { type: String },
});

const StudentsModel = mongoose.model<IStudent>('Students', StudentSchema);

export default StudentsModel;