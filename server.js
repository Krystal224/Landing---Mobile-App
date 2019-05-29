const express = require('express');
const app = express();
//Google trends api
const googleTrends = require('google-trends-api');
//Database

//Body parse
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true})); // hook up with your app
//Handlebars
const exphbs = require( 'express-handlebars');

 require('./create_database.js');
const path = require('path');

// use this library to interface with SQLite databases: https://github.com/mapbox/node-sqlite3

//CHANGE HERE
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('test.db');
const db2 = new sqlite3.Database('writing_article.db');

var hbs = exphbs.create({
  defaultLayout: 'main',
  partialsDir: ['views/partials/']
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

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
      var icon = []
      var saved = "fas fa-star";
      var unsaved = "far fa-star";
      results[index].articles.map(article => {
        var t = article.title;
        db.all('SELECT title FROM bookmarks WHERE title=$title',
          {
            $title: t
          },
          (err, rows) => {
            if (rows.length > 0) {
              console.log("exists");
              icon.push("fas fa-star");
            }
            else {
              console.log("nooo");
              icon.push("far fa-star");
            }
          }
        );
      });

      setTimeout(function(){
        res.render('news', {
          tag: titles[index].query,
          news: results[index].articles,
          star: icon
        });
      },500);

    }
  });
})

app.post('/bookmarks', (req, res) => {
  console.log("herr");
  console.log(req.body.title);
  //check duplicates
  db.all('SELECT title FROM bookmarks WHERE title=$title',
    {
      $title: req.body.title
    },
    (err, rows) => {
      if (rows.length > 0) {
        console.log("exists");
      }
      else {
        db.run(
          'INSERT INTO bookmarks VALUES ($title, $link)',
          // parameters to SQL query:
          {
            $title: req.body.title,
            $link: req.body.link,
          },
          // callback function to run when the query finishes:
          (err) => {
            if (err) {
              res.send({message: 'error in app.post(/users)'});
            } else {
              console.log("sucesss");
              res.send("success");
            }
          }
        );
      }
    }
  );
});

app.get('/source', (req, res) => {
  res.render('mySource');
});

app.get('/sourcedata', (req, res) => {
  db.all('SELECT * FROM bookmarks', (err, rows) => {
    // console.log(rows);
    // res.send(rows);
    res.send(rows);
  });
});

app.post('/sourcedata', (req, res) => {
  console.log("sssssss");
  console.log(req.body.title);
  db.run('DELETE FROM bookmarks WHERE title=$title',
    {
      $title: req.body.title
    },
    (err) => {
      if (err) {
        res.send({message: "error!"});
      } else {
        db.all('SELECT * FROM bookmarks', (err, rows) =>{
          res.send(rows);
        });
      }
    }
  );
});


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
  db.all('SELECT * FROM author_article LIMIT 4', (err, rows) =>{
    // console.log(rows);
    // const articles = rows.map(e => e.title);
    // res.render('home',{
    //     send_data:rows
    // });

    var icon = []
    var saved = "fas fa-star";
    var unsaved = "far fa-star";
    rows.map(article => {
      var t = article.title;
      db.all('SELECT title FROM bookmarks WHERE title=$title',
        {
          $title: t
        },
        (err, rows) => {
          if (rows.length > 0) {
            console.log("exists");
            icon.push("fas fa-star");
          }
          else {
            console.log("nooo");
            icon.push("far fa-star");
          }
        }
      );
    });

    setTimeout(function(){
      console.log("icon");
      console.log(icon);
      res.send({
        row: rows,
        star: icon
      });
    },500);
    // res.sendFile(path.join(__dirname, 'index.html'))
  });
});

app.get('/fetchArticle',(req, res, next) =>{
  console.log("requesting to fetch article");
  db2.all('SELECT * FROM new_article ', (err, rows) =>{
    // console.log(rows);
    // const articles = rows.map(e => e.title);
    // res.render('home',{
    //     send_data:rows
    // });
    res.send(rows);
    // res.sendFile(path.join(__dirname, 'index.html'))
  });
});

app.get('/latest_reading',(req, res, next) =>{
  console.log("requesting to fetch latest reading time");

  db.all('SELECT reading_time FROM author_article WHERE id < 40 ', (err, result) =>{


    res.send(result);

  });

});

