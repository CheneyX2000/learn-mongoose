import { Request, Response } from 'express';
import Book, { IBook } from '../models/book';
import BookInstance, { IBookInstance } from '../models/bookinstance';
import express from 'express';

//const router = express.Router();

/**
 * @route GET /available
 * @returns {object} 200 - An array of available books
 * @returns {Error}  500 - if an error occurs when fetching the books
 */
//router.get('/', async (_, res: Response) => {
//  try {
//    const results = await BookInstance.getAllBookStatuses();
//    res.status(200).send(results);
//  }
//  catch (err) {
//    res.status(500).send('Status not found');
//  }
//});
//
//export default router;

export const showAllBooksStatus = (res: Response): void => {
  BookInstance.find({ status: { $eq: 'Available' } })
    .populate('book')
    .exec()
    .then((listBookInstances: IBookInstance[]) => {
      const results = listBookInstances.map((BookInstance: IBookInstance) => {
        return `${BookInstance.book.title} : ${BookInstance.status}`;
      });
      res.send(results);
    })
    .catch(err => res.send('Status not found'));
};