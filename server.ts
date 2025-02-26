import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import * as Home from './pages/home';
import * as books_status from './pages/books_status';
import * as Books from './pages/books';
import * as Authors from './pages/authors';
import * as BookDetails from './pages/books_details';
import * as CreateBook from './pages/create_book';

// Create express app
const app = express();
// Setup server port
const port = 8000;

// setup the server to listen on the given port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const mongoDB = 'mongodb://127.0.0.1:27017/my_library_db';
mongoose.connect(mongoDB);
const db = mongoose.connection;

// Bind database connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// when successfully connected log a message
db.on('connected', () => {
  console.log('Connected to database');
});

/**
 * Middleware to specify cors policy.
 * This will intercept every request.
 * This is unsafe because it trusts all origins.
 * Do not use this in production.
 */
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// setup the router middleware for this server
app.get('/home', (_, res: Response) => {
  Home.show_home(res);
});

app.get('/available', (_, res: Response) => {
  books_status.showAllBooksStatus(res);
})

app.get('/books', async (_, res: Response) => {
  try {
    const data = await Books.showBooks();
    res.send(data);
  } catch {
    res.send('No books found');
  }
});

app.get('/authors', (req: Request, res: Response) => {
  Authors.showAllAuthors(res);
});

app.get('/book_dtls', (req: Request, res: Response) => {
  BookDetails.showBookDetails(res, req.query.id as string);
});

app.get('/newbook', (req: Request, res: Response) => {
  const { familyName, firstName, genreName, bookTitle } = req.body;
  if (familyName && firstName && genreName && bookTitle) {
    CreateBook.new_book(res, familyName, firstName, genreName, bookTitle).catch(err => {
      res.send('Failed to create new book ' + err);
    });
  } else {
    res.send('Invalid Input');
  }
});