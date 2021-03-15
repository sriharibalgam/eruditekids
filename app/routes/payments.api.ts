import express from 'express';
import logger from '../utils/logger';
import { PaymentsService } from '../services/payments.service';

const router = express.Router();

const paymentService = new PaymentsService();

/**
 * POST: /apiPaymentOrder
 * @param req - orderDetails: {...}
 * @param res - returns orderDetails
 */
const apiPaymentOrder = (req: express.Request, res: express.Response) => {
    logger.info('paymentsAPI', 'apiPaymentOrder');
    return paymentService.apiPaymentOrder(req, res);
};

/**
 * POST: /savePayment
 * @param req - Payment DEtails: {...}
 * @param res - returns Message { message: 'Success or Failure' }
 */
const savePayment = (req: express.Request, res: express.Response) => {
    logger.info('paymentsAPI', 'savePayment');
    return paymentService.savePayment(req, res);
};
/**
 * POST: /savePayment
 * @param req - param: id, body: { amount: string, currency}
 * @param res - returns Message { message: 'Success or Failure' }
 */
const capturePayment = (req: express.Request, res: express.Response) => {
    logger.info('paymentsAPI', 'capturePayment');
    return paymentService.capturePayment(req, res);
};

router.post('/order', apiPaymentOrder);
router.post('/savePayment', savePayment);
router.post('/payments/:id/capture', capturePayment);
router.post('/payments/:id', savePayment);
router.post('/payments', savePayment);

export default router;
