const http = require("http");
const fs = require("fs");
const path = require("path");

const { getAllBooks, createBook, updateBook, deleteBook } = "./process";

const connectBooks = path.join(__dirname, "db", "books.json");

const PORT = 8080;
const HOST_NAME = "localhost";

const requestHandler = function (req, res) {
  res.setHeader("Content-Type ", "application/json");

  const lastBook = booksDB[booksDB.length - 1];
  const lastBookId = lastBook.id;
  newBook.id = lastBookId + 1;

  if (req.url === "/books" && req.method === "GET") {
    getAllBooks(req, res);
  } else if (req.url === "/books" && req.method === "POST") {
    createBook(req, res);
  } else if (req.url === "/books" && req.method === "PUT") {
    updateBook(req, res);
  } else if (req.url === "/books" && req.method === "DELETE") {
    deleteBook(req, res);
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ msg: "Page not found" }));
  }
};

const server = http.createServer(requestHandler);

server.listen(PORT, HOST_NAME, () => {
  bookDB = JSON.parse(fs.readFileSync(connectBooks, "utf8"));
  console.log("Server running");
});
