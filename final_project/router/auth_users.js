const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
 return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message: "Error loggin in"});
  }
  if(!isValid(username)){
    return res.status(404).json({message: "User does not exist"});
  }
  if(authenticatedUser(username, password)){
    const accessToken = jwt.sign(
      {username: username},
      "access",
      {expiresIn: "1h"}
    );
    req.session.authorization = {
      accessToken: accessToken,
      username:username
    };
    return res.status(200).json({message: "User successfully logged in", token: accessToken});
  }else{
  return res.status(401).json({message: "Incorrect Password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  const book = books[isbn];
  console.log("book: ", book);
  console.log("username: ", username);
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
