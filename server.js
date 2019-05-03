const express = require('express');
const app = express();
//Google trends api
const googleTrends = require('google-trends-api');
const bodyParser = require('body-parser');
// const writing = require('test.json');
var fs = require('fs');
var csv = require('fast-csv');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('writings.db');

const ejs = require('ejs');
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.use(bodyParser.urlencoded({extended: true})); // hook up with your app
//Interface with SQLite database
// const sqlite3 = require('sqlite3');
// const db = new sqlite3.Database('articles.db');
//
app.use(express.static('public'));

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/home.html');
// });

app.get('/trends', (req, res) => {
  googleTrends.dailyTrends({
    geo: 'US',
  }, (err, results) => {
    if (err) {
      console.log(err);
    } else{
      console.log("success");
      //Parse the JSON string into a Javascript object and get its value
      results = Object.values(JSON.parse(results));
      results = results[0].trendingSearchesDays;
      results = results[0].trendingSearches;
      results = results.map(result => {
        return result.title.query;
      });
      // results = Object.keys(results);
      res.send(results);
    }
  });
});

app.get('/trends/:trendname', (req, res) => {
  var trend = decodeURIComponent(req.params.trendname); // matches ':userid' above
  googleTrends.dailyTrends({
    geo: 'US',
  }, (err, results) => {
    if (err) {
      console.log(err);
    } else{
      console.log("success");
      //Parse the JSON string into a Javascript object and get its value
      results = Object.values(JSON.parse(results));
      results = results[0].trendingSearchesDays;
      results = results[0].trendingSearches;
      const titles = results.map(result => {
        return result.title;
      });
      var index;
      titles.map((title, i) => {
        if (title.query == trend) {
          index = i;
        }
        return -1;
      });
      console.log(results[index].articles);

      // res.send(results[index].articles);
      // console.log("renderrrrrr");
      res.send(results[index].articles);
    }
  });
})


// app.get('/Writing', function (req, res) {
//   fs.readFile('test.json', 'utf8', function (err, data) {
//     if (err) throw err;
//     data = JSON.stringify(data);
//     // data = data[0];
//     res.send(data);
//   });
// })

app.get('/writing', (req, res) => {
  // db.all() fetches all results from an SQL query into the 'rows' variable:
  db.all('SELECT title FROM writings', (err, rows) => {
    console.log(rows);
    rows = rows.map(rows => rows.title);
    res.send(rows);
  });
});



// start the server at URL: http://localhost:3000/
app.listen(3000, () => {
  console.log('Server started at http://localhost:3000/');
});
