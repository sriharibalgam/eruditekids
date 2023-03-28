import { Request, Response } from 'express';
import logger from '../utils/logger';
import Razorpay from 'razorpay';
import PaymentsModel from '../models/paymentsSchema';
import crypto from 'crypto';
import { PackagesService } from './packages.service';

export class PaymentsService {

    _packagesService: PackagesService = new PackagesService();

    key = process.env.RAZORPAY_KEY_ID;
    secret = process.env.RAZORPAY_KEY_SECRET;

    // Create instance with Razorpay
    razorPayInstance = new Razorpay({
        key_id: this.key,
        key_secret: this.secret,
    });

    /**
     * Create order with razor pay
     * @param req 
     * @param res 
     */
    async createOrder(req: Request, res: Response) {
        const course: any = await this._packagesService.getPackageById(req.body.course_id);

        const orderOptions = {
            amount: course.offer_price * 100, // format with paise
            currency: 'INR',
            receipt: `#Receipt_${course.packageId}_${Math.ceil(Math.random() * 1000)}`, //Receipt no that corresponds to this Order,
            payment_capture: 1,
            notes: {
                orderType: `${course.description}`
            }
        };

        this.razorPayInstance.orders.create(orderOptions).then(async (order: any) => {
            logger.info('PaymentsService.createOrder', req.body, order);
            const orderData = {
                order_id: order.id,
                ...order,
                user_id: req.headers.x_user_data,
                course_id: course.packageId
            };
            const saveOrder = await PaymentsModel.insertMany([orderData]);
            return res.status(200).json({ order: saveOrder[0], key: this.key, course_name: course.package_name });
        }).catch((error: Error) => {
            logger.info('PaymentsService.createOrder', 'Caught an exceptions::ERROR:', error.message);
            return res.status(500).json({ message: error.message });
        });
    }

    /**
     * Save Success or Failure information to database.
     * @param req 
     * @param res 
     * @returns 
     */
    savePayment(req: Request, res: Response) {
        console.log('Save Payment Received.', req.body);

        if (req.body.status === 'SUCCESS') {
            this.updateSuccessPayment(req);
            return res.status(200).json({ message: 'Data Insert Successfully.' });
        } else {
            this.updateFailedPayment(req);
            return res.status(200).json({ message: 'Data Insert Successfully.' });
        }
    }

    /**
     * Verify Payment signature
     * @param req 
     * @returns 
     */
    apiPaymentVerify(req: Request) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const secret: any = this.secret;
        let response = { signatureIsValid: false }

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac('sha256', secret).update(sign.toString()).digest('hex')

        console.log("sign received ", razorpay_signature, "sign generated ", expectedSignature);

        if (expectedSignature === razorpay_signature) {
            response = { signatureIsValid: true }
        } else {
            response = { signatureIsValid: false }
        }
        return response;
    }

    /**
     * Update Success status for order_id and Verify the Signature
     * @param req 
     * @returns 
     */
    async updateSuccessPayment(req: Request) {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

            // Update Payment info
            const savePayment = await PaymentsModel.updateMany(
                { order_id: razorpay_order_id },
                {
                    $set: {
                        razorpay_order_id, razorpay_payment_id, razorpay_signature
                    }
                }
            );
            // Verify Payment with rzp
            const verifySign = this.apiPaymentVerify(req);
            const verifyOrderStatus = await this.verifyOrderStatus(req.body);

            if (savePayment && verifySign.signatureIsValid && verifyOrderStatus) {
                return true;
            }
        } catch (error: any) {
            logger.info('PaymentsService', ' savePayment::MONGO ERROR ', error.message);
            return false;
        };
        return false;
    }

    /**
     * Update Failed Status for order_id in the database
     * @param req 
     * @returns 
     */
    async updateFailedPayment(req: Request) {
        try {
            const data = req.body;

            // Update Payment info
            const updated = await PaymentsModel.updateMany(
                { order_id: data.metadata.order_id },
                {
                    $push: {
                        failedInfo: {
                            code: data.code,
                            description: data.description,
                            metadata: data.metadata,
                            reason: data.reason,
                            source: data.source,
                            step: data.step
                        }
                    }
                });
            return updated;

        } catch (error: any) {
            logger.info('PaymentsService', ' savePayment::MONGO ERROR ', error.message);
            return false;
        };
    }

    capturePayment(req: Request, res: Response) {

    }

    async refundAmount(req: Request, res: Response) {
        try {
            //first validate the payment Id then call razorpay API
            const options = {
                payment_id: req.body.paymentId,
                amount: req.body.amount,
            };
            const razorpayResponse = await this.razorPayInstance.refund(options);
            //we can store detail in db and send the response
            res.status(200).send('Successfully refunded')
        } catch (error) {
            console.log(error);
            res.status(400).send('Unable to refund the payment');
        }
    }

    /**
     * Get Payments History with razorpay
     * @param req 
     * @param res 
     */
    async getPaymentsHistory(req: Request, res: Response) {
        this.razorPayInstance.payments.all({
            from: req.query.fromDate,
            to: req.query.toDate
        }, (error: any, response: any) => {
            if (error) {
                // handle error
            } else {
                // handle success
            }
        })
    }

    /**
     * Verify order status with razorpay and update in the database
     * @param order 
     * @returns 
     */
    async verifyOrderStatus(order: any) {
        if (order.razorpay_order_id) {
            // verify Order Status with rzp
            const paymentStatus = await this.razorPayInstance.orders.fetch(order.razorpay_order_id);

            if (paymentStatus) {
                // Update Payment info
                await PaymentsModel.updateMany(
                    { 'order_id': paymentStatus.id },
                    {
                        $set: {
                            "amount_paid": paymentStatus.amount_paid,
                            "amount_due": paymentStatus.amount_due,
                            "status": paymentStatus.status,
                            updatedAt: Date.now()
                        }
                    }
                );

            }
            return paymentStatus;
        }

        return false;
    }


}
