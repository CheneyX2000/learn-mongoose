import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Document } from 'mongoose';
import Book, { IBook } from '../models/book';
import Author, { IAuthor } from '../models/author';
import Genre, { IGenre } from '../models/genre';

//const router = express.Router();

/**
 * Middleware specific to this router
 * The function is called for every request to this router
 * It parses the body and makes it available under req.body
 */
//router.use(bodyParser.urlencoded({ extended: true }));
//router.use(express.json());
//
///**
// * @route POST /newbook
// * @returns a newly created book for an existing author and genre in the database
// * @returns 500 error if book creation failed
// */
//router.post('/', async (req: Request, res: Response) => {
//  const { familyName, firstName, genreName, bookTitle } = req.body;
//  if (familyName && firstName && genreName && bookTitle) {
//    try {
//      const book = new Book({});
//      await book.saveBookOfExistingAuthorAndGenre(familyName, firstName, genreName, bookTitle);
//      res.send('Created new book: ' + book);
//    } catch (err: unknown) {
//      res.status(500).send('Error creating book: ' + (err as Error).message);
//    }
//  } else {
//    res.send('Invalid Inputs');
//  }
//});
//
//export default router;

async function getAuthor(family_name: string, first_name: string): Promise<Document<unknown, {}, IAuthor> & IAuthor> {
  return Author.findOne({ family_name, first_name }).exec() as Promise<Document<unknown, {}, IAuthor> & IAuthor>;
};

async function getGenre(name: string): Promise<Document<unknown, {}, IGenre>[]> {
  return Genre.find({ name }).exec() as Promise<Document<unknown, {},IAuthor>[]>;
};

export async function new_book (
  res: Response,
  family_name: string,
  first_name: string,
  genre_name: string,
  title: string
): Promise<void> {
  try {
    const author = await getAuthor(family_name, first_name);
    const genre = await getGenre(genre_name);
    const book = new Book({
      title,
      summary: 'Demo summary',
      author: author.id,
      isbn: 'ISBNTEST',
      genre: genre.map(g => g._id)
    });

    await book.save();
    res.send('Created new book: ' + book);
  } catch (err: unknown) {
    res.status(500).send('Error creating book: ' + (err as Error).message);
  }
};