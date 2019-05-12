const express = require('express');
const app = express();
//Google trends api
const googleTrends = require('google-trends-api');
//Database
const fs = require('fs');
const csv = require('fast-csv');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('writings.db');
//Body parse
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true})); // hook up with your app
//Handlebars
const hbs = require( 'express-handlebars');


app.engine('hbs', hbs({
  defaultLayout: 'main.hbs'
}));
app.set('view engine', 'hbs');

// app.get('/',(req, res)=>{
//   console.log("called");
//   res.render('home', {title: 'Home'});
// });



app.use(express.static('public'));
app.use(express.static('public/img'));

app.get('/', (req, res) => {
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
      console.log(typeof(results));
      // results = Object.keys(results);
      res.render('home', {
        tag: results
      });
    }
  });
});

app.get('/trends/:trendid', (req, res) => {
  var trend = req.params.trendid; // matches ':userid' above
  console.log(req.params);
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
      console.log("rendering trend news page");
      res.render('news', {
        tag: titles[index].query,
        news: results[index].articles,
      });
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