app.post('/expand1',(req, res, next) =>{
  console.log("requesting to fetch data expand1");
  db.all('SELECT * FROM author_article LIMIT 8', (err, rows) =>{
    console.log("find rows");
    var icon = []
    var saved = "fas fa-star";
    var unsaved = "far fa-star";
    rows.map(article => {
      var t = article.title;
      db.all('SELECT title FROM bookmarks WHERE title=$title',
        {
          $title: t
        },
        (err, rows) => {
          if (rows.length > 0) {
            console.log("exists");
            icon.push("fas fa-star");
          }
          else {
            console.log("nooo");
            icon.push("far fa-star");
          }
        }
      );
    });

    setTimeout(function(){
      console.log("icon");
      console.log(icon);
      res.send({
        row: rows,
        star: icon
      });
    },500);


  });
});

app.post('/expand2',(req, res, next) =>{
  console.log("requesting to fetch data expand1");
  db.all('SELECT * FROM author_article', (err, rows) =>{
    console.log("find rows");

    var icon = []
    var saved = "fas fa-star";
    var unsaved = "far fa-star";
    rows.map(article => {
      var t = article.title;
      db.all('SELECT title FROM bookmarks WHERE title=$title',
        {
          $title: t
        },
        (err, rows) => {
          if (rows.length > 0) {
            console.log("exists");
            icon.push("fas fa-star");
          }
          else {
            console.log("nooo");
            icon.push("far fa-star");
          }
        }
      );
    });

    setTimeout(function(){
      console.log("icon");
      console.log(icon);
      res.send({
        row: rows,
        star: icon
      });
    },500);

  });
});

// app.post('/updateLike', (req, res, next) => {
//
//   const { body } = req;
//   const { article_id } = body;
//   console.log(article_id);
//   db.get('SELECT like FROM author_article WHERE id = ' + article_id, (err, result) => {
//     console.log(result);
//     db.get('UPDATE author_article SET like = ' + (result.like + 1) + ' WHERE id = ' + article_id, (err,) => {
//       if (err) {
//         res.send({
//           succees: false,
//           message: "Internal error"
//         })
//       }
//     });
//   });
// })


app.post('/updateLikeTitle', (req, res, next) => {

  const { body } = req;
  const { article_id } = body;
  console.log(article_id);
  db.get('SELECT like_title, actionT FROM author_article WHERE id = ' + article_id, (err, result) => {
    console.log(result);
    let newLikes = result.like_title + 1;
    let newAction = result.actionT + 1;

    // db.get('UPDATE author_article SET actionT = '+ (result.actionT + 1)+'WHERE id = ' + article_id);
    db.get('UPDATE author_article SET ' + 'like_title = ' + (result.like_title + 1) +','+ 'actionT = ' + (result.actionT + 1)+' WHERE id = ' + article_id, (err,) => {
      if (err) {
        res.send({
          succees: false,
          message: "Internal error"
        })

      }
      else {
        res.send({
          newLikes: newLikes,
          newAction: newAction


        });



      }
    });


  });


})

// app.post('/updateUnLikeTitle', (req, res, next) => {
//
//   const { body } = req;
//   const { article_id } = body;
//   console.log(article_id);
//   db.get('SELECT like_title actionT ROM author_article WHERE id = ' + article_id, (err, result) => {
//     console.log(result);
//     let newLikes = result.like_title - 1;
//
//     db.get('UPDATE author_article SET ' + 'like_title = ' + (result.like_title - 1) +','+ 'actionT = ' + (result.actionT - 1)+' WHERE id = ' + article_id, (err,) => {
//       if (err) {
//         res.send({
//           succees: false,
//           message: "Internal error"
//         })
//       }
//       else {
//         res.send({
//           newLikes: newLikes
//         });
//       }
//     });
//
//
//   });
// })



app.post('/updateLikeContent', (req, res, next) => {

  const { body } = req;
  const { article_id } = body;
  console.log(article_id);
  db.get('SELECT like_content FROM author_article WHERE id = ' + article_id, (err, result) => {
    console.log(result);
    let newLikes = result.like_content + 1;
    db.get('UPDATE author_article SET like_content = ' + (result.like_content + 1) + ' WHERE id = ' + article_id, (err,result) => {
      if (err) {
        res.send({
          succees: false,
          message: "Internal error"
        })
      }
      else {
        res.send({
          newLikes: newLikes
        });
      }
    });
  });
})

