import express from 'express';
import logger from '../utils/logger';
import Razorpay from 'razorpay';
import PaymentsModel from '../models/paymentsSchema';

export class PaymentsService {

    // Create instance with Razorpay
    razorpayInstance = new Razorpay({ key_id: 'rzp_test_IZWqnQp3SRAtI4', key_secret: 'l7jpji3W8YcBe13p3J5c7DRs' });

    apiPaymentOrder(req: express.Request, res: express.Response) {
        this.razorpayInstance.orders.create(req.body).then((order: any) => {
            // console.log('Payment Order ', req.body, order);
            return res.status(200).json({ order });
        }).catch((error: Error) => {
            logger.info('PaymentsService', ' apiPaymentOrder::ERROR ', error.message);
            return res.status(500).json({ message: error.message });
        });
    }

    savePayment(req: express.Request, res: express.Response) {
        console.log(req.body);
        // const { order_id: id, currency, amount, amount_due, amount_paid, attempts,
        // razorpay_payment_id, razorpay_signature, receipt_number, status } = req.body;

        const payment = new PaymentsModel(req.body);
        payment.save()
            .then(data => {
                if (data) {
                    return res.status(200).json({ message: 'Data Insert Successfull.', data });
                } else {
                    logger.info('PaymentsService', 'Data Insert Not Successfull.');
                    return res.status(500).json({ message: 'Data Insert Not Successfull.' });
                }
            })
            .catch(error => {
                logger.info('PaymentsService', ' savePayment::MONGO ERROR ', error.message);
                return res.status(500).json({ message: error.message });
            });
    }

    apiPaymentVerify(req: express.Request, res: express.Response) {

    }

}
