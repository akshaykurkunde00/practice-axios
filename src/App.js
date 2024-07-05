import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '' });
  const [updateBook, setUpdateBook] = useState({ key: '', title: '', author: '' });
  const [selectedBookKey, setSelectedBookKey] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    // Fetch initial data
    axios.get('https://openlibrary.org/subjects/science_fiction.json?limit=5')
      .then(response => setBooks(response.data.works))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleInputChange = (e, setter) => {
    setter(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      // Since the Open Library API doesn't support creating new books via POST request,
      // we simulate adding a book to the local state.
      const newBookData = {
        key: `OL${Math.random().toString(36).substr(2, 9)}`,
        title: newBook.title,
        authors: [{ name: newBook.author }]
      };
      setBooks([newBookData, ...books]);
      setNewBook({ title: '', author: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error making POST request:', error);
    }
  };

  const handlePutSubmit = async (e) => {
    e.preventDefault();
    try {
      // Since the Open Library API doesn't support updating books via PUT request,
      // we simulate updating a book in the local state.
      const updatedBooks = books.map(book =>
        book.key === updateBook.key
          ? { ...book, title: updateBook.title, authors: [{ name: updateBook.author }] }
          : book
      );
      setBooks(updatedBooks);
      setUpdateBook({ key: '', title: '', author: '' });
      setSelectedBookKey(null);
    } catch (error) {
      console.error('Error making PUT request:', error);
    }
  };

  const handleDelete = async (key) => {
    try {
      // Since the Open Library API doesn't support deleting books via DELETE request,
      // we simulate deleting a book from the local state.
      setBooks(books.filter(book => book.key !== key));
    } catch (error) {
      console.error('Error making DELETE request:', error);
    }
  };

  const selectBookForUpdate = (book) => {
    setUpdateBook({
      key: book.key,
      title: book.title,
      author: book.authors[0].name
    });
    setSelectedBookKey(book.key);
  };

  return (
    <div className="container">
      <h1>API Calls with Axios</h1>
      <header>
        <h2>myBooks</h2>
        <button className="add-book-button" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add Book'}
        </button>
      </header>

      {showAddForm && (
        <form onSubmit={handlePostSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newBook.title}
            onChange={(e) => handleInputChange(e, setNewBook)}
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={newBook.author}
            onChange={(e) => handleInputChange(e, setNewBook)}
          />
          <button type="submit">Add Book</button>
        </form>
      )}

      <ul>
        {books.map(book => (
          <li key={book.key}>
            <div className="book-details">
              <span>{book.title} by {book.authors[0].name}</span>
              <div className="button-group">
                <button onClick={() => selectBookForUpdate(book)}>Edit</button>
                <button onClick={() => handleDelete(book.key)}>Delete</button>
              </div>
            </div>
            {selectedBookKey === book.key && (
              <form onSubmit={handlePutSubmit}>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={updateBook.title}
                  onChange={(e) => handleInputChange(e, setUpdateBook)}
                />
                <input
                  type="text"
                  name="author"
                  placeholder="Author"
                  value={updateBook.author}
                  onChange={(e) => handleInputChange(e, setUpdateBook)}
                />
                <button type="submit">Update Book</button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
