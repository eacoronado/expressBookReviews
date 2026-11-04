const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  if(username && password){
    if(!isValid(username)){
      users.push({
        username: username,
        password: password
      })
      return res.status(200).json({
        message: "User successfully registerd"
      });
    }
    return res.status(409).json({message: "Username already exist"});
  }
  return res.status(400).json({message: "Missing username or password"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

async function getAllBooks(){
    try{
        const response = await axios.get("https://eacoronado79-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/");
    }catch(error){
        console.log(error.message);
    }
}
//getAllBooks().then(bookk => {console.log(books)});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if(book){
    return res.status(200).json(book)
  }
  return res.status(404).json({message: "Book not founded"});
 });

 async function getBookByIsbn(isbn){

    try{
        const response = await axios.get(`https://eacoronado79-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`)
        return response.data;
    }catch(error){
        console.log(error.message)
    }
 }
//  getBookByIsbn(2).then(book => {
//     console.log(book)
//  })
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const bookDetail = Object.values(books).filter(book => book.author === author);

  if(bookDetail.length > 0){
    return res.status(200).json(bookDetail)
  }
  return res.status(404).json({message: "Book not found"});
});

async function getBookByAuthor(author){
    try{
    const response = await axios(`https://eacoronado79-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/${author}`);
    return response.data;
    }catch(error){
        console.log(error.message)
    }
}
getBookByAuthor("Dante Alighieri").then(book => {
    console.log(book)
})

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const titleDetail = Object.values(books).filter(book => book.title === title);
  if(titleDetail.length > 0){
    return res.status(200).json(titleDetail);
  }
  return res.status(404).json({message: "Book not found"});
});



//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const reviewDetail = books[isbn];

  if(reviewDetail){
    return res.status(200).json(reviewDetail["reviews"]);
  }
  return res.status(404).json({message: "Review of book not found"});
});

module.exports.general = public_users;
