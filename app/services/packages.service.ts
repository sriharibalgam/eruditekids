import { Request, Response } from 'express';
import logger from '../utils/logger';
import { packagesModel } from '../models/packages.model';

export class PackagesService {
    className = 'PackagesService';

    async getAllPackages(req: Request, res: Response) {
        try {
            const pkgsData = await packagesModel.find({});
            return res.status(pkgsData ? 200 : 204).json({ message: pkgsData });
        } catch (e: any) {
            logger.error(this.className, `Caught an exception while fetching - ${e.message}`);
            return res.status(500).send({ status: '500', message: `Oops! Something went wrong` });
        }// try-catch
    }

    async getPackageById(courseId: string) {
        if (courseId) {
            try {
                const pkgsData = await packagesModel.find({ packageId: courseId });
                return pkgsData[0]
            } catch (e: any) {
                logger.error(this.className, `Caught an exception while fetching - ${e.message}`);
                return false;
            }// try-catch
        }
        return false;
    }

    async savePackages(req: Request, res: Response) {

        try {
            const packages = req.body && !req.body.length ? [req.body] : req.body;
            const savePackage = await packagesModel.insertMany(packages);
            logger.info('PackagesService.savePackage', JSON.stringify(savePackage));
            return res.status(200).json({ message: savePackage });
        } catch (e: any) {
            logger.error('PackagesService.savePackage', JSON.stringify(e));
            return res.status(500).send({ status: '500', message: `Oops! Something went wrong. ${e.message}` });
        }
    }

}
