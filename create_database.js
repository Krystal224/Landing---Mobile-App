// File Header:

// This file creates the Sqlite database called test.db, which make uses of the json file cleaned by clean_csv.py
// It creates a table called 'author_article' with 10 columns, including article title, author, reading_time,
// clappings,like reasons(title,layout,content).


console.log('running create database');

const fs = require('fs');
var jsonText = fs.readFileSync('new.json');
var jsonObj = JSON.parse(jsonText);
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('test.db');


  //DROP TABLE [IF EXISTS] [schema_name.]author_article;
db.serialize(() => {
  // create a new database table:
   // DROP TABLE [IF EXISTS] [schema_name.]author_article;
   db.run("DROP TABLE author_article");
   db.run("CREATE TABLE author_article (id NUM, author TEXT, title TEXT, claps TEXT, reading_time NUM, link TEXT, like_title NUM, like_content NUM,like_layout NUM,actionT NUM)");


  //load every author's information to this Database
  // 1. sort the json file by claps
  // how to link json file to here as an object and then get obj.key for value
  // 2. insert json file one by one, so db.run 100 times
  // 3. How to write on web page?

  var i = 0
  for (i = 0; i < 99; i++){

     db.run("INSERT INTO author_article VALUES(?,?,?,?,?,?,?,?,?,?)", i, jsonObj[i].author, jsonObj[i].title,jsonObj[i].claps,jsonObj[i].reading_time, jsonObj[i].link, 0,0,0,0);
  }

});

db.close();
