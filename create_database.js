// var fs = require('fs');
// var csv = require('fast-csv');
// fs.createReadStream('articles.csv')
//   .pipe(csv())
//   .on('data',function(data){
//     console.log(data);
//     fs.writeFileSync('articles.json', data);
//   })
//   .on('end',function(data){
//     console.log('Read finished');
//
//   });


// let data = JSON.stringify(csv);
// fs.writeFileSync('articles.json', data);

// fs.readFile('test.json', 'utf8', function (err, data) {
//   if (err) throw err;
//   obj = JSON.parse(data);
//   res.send(JSON.stringify(obj));
// });

const sqlite3 = require('sqlite3');
const fs = require('fs');
const csv = require('fast-csv');
const db = new sqlite3.Database('writings.db');

var writing = {author: [], claps: [], time: [], link: [], title: [], text: []};

csv
  .fromPath('articles.csv')
  .on('data', data => {

    writing.author = data[0];
    writing.claps = data[1];
    writing.time = data[2];
    writing.link = data[3];
    writing.title = data[4];
    writing.text = data[5];
  })
  .on('end', () => {

    console.log('Parsing complete!');
  });


db.serialize(() => {
  // create a new database table:
  db.run("CREATE TABLE writings (author TEXT, claps NUMERIC, time NUMERIC, title TEXT)");

    // insert 3 rows of data:
    db.run('INSERT INTO writings VALUES ("Nityesh Agarwal", "2.4K", "13", "WTH does a neural network even learn??")');
    db.run('INSERT INTO writings VALUES ("Emmanuel Ameisen", "935", "11", "Reinforcement Learning from scratch ��� Insight Data")');
    db.run('INSERT INTO writings VALUES ("Gant Laborde", "1.3K", "7", "Machine Learning: how to go from Zero to Hero ��� freeCodeCamp")');
    db.run('INSERT INTO writings VALUES ("William Koehrsen", "2.8K", "11", "Automated Feature Engineering in Python ��� Towards Data Science")');
    db.run('INSERT INTO writings VALUES ("Conor Dewey", "1.4K", "7", "Python for Data Science: 8 Concepts You May Have Forgotten")');
    db.run('INSERT INTO writings VALUES ("Justin Lee", "8.3K", "11", "Chatbots were the next big thing: what happened?")');


    console.log('successfully created the writings table in pets.db');


    db.each("SELECT author, claps, time FROM writings", (err, row) => {
        console.log(row.author + ": " + row.claps + ' - ' + row.time);
    });
  });

  db.close();
