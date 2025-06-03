const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let books = [];
let idCounter = 1;

app.get("/books", (req, res) => {
  res.json(books);
});

app.post("/books", (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) return res.status(400).json({ error: "Missing title or author" });
  const newBook = { id: idCounter++, title, author };
  books.push(newBook);
  res.status(201).json(newBook);
});

app.put("/books/:id", (req, res) => {
  const { id } = req.params;
  const { title, author } = req.body;
  const book = books.find(b => b.id === parseInt(id));
  if (!book) return res.status(404).json({ error: "Book not found" });
  if (title) book.title = title;
  if (author) book.author = author;
  res.json(book);
});

app.delete("/books/:id", (req, res) => {
  const { id } = req.params;
  books = books.filter(b => b.id !== parseInt(id));
  res.json({ message: "Book deleted" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