app.post('/updateLikeLayout', (req, res, next) => {

  const { body } = req;
  const { article_id } = body;
  console.log(article_id);
  db.get('SELECT like_layout FROM author_article WHERE id = ' + article_id, (err, result) => {
    console.log(result);
    let newLikes = result.like_layout + 1;
    db.get('UPDATE author_article SET like_layout = ' + (result.like_layout + 1) + ' WHERE id = ' + article_id, (err,) => {
      if (err) {
        res.send({
          succees: false,
          message: "Internal error"
        })
      }
      else {
        res.send({
          newLikes: newLikes
        });
      }
    });
  });
})


app.post('/sort_by_title',(req, res, next) =>{
  console.log("server sort by title")
  db.all('SELECT * FROM author_article ORDER BY like_title DESC LIMIT 4;', (err, rows) =>{

    if (err) {
      res.send({
        succees: false,
        message: "Internal error"
      })
    }
    else {
      var icon = []
      var saved = "fas fa-star";
      var unsaved = "far fa-star";
      rows.map(article => {
        var t = article.title;
        db.all('SELECT title FROM bookmarks WHERE title=$title',
          {
            $title: t
          },
          (err, rows) => {
            if (rows.length > 0) {
              console.log("exists");
              icon.push("fas fa-star");
            }
            else {
              console.log("nooo");
              icon.push("far fa-star");
            }
          }
        );
      });

      setTimeout(function(){
        console.log("icon");
        console.log(icon);
        res.send({
          row: rows,
          star: icon
        });
      },500);
    }

  });
});

app.post('/expand1_sort_title',(req, res, next) =>{
  console.log("server sort by title expand1")
  db.all('SELECT * FROM author_article ORDER BY like_title DESC LIMIT 8;', (err, rows) =>{

    if (err) {
      res.send({
        succees: false,
        message: "Internal error"
      })
    }
    else {
      var icon = []
      var saved = "fas fa-star";
      var unsaved = "far fa-star";
      rows.map(article => {
        var t = article.title;
        db.all('SELECT title FROM bookmarks WHERE title=$title',
          {
            $title: t
          },
          (err, rows) => {
            if (rows.length > 0) {
              console.log("exists");
              icon.push("fas fa-star");
            }
            else {
              console.log("nooo");
              icon.push("far fa-star");
            }
          }
        );
      });

      setTimeout(function(){
        console.log("icon");
        console.log(icon);
        res.send({
          row: rows,
          star: icon
        });
      },500);
    }

  });
});

app.post('/expand2_sort_title',(req, res, next) =>{
  console.log("server sort by title expand1")
  db.all('SELECT * FROM author_article ORDER BY like_title DESC;', (err, rows) =>{

    if (err) {
      res.send({
        succees: false,
        message: "Internal error"
      })
    }
    else {
      var icon = []
      var saved = "fas fa-star";
      var unsaved = "far fa-star";
      rows.map(article => {
        var t = article.title;
        db.all('SELECT title FROM bookmarks WHERE title=$title',
          {
            $title: t
          },
          (err, rows) => {
            if (rows.length > 0) {
              console.log("exists");
              icon.push("fas fa-star");
            }
            else {
              console.log("nooo");
              icon.push("far fa-star");
            }
          }
        );
      });

      setTimeout(function(){
        console.log("icon");
        console.log(icon);
        res.send({
          row: rows,
          star: icon
        });
      },500);
    }

  });
});


app.post('/sort_by_content',(req, res, next) =>{
  console.log("server sort by content")
  db.all('SELECT * FROM author_article ORDER BY like_content DESC LIMIT 4;', (err, rows) =>{

    if (err) {
      res.send({
        succees: false,
        message: "Internal error"
      })
    }
    else {
      var icon = []
      var saved = "fas fa-star";
      var unsaved = "far fa-star";
      rows.map(article => {
        var t = article.title;
        db.all('SELECT title FROM bookmarks WHERE title=$title',
          {
            $title: t
          },
          (err, rows) => {
            if (rows.length > 0) {
              console.log("exists");
              icon.push("fas fa-star");
            }
            else {
              console.log("nooo");
              icon.push("far fa-star");
            }
          }
        );
      });

      setTimeout(function(){
        console.log("icon");
        console.log(icon);
        res.send({
          row: rows,
          star: icon
        });
      },500);
    }

  });
});

