import express from 'express';
import logger from '../utils/logger';
import PhonicsModel from '../models/phonicsSchema';
const querystring = require('querystring');

export class PhonicsService {

    /**
     * @param req - WordData: {}
     * returns Success or Failure
     */
    savePhonicSound(req: express.Request, res: express.Response) {
        logger.info('PhonicsService', ' savePhonicSounds ');

        PhonicsModel.findOne({ sound: req.body.sound }, (err: Error, foundWord: any) => {
            if (err) { throw err; }

            if (!foundWord) {
                logger.info('PhonicsService', 'No Word Data Found Inserting');
                const insertWord = new PhonicsModel(req.body);
                insertWord.save()
                    .then(data => {
                        if (data) {
                            return res.status(200).json({ message: 'Data Insert Successfull.', data });
                        } else {
                            logger.info('PhonicsService', 'Data Insert Not Successfull.');
                            return res.status(500).json({ message: 'Data Insert Not Successfull.' });
                        }
                    })
                    .catch(error => {
                        logger.info('PhonicsService', ' savePhonicSound::MONGO ERROR ', error.message);
                        return res.status(500).json({ message: error.message });
                    });
            } else {
                logger.info('PhonicsService', 'Record Alraedy Exists');
                return res.status(409).json({ message: 'Record Already Exists' });
            }
        });
    }

    /**
     * @param req - WordData: [ 'end', 'middle', 'start' ]
     * returns Array of unfound sounds
     */
    updatePhonicSound(req: express.Request, res: express.Response) {
        logger.info('PhonicsService', ' updatePhonicSound ');
        const filter = { sound: req.body.sound };
        const update = req.body;

        PhonicsModel.findOneAndUpdate(filter, update, { upsert: false, new: true }, (error, doc) => {
            if (error) { throw error; }

            if (doc) {
                logger.info('PhonicsService', 'findOneAndUpdate:: Record Updated');
                return res.status(200).json({ message: 'Record Updated' });
            } else {
                logger.info('PhonicsService', 'findOneAndUpdate:: No Record Found');
                return res.status(204).json({ message: 'No Record Found' });
            }
        });
    }

    /**
     * @param req - WordData: []
     * returns Success or Failure
     */
    findPhonicSounds(req: express.Request, res: express.Response) {
        logger.info('PhonicsService', ' findPhonicSounds ');

        const queryString = Object.keys(querystring.parse(req.query.searchWords))[0];
        const searchWords = JSON.parse(queryString);

        logger.info('Phonics', 'Query:: ' + searchWords);
        // TODO: Convert searchWords to Array
        PhonicsModel.find({ 'sound': { $in : searchWords } }, (err: Error, records: any) => {
            if (err) { throw err; }
            if (records.length) {
                const foundWords = records.map( (word: any) => word.sound); // Map sounds from records
                // Filter words from SearchWords and return an array of words that are not exist in database
                let unMatchedData;
                if (foundWords.length >= searchWords.length) {
                    unMatchedData = foundWords.filter((f: string) => !searchWords.includes(f));
                } else {
                    unMatchedData = searchWords.filter((f: any) => !foundWords.includes(f));
                }
                return res.status(200).json({ message: 'Success', unfoundWords: unMatchedData, foundWords: records });
            } else {
                logger.info('info', 'NO Records Found');
                return res.status(200).json({ message: 'No Data Found', unfoundWords: searchWords});
            }
        });
    }

}
