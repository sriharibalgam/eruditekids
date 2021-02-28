import mongoose, { Schema } from 'mongoose';

const phonicsData: Schema = new Schema({
    word : { type: String },
    sound: { type: String, unique: true },
    category: { type: String },
    subcat: { type: String },
    imageUrl: { type: String },
    imgDescription: { type: String },
    data: [
        {
            sound: { type: String },
            soundPhonem: { type: String },
            index: { type: [] },
            audioSrc: { type: String }
        }
    ]
});

const PhonicsModel = mongoose.model('PhonicsData', phonicsData);
export default PhonicsModel;