app.post('/expand1_sort_content',(req, res, next) =>{
  console.log("server sort by content expand1")
  db.all('SELECT * FROM author_article ORDER BY like_content DESC LIMIT 8;', (err, rows) =>{

    if (err) {
      res.send({
        succees: false,
        message: "Internal error"
      })
    }
    else {
      var icon = []
      var saved = "fas fa-star";
      var unsaved = "far fa-star";
      rows.map(article => {
        var t = article.title;
        db.all('SELECT title FROM bookmarks WHERE title=$title',
          {
            $title: t
          },
          (err, rows) => {
            if (rows.length > 0) {
              console.log("exists");
              icon.push("fas fa-star");
            }
            else {
              console.log("nooo");
              icon.push("far fa-star");
            }
          }
        );
      });

      setTimeout(function(){
        console.log("icon");
        console.log(icon);
        res.send({
          row: rows,
          star: icon
        });
      },500);
    }

  });
});

app.post('/expand2_sort_content',(req, res, next) =>{
  console.log("server sort by content expand1")
  db.all('SELECT * FROM author_article ORDER BY like_content DESC;', (err, rows) =>{

    if (err) {
      res.send({
        succees: false,
        message: "Internal error"
      })
    }
    else {
      var icon = []
      var saved = "fas fa-star";
      var unsaved = "far fa-star";
      rows.map(article => {
        var t = article.title;
        db.all('SELECT title FROM bookmarks WHERE title=$title',
          {
            $title: t
          },
          (err, rows) => {
            if (rows.length > 0) {
              console.log("exists");
              icon.push("fas fa-star");
            }
            else {
              console.log("nooo");
              icon.push("far fa-star");
            }
          }
        );
      });

      setTimeout(function(){
        console.log("icon");
        console.log(icon);
        res.send({
          row: rows,
          star: icon
        });
      },500);
    }

  });
});


app.post('/sort_by_layout',(req, res, next) =>{
  console.log("server sort by layout")
  db.all('SELECT * FROM author_article ORDER BY like_layout DESC LIMIT 4;', (err, rows) =>{

    if (err) {
      res.send({
        succees: false,
        message: "Internal error"
      })
    }
    else {
      var icon = []
      var saved = "fas fa-star";
      var unsaved = "far fa-star";
      rows.map(article => {
        var t = article.title;
        db.all('SELECT title FROM bookmarks WHERE title=$title',
          {
            $title: t
          },
          (err, rows) => {
            if (rows.length > 0) {
              console.log("exists");
              icon.push("fas fa-star");
            }
            else {
              console.log("nooo");
              icon.push("far fa-star");
            }
          }
        );
      });

      setTimeout(function(){
        console.log("icon");
        console.log(icon);
        res.send({
          row: rows,
          star: icon
        });
      },500);
    }

  });
});

app.post('/expand1_sort_layout',(req, res, next) =>{
  console.log("server sort by layout expand1")
  db.all('SELECT * FROM author_article ORDER BY like_layout DESC LIMIT 8;', (err, rows) =>{

    if (err) {
      res.send({
        succees: false,
        message: "Internal error"
      })
    }
    else {
      var icon = []
      var saved = "fas fa-star";
      var unsaved = "far fa-star";
      rows.map(article => {
        var t = article.title;
        db.all('SELECT title FROM bookmarks WHERE title=$title',
          {
            $title: t
          },
          (err, rows) => {
            if (rows.length > 0) {
              console.log("exists");
              icon.push("fas fa-star");
            }
            else {
              console.log("nooo");
              icon.push("far fa-star");
            }
          }
        );
      });

      setTimeout(function(){
        console.log("icon");
        console.log(icon);
        res.send({
          row: rows,
          star: icon
        });
      },500);
    }

  });
});

app.post('/expand2_sort_layout',(req, res, next) =>{
  console.log("server sort by layout expand1")
  db.all('SELECT * FROM author_article ORDER BY like_layout DESC;', (err, rows) =>{

    if (err) {
      res.send({
        succees: false,
        message: "Internal error"
      })
    }
    else {
      var icon = []
      var saved = "fas fa-star";
      var unsaved = "far fa-star";
      rows.map(article => {
        var t = article.title;
        db.all('SELECT title FROM bookmarks WHERE title=$title',
          {
            $title: t
          },
          (err, rows) => {
            if (rows.length > 0) {
              console.log("exists");
              icon.push("fas fa-star");
            }
            else {
              console.log("nooo");
              icon.push("far fa-star");
            }
          }
        );
      });

      setTimeout(function(){
        console.log("icon");
        console.log(icon);
        res.send({
          row: rows,
          star: icon
        });
      },500);
    }

  });
});

// start the server at URL: http://localhost:3000/
app.listen(3000, () => {
  console.log('Server started at http://localhost:3000/');
});
