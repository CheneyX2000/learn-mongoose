import Book, { IBook } from '../models/book';
import Author from '../models/author';
//import express from 'express';

//const router = express.Router();

/**
 * @route GET /books
 * @returns an array of strings, where each string contains the book ID, title, and author name
 * @returns - a message indicating that no books were found if an error occurs
 */
//router.get('/', async (_, res) => {
//  try {
//    const data = await showBooks();
//    res.send(data);
//  } catch {
//    res.send('No books found');
//  }
//});
//
//export default router;

function getBooks() {
  return Book.find({}, 'title author')
    .sort({ title: 1 })
    .populate('author');
}

export const showBooks = async (): Promise<string[] | void> => {
  try {
    const books: IBook[] = await getBooks().exec();
    return books.map((b: IBook) => {
      const authorName = new Author(b.author).name; // Assuming 'Author' returns the author's name
      return `${b._id} : ${b.title} : ${authorName}`;
    });
  } catch (err) {
    console.log('Could not get books ' + err);
  }
}