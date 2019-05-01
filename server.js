const express = require('express');
const app = express();

//Interface with SQLite database
// const sqlite3 = require('sqlite3');
// const db = new sqlite3.Database('articles.db');

app.use(express.static('public'));

// start the server at URL: http://localhost:3000/
app.listen(3000, () => {
  console.log('Server started at http://localhost:3000/');
});
