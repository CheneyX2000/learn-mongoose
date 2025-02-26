import { Request, Response } from 'express';
import Book, { IBook } from '../models/book';
import BookInstance, { IBookInstance } from '../models/bookinstance';

async function getBook(id: string): Promise<IBook | null> {
    if (typeof id !== 'string') {
      return null;
    }
    return Book.findOne({ _id: id }).populate('author').exec();
  }  

async function getBookDetail(id: string): Promise<IBookInstance[]> {
    return BookInstance.find({ book: id }).select('imprint status').exec();
  }
  
  export const showBookDetails = async (res: Response, id: string): Promise<void> => {
    try {
      const [book, copies] = await Promise.all([
        getBook(id),
        getBookDetail(id)
      ]);
  
      if (!book) {
        res.status(404).send(`Book ${id} not found`);
        return;
      }
  
      res.send({
        title: book.title,
        author: book.author.name,
        copies: copies
      });
    } catch (err) {
      res.status(500).send(`Error fetching book ${id}`);
    }
  };