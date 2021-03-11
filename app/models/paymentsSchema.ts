import mongoose, { Schema } from 'mongoose';

const paymentsData: Schema = new Schema({
    currency: { type: String },
    amount: { type: String },
    amount_due: { type: String },
    amount_paid: { type: String },
    attempts: { type: String },
    razorpay_payment_id: { type: String },
    razorpay_order_id: { type: String },
    razorpay_signature: { type: String },
    receipt_number: { type: String },
    status: { type: String },
    notes: { type: Array },
    failedDetails: {
        code: { type: String },
        description: { type: String },
        metadata: { type: String },
        reason: { type: String },
        source: { type: String },
        step: { type: String }
    }
});

const PaymentsModel = mongoose.model('paymentsData', paymentsData);
export default PaymentsModel;
