import express from 'express';
import logger from '../utils/logger';
import { PackagesService } from '../services/packages.service';

const router = express.Router();

const packagesService = new PackagesService();

router.get('/list-packages', async (req: express.Request, res: express.Response) => {
    logger.info('Packages.API', 'Get Packages Service call');
    return packagesService.getAllPackages(req, res);
});

router.get('/get-package', async (req: express.Request, res: express.Response) => {
    logger.info('Packages.API:/get-package', 'Get Packages Service call');

    if (req.query.id) {
        try {
            const packageData = await packagesService.getPackageById(req.query.id.toString());;
            return res.status(packageData ? 200 : 204).json({ message: packageData });
        } catch (e: any) {
            logger.error('PackagesAPI:/get-package', `Caught an exception while fetching - ${e.message}`);
            return res.status(500).send({ status: '500', message: `Oops! Something went wrong` });
        }// try-catch
    } else {
        logger.error('PackagesAPI:/get-package', `Missing Package Id`);
        return res.status(400).send({ status: '400', message: 'Invalid Request' });
    }
});

router.post('/save-package', async (req: express.Request, res: express.Response) => {
    logger.info('Packages.API', 'Save Package Service Call');
    return packagesService.savePackages(req, res);
});

export default router;
