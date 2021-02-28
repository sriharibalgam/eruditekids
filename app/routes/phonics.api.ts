import express from 'express';
import logger from '../utils/logger';
import { PhonicsService } from '../services/phonics.service';

const router = express.Router();

const phonicsService = new PhonicsService();

/**
 * POST: /savePhonics
 * @param req - wordadata: {...}
 * @param res - returns wordadata or Duplicate Message { message: '', data: wordadata }
 */
const savePhonicSound = (req: express.Request, res: express.Response) => {
    logger.info('PhonicsAPI', 'savePhonicSound');
    return phonicsService.savePhonicSound(req, res);
};

/**
 * PUT: /updatePhonics
 * @param req - wordadata: {...}
 * @param res - returns success or failure message JSON { message: '', data: wordadata }
 */
const updatePhonicSound = (req: express.Request, res: express.Response) => {
    logger.info('PhonicsAPI', 'updatePhonicSound');
    return phonicsService.updatePhonicSound(req, res);
};

/**
 * GET: /updatePhonics
 * @param req - wordadata: ['end', 'middle', 'start']
 * @param res - returns Check and send Filtered Words doesn't exist in DB { message: '', data: filteredWords }
 */
const findPhonics = (req: express.Request, res: express.Response) => {
    logger.info('PhonicsAPI', 'findPhonics');
    return phonicsService.findPhonicSounds(req, res);
};

router.post('/savePhonics', savePhonicSound);
router.put('/updatePhonics', updatePhonicSound);
router.get('/findPhonics', findPhonics);

export default router;
