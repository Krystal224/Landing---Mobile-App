const express = require('express');
const app = express();
//Google trends api
const googleTrends = require('google-trends-api');
//Database

//Body parse
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true})); // hook up with your app
//Handlebars
const hbs = require( 'express-handlebars');

// require('./create_database.js');
const path = require('path');

// use this library to interface with SQLite databases: https://github.com/mapbox/node-sqlite3

//CHANGE HERE
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('test.db');



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

// app.get('/writing', (req, res) => {
//   // db.all() fetches all results from an SQL query into the 'rows' variable:
//   db.all('SELECT title FROM writings', (err, rows) => {
//     console.log(rows);
//     rows = rows.map(rows => rows.title);
//     res.send(rows);
//   });
// });


app.get('/fetchData',(req, res, next) =>{
  console.log("requesting to fetch data");
  db.all('SELECT * FROM author_article', (err, rows) =>{
    // console.log(rows);
    // const articles = rows.map(e => e.title);
    // res.render('home',{
    //     send_data:rows
    // });
    res.send(rows);
    // res.sendFile(path.join(__dirname, 'index.html'))
  });
});

app.post('/updateLike', (req, res, next) => {

  const { body } = req;
  const { article_id } = body;
  console.log(article_id);
  db.get('SELECT like FROM author_article WHERE id = ' + article_id, (err, result) => {
    console.log(result);
    db.get('UPDATE author_article SET like = ' + (result.like + 1) + ' WHERE id = ' + article_id, (err,) => {
      if (err) {
        res.send({
          succees: false,
          message: "Internal error"
        })
      }
    });
  });
})

// start the server at URL: http://localhost:3000/
app.listen(3000, () => {
  console.log('Server started at http://localhost:3000/');
});
