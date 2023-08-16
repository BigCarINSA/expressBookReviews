const express = require('express');
const axios = require('axios');

let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        res.status(422).json({ message: 'Invalid register details!' });
    } else {
        if (isValid(username)) {
            res.status(404).json({
                message: `User ${username} already existed!`,
            });
        } else {
            users.push({ username, password });
            res.send('User successfully registred. Now you can login');
        }
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const booksJSON = JSON.stringify(books, null, 4);
    return res.send(booksJSON);
});

// Get async the book list available in the shop
public_users.get('/async', function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        resolve(JSON.stringify(books, null, 4));
    });
    getBooks.then((booksJSON) => res.send(booksJSON));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books.hasOwnProperty(isbn)) {
        return res.send(books[isbn]);
    } else {
        return res
            .status(404)
            .json({ message: `No book with ISBN ${isbn} are found!` });
    }
});

// Get async book details based on ISBN
public_users.get('/async/isbn/:isbn', function (req, res) {
    const getBook = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        if (books.hasOwnProperty(isbn)) {
            resolve(books[isbn]);
        } else {
            const err = new Error(`No book with ISBN ${isbn} are found!`);
            reject(err);
        }
    });

    getBook
        .then((book) => res.send(book))
        .catch((err) => res.send(err.message));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksKey = Object.keys(books);
    const isbnToFind = booksKey.filter((isbn) => {
        return books[isbn].author === author;
    });
    if (isbnToFind.length > 0) {
        return res.send(books[isbnToFind[0]]);
    } else {
        return res
            .status(404)
            .json({ message: `No book written by ${author} are found!` });
    }
});

// Get async book details based on author
public_users.get('/async/author/:author', function (req, res) {
    const author = req.params.author;
    const booksKey = Object.keys(books);

    const getBook = new Promise((resolve, reject) => {
        const isbnToFind = booksKey.filter((isbn) => {
            return books[isbn].author === author;
        });
        if (isbnToFind.length > 0) {
            resolve(books[isbnToFind[0]]);
        } else {
            const err = new Error(`No book written by ${author} are found!`);
            reject(err);
        }
    });

    getBook
        .then((book) => res.send(book))
        .catch((err) => res.send(err.message));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksKey = Object.keys(books);
    const isbnToFind = booksKey.filter((isbn) => {
        return books[isbn].title === title;
    });
    if (isbnToFind.length > 0) {
        return res.send(books[isbnToFind[0]]);
    } else {
        return res
            .status(404)
            .json({ message: `No book with title ${title} are found!` });
    }
});

// Get async book details based on title
public_users.get('/async/title/:title', function (req, res) {
    const title = req.params.title;
    const booksKey = Object.keys(books);

    const getBook = new Promise((resolve, reject) => {
        const isbnToFind = booksKey.filter((isbn) => {
            return books[isbn].title === title;
        });
        if (isbnToFind.length > 0) {
            resolve(books[isbnToFind[0]]);
        } else {
            const err = new Error(`No book with title ${title} are found!`);
            reject(err);
        }
    });

    getBook
        .then((book) => res.send(book))
        .catch((err) => res.send(err.message));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books.hasOwnProperty(isbn)) {
        return res.send(books[isbn].reviews);
    } else {
        return res
            .status(404)
            .json({ message: `No book with ISBN ${isbn} are found!` });
    }
});

module.exports.general = public_users;
