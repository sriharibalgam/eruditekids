import { Document } from 'mongoose';

export interface IStudent extends Document {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: string;
}
