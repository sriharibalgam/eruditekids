import * as mongoose from 'mongoose';

const packagesSchema = new mongoose.Schema({
    packageId: { type: String, unique: true },
    package_name: { type: String, required: true },
    description: { type: String },
    price: { type: String, required: true },
    offer_price: { type: String },
    package_type: { type: String },
    // validity: { },
    createdDate: {
        type: Date,
        default: Date.now()
    }
}, {
    collection: 'packages',
    strict: false
});

const packagesModel = mongoose.model('packages', packagesSchema);
packagesModel.createIndexes();

export { packagesModel };
