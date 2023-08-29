const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    //returns boolean
    //write code to check is the username is valid
    let userFiltered = users.filter((user) => user.username === username);
    return userFiltered > 0;
};

const authenticatedUser = (username, password) => {
    //returns boolean
    //write code to check if username and password match the one we have in records.
    let userFiltered = users.filter(
        (user) => user.username === username && user.password === password
    );
    return userFiltered.length > 0;
};

//only registered users can login
regd_users.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: 'Error logging in!' });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({ data: password }, 'access', {
            expiresIn: 60 * 60,
        });
        req.session.authorization = { accessToken, username };
        res.send(`Log in successfully!`);
    } else {
        return res.status(204).json({ message: 'Wrong username or password!' });
    }
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books.hasOwnProperty(isbn)) {
        const username = req.session.authorization.username;
        books[isbn].reviews[username] = req.query.review;
        res.send(`Add review of ${username} successfully!`);
    } else {
        return res
            .status(404)
            .json({ message: `No book with ISBN ${isbn} are found!` });
    }
});

// Delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books.hasOwnProperty(isbn)) {
        const username = req.session.authorization.username;
        if (!books[isbn].reviews.hasOwnProperty(username)) {
            res.send(`Review of ${username} not found!`);
        } else {
            delete books[isbn].reviews[username];
            res.send(`Delete review of ${username} successfully!`);
        }
    } else {
        return res
            .status(404)
            .json({ message: `No book with ISBN ${isbn} are found!` });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
