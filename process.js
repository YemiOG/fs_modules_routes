const http = require("http");
const fs = require("fs");
const path = require("path");

const connectBooks = path.join(__dirname, "db", "books.json");

const getAllBooks = function (req, res) {
  fs.readFile(connectBooks, "utf8", (err, data));
  if (err) {
    console.log(err);
    res.writeHead(400);
    res.end("An error occured");
  }
  res.end(data);
};

function createBook(req, res) {
  const body = [];

  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", () => {
    const parsedBook = Buffer.concat(body).toString();
    const newBook = JSON.parse(parsedBook);
    console.log(newBook);

    fs.readFile(connectBooks, "utf8", (err, data) => {
      if (err) {
        console.log(err);
        res.writeHead(400);
        res.end("An error occured");
      }
      const oldBooks = JSON.parse(data);
      const allBooks = [...oldBooks, newBook];
      fs.writeFile(connectBooks, JSON.stringify(allBooks), (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end(
            JSON.stringify({
              msg: "Internal Server error, could not add book to databse",
            })
          );
        }
        res.end(JSON.stringify(newBook));
      });
    });
  });
}

function updateBook(req, res) {
  const body = [];

  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", () => {
    const parsedBook = Buffer.concat(body).toString();
    const detailsToUpdate = JSON.parse(parsedBook);
    const bookId = detailsToUpdate.id;

    fs.readFile(connectBooks, "utf8", (err, data) => {
      if (err) {
        console.log(err);
        res.writeHead(400);
        res.end("An error occured");
      }
      const bookIndex = books.find((book) => {
        return book.id === bookId;
      });
      // Return 404 if book not found
      if (bookIndex === -1) {
        res.writeHead(404);
        res.end(
          JSON.stringify({
            message: "Book not found",
          })
        );
        return;
      }

      // update the book in the database
      booksDB[bookIndex] = { ...booksDB[bookIndex], ...bookToUpdate };

      // save to db
      fs.writeFile(booksDbPath, JSON.stringify(booksDB), (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end(
            JSON.stringify({
              message:
                "Internal Server Error. Could not update book in database.",
            })
          );
        }

        res.end(JSON.stringify(bookToUpdate));
      });
    });
  });
}
const deleteBook = function (req, res) {
  const bookId = req.url.split("/")[2];

  // Remove book from database
  const bookIndex = booksDB.findIndex((book) => {
    return book.id === parseInt(bookId);
  });

  if (bookIndex === -1) {
    res.writeHead(404);
    res.end(
      JSON.stringify({
        message: "Book not found",
      })
    );

    return;
  }

  booksDB.splice(bookIndex, 1); // remove the book from the database using the index

  // update the db
  fs.writeFile(connectBooks, JSON.stringify(booksDB), (err) => {
    if (err) {
      console.log(err);
      res.writeHead(500);
      res.end(
        JSON.stringify({
          message:
            "Internal Server Error. Could not delete book from database.",
        })
      );
    }

    res.end(
      JSON.stringify({
        message: "Book deleted",
      })
    );
  });
};
module.exports = { getAllBooks, createBook, updateBook, deleteBook };
