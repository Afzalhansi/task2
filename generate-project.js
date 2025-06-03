// generate-project.js
const fs = require('fs');
const path = require('path');

const structure = {
  'book-manager': {
    backend: {
      'server.js': `const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let books = [];

app.get('/books', (req, res) => res.json(books));

app.post('/books', (req, res) => {
    const { title, author } = req.body;
    const newBook = { id: Date.now(), title, author };
    books.push(newBook);
    res.status(201).json(newBook);
});

app.put('/books/:id', (req, res) => {
    const { id } = req.params;
    const { title, author } = req.body;
    const book = books.find(b => b.id == id);
    if (book) {
        book.title = title;
        book.author = author;
        res.json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

app.delete('/books/:id', (req, res) => {
    const { id } = req.params;
    books = books.filter(b => b.id != id);
    res.status(204).send();
});

app.listen(PORT, () => console.log(\`Server running on http://localhost:\${PORT}\`));`
    },
    frontend: {
      src: {
        'App.js': `import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: '', author: '', id: null });

  const fetchBooks = async () => {
    const res = await axios.get('http://localhost:3000/books');
    setBooks(res.data);
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.id) {
      await axios.put(\`http://localhost:3000/books/\${form.id}\`, form);
    } else {
      await axios.post('http://localhost:3000/books', form);
    }
    setForm({ title: '', author: '', id: null });
    fetchBooks();
  };

  const editBook = (book) => setForm(book);
  const deleteBook = async (id) => {
    await axios.delete(\`http://localhost:3000/books/\${id}\`);
    fetchBooks();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Book Manager</h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            className="w-full border p-2"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="w-full border p-2"
            placeholder="Author"
            value={form.author}
            onChange={e => setForm({ ...form, author: e.target.value })}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            {form.id ? 'Update Book' : 'Add Book'}
          </button>
        </form>
        <ul className="mt-4 space-y-2">
          {books.map(book => (
            <li key={book.id} className="flex justify-between items-center">
              <div>
                <strong>{book.title}</strong> by {book.author}
              </div>
              <div className="space-x-2">
                <button onClick={() => editBook(book)} className="text-yellow-600">Edit</button>
                <button onClick={() => deleteBook(book.id)} className="text-red-600">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;`,
        'index.js': `import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);`
      },
      public: {},
      'package.json': `{
  "name": "frontend",
  "version": "1.0.0",
  "dependencies": {
    "axios": "^1.6.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start"
  }
}`
    },
    'README.md': `# Book Manager Project

A simple full-stack application to manage a list of books.

## Features
- Add, update, delete books
- REST API built with Node.js + Express
- Frontend UI with React and Axios

## How to Run

### Backend:
\`\`\`
cd backend
npm install express cors
node server.js
\`\`\`

### Frontend:
\`\`\`
cd frontend
npm install
npm start
\`\`\`
`
  }
};

// Helper function to create files/folders recursively
function createStructure(base, obj) {
  for (const name in obj) {
    const target = path.join(base, name);
    if (typeof obj[name] === 'string') {
      fs.writeFileSync(target, obj[name]);
    } else {
      fs.mkdirSync(target, { recursive: true });
      createStructure(target, obj[name]);
    }
  }
}

// Run generator
createStructure('.', structure);
console.log('✅ Project structure created!');
