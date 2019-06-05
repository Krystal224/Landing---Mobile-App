/**This file contains all the functions used in home.handlebars.
  It makes ajax call to fetch data from sqlite database and also save user input
  (such as vote for liking content) to database.
**/
$(document).ready(() => {
  $.ajax('/fetchData', {
    method: 'get'
  })
  .then(
    function success(json) {
      console.log("requesting to fetch data!");
      console.log("success");
      console.log(json.row);
      let rows = json.row;
      $.each(rows, function(i, item) {
        let icon = json.star;
        console.log("iconnn");
        console.log(icon[i]);
        let titleLike = 'title' + i;
        let contentLike = 'content' + i;
        let layoutLike = 'layout' + i;
        let hidetitle = rows[i].title;

        $(".all_articles").append('<div id="' + rows[i].id + '" class="article'+ i +' art"></div>');
        $("<button class=add_article id=" + i + " name=\"" + rows[i].title + "\" value=\"" + rows[i].link + "\"><i id=icon" + i + " class=\"" + icon[i] + "\"></i></button>" ).appendTo( '.article' + i);
        $('<div id=myModal' + i + ' class="hidden"><a href="/source"><u id=mark' + i + '>Bookmarked!</u></a></div>').appendTo('.article' + i);
        $('<a href="' + rows[i].link + '">'+rows[i].title+'</a>').appendTo( '.article' + i);
        $("<p>" + rows[i].author + '&nbsp&nbsp&nbsp&nbsp&nbsp' + rows[i].reading_time +' min read '+'&nbsp&nbsp&nbsp&nbsp&nbsp'+rows[i].claps+ '&nbsp'+ 'claps'+ "</p>").appendTo( '.article' + i);
        $('<button class = "btneach btntitle" id = ' + titleLike + ' onclick="updateLikeTitle(' + rows[i].id + ')">Title  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+rows[i].like_title +'</button>' ).appendTo( '.article' + i);
        $('<button class = "btneach btncontent" id = ' + contentLike + ' onclick="updateLikeContent(' + rows[i].id + ')">Content  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+ rows[i].like_content +'</button>' ).appendTo( '.article' + i);
        $('<button class = "btneach btnlayout" id = ' + layoutLike + ' onclick="updateLikeLayout(' + rows[i].id + ')">Layout  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+rows[i].like_layout +'</button>' ).appendTo( '.article' + i);

      })

      $('<button class = "expandbtn" onclick="expand1()"><i class="fas fa-chevron-down"></i><p> View More</p></button>').appendTo('.all_articles');

    },
    function fail(data, status) {
      console.log("fail");
      console.log(data);
      alert('Request failed.  Returned status of ' + status);
    }
  );

  $.ajax('/fetchArticle', {
    method: 'get'
  })
  .then(
    function success(json) {
      console.log("requesting to fetch Article starts!");
      console.log(json);

        $('<a href="' + json[0].link + '">'+json[0].title+'</a>'+'<br>').appendTo('.daily_push');
        $('<a style="font-size:15px;color:grey">' + json[0].author + "</a>").appendTo('.daily_push');//append author and reading time

        $('<a href="' + json[2].link + '">'+json[2].title+'</a>'+'<br>').appendTo('.daily_push1');
        $('<a style="font-size:15px;color:grey">' + json[2].author + "</a>").appendTo('.daily_push1');//append author and reading time



    },
    function fail(data, status) {
      console.log("fail");
      console.log(data);
      alert('Request failed.  Returned status of ' + status);
    }
  );


  $.ajax({
  url: '/latest_reading',
  method: 'get'
  })

  .then(
    function success(json) {
      console.log("requesting to latest!");
      console.log(json);
      let average = 0;
      $.each(json, function(i, item) {

        average = json[i].reading_time + average;


      })

      let final = average/40;
      console.log(final);
      $('#latest_reading').html(final);



    },

    function fail(data, status) {
      console.log("fail");
      console.log(data);
      alert('Request failed.  Returned status of ' + status);
    }
  );

  $('body').on('click', '.trend-data', function (e) {
    console.log("clickkkkkked");
    $('#news').empty();
    e.preventDefault();
    const name = this.name;
    console.log(name);
    const requestURL = 'trends/' + name;
    $(location).attr('href', requestURL);
  });
});

$('body').on('click', '.add_article', function (e) {
  console.log("clititlekkked");
  e.preventDefault();
  var title = this.name;
  var link = this.value;
  var id = this.id;
  console.log(id);

  $.ajax({
    // all URLs are relative to http://localhost:3000/
    url: '/bookmarks',
    type: 'POST', // <-- this is POST, not GET
    data: {
            title: title,
            link: link
          },
    success: (data) => {
      let modal = '#myModal' + id;
      let icon = '#icon' + id;
      $(icon).removeClass("far fa-star");
      $(icon).addClass("fas fa-star");
      console.log($('#myModal').attr("class"));
      $(modal).removeClass("hidden");
      $(modal).addClass("show_home");
      setTimeout(function() {
        $(modal).removeClass("show_home");
        $(modal).addClass("hidden");
      }, 2000);
    }
  });
});

$('body').on('mouseover', '.trend-data', function() {
  const id = this.id;
  $('#' + id).addClass("trend_animation");
});

$('body').on('mouseleave', '.trend-data', function() {
  const id = this.id;
  $('#' + id).removeClass("trend_animation");
});



updateLikeTitle = (id) => {
console.log("function called")
$.ajax({
  url: '/updateLikeTitle',
  type: 'POST',
  dataType : 'json',

  data: {
    article_id: id
  },
  success: (data) => {

    let pass = '#title' + id;
    $(pass).html('Title  ' +'<i class="fas fa-thumbs-up"></i>'+'&nbsp'+ data.newLikes);

    console.log("successfully reload idex.html")

  }
});
}


updateLikeContent = (id) => {
$.ajax({
  url: '/updateLikeContent',
  type: 'POST',
  dataType : 'json',

  data: {
    article_id: id
  },
  success: (data) => {

    let pass = '#content' + id;
    $(pass).html('Content  ' +'<i class="fas fa-thumbs-up"></i>'+'&nbsp'+ data.newLikes);

    console.log("successfully reload idex.html")

  }
});
}

updateLikeLayout = (id) => {
$.ajax({
  url: '/updateLikeLayout',
  type: 'POST',
  dataType : 'json',

  data: {
    article_id: id
  },
  success: (data) => {


    let pass = '#layout' + id;
    $(pass).html('Layout  ' + '<i class="fas fa-thumbs-up"></i>'+'&nbsp'+data.newLikes);

    console.log("successfully reload idex.html")

  }
});
}



sort_title = () => {

$.ajax({
  url: '/sort_by_title',
  type: 'POST',

})
.then(
  function success(json) {
    console.log("success0");
    console.log(json);
    $('.all_articles').empty();
    console.log(json.row);
    let rows = json.row;
    $.each(rows, function(i, item) {

      let icon = json.star;
      console.log("iconnn");
      console.log(icon[i]);
      let titleLike = 'title' + i;
      let contentLike = 'content' + i;
      let layoutLike = 'layout' + i;
      let hidetitle = rows[i].title;

      $(".all_articles").append('<div id="' + rows[i].id + '" class="article'+ i +' art"></div>');
      $("<button class=add_article id=" + i + " name=\"" + rows[i].title + "\" value=\"" + rows[i].link + "\"><i id=icon" + i + " class=\"" + icon[i] + "\"></i></button>" ).appendTo( '.article' + i);
      $('<div id=myModal' + i + ' class="hidden"><a href="/source"><u id=mark' + i + '>Bookmarked!</u></a></div>').appendTo('.article' + i);
      $('<a href="' + rows[i].link + '">'+rows[i].title+'</a>').appendTo( '.article' + i);
      $("<p>" + rows[i].author + '&nbsp&nbsp&nbsp&nbsp&nbsp' + rows[i].reading_time +' min read '+'&nbsp&nbsp&nbsp&nbsp&nbsp'+rows[i].claps+ '&nbsp'+ 'claps'+ "</p>").appendTo( '.article' + i);
      $('<button class = "btneach btntitle" id = ' + titleLike + ' onclick="updateLikeTitle(' + rows[i].id + ')">Title  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+rows[i].like_title +'</button>' ).appendTo( '.article' + i);
      $('<button class = "btneach btncontent" id = ' + contentLike + ' onclick="updateLikeContent(' + rows[i].id + ')">Content  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+ rows[i].like_content +'</button>' ).appendTo( '.article' + i);
      $('<button class = "btneach btnlayout" id = ' + layoutLike + ' onclick="updateLikeLayout(' + rows[i].id + ')">Layout  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+rows[i].like_layout +'</button>' ).appendTo( '.article' + i);

    })
    $('<button class = "expandbtn" onclick="expand1_sort_title()"><i class="fas fa-chevron-down"></i><p>View More</p></button>').appendTo('.all_articles');

  },


  function fail(data, status) {
    console.log("fail");
    console.log(data);
    alert('Request failed.  Returned status of ' + status);
  }
);

}

sort_content = () => {

$.ajax({
  url: '/sort_by_content',
  type: 'POST',

})
.then(
  function success(json) {
    console.log("success0");
    console.log(json);
    $('.all_articles').empty();
    console.log(json.row);
    let rows = json.row;
    $.each(rows, function(i, item) {

      let icon = json.star;
      console.log("iconnn");
      console.log(icon[i]);
      let titleLike = 'title' + i;
      let contentLike = 'content' + i;
      let layoutLike = 'layout' + i;
      let hidetitle = rows[i].title;

      $(".all_articles").append('<div id="' + rows[i].id + '" class="article'+ i +' art"></div>');
      $("<button class=add_article id=" + i + " name=\"" + rows[i].title + "\" value=\"" + rows[i].link + "\"><i id=icon" + i + " class=\"" + icon[i] + "\"></i></button>" ).appendTo( '.article' + i);
      $('<div id=myModal' + i + ' class="hidden"><a href="/source"><u id=mark' + i + '>Bookmarked!</u></a></div>').appendTo('.article' + i);
      $('<a href="' + rows[i].link + '">'+rows[i].title+'</a>').appendTo( '.article' + i);
      $("<p>" + rows[i].author + '&nbsp&nbsp&nbsp&nbsp&nbsp' + rows[i].reading_time +' min read '+'&nbsp&nbsp&nbsp&nbsp&nbsp'+rows[i].claps+ '&nbsp'+ 'claps'+ "</p>").appendTo( '.article' + i);
      $('<button class = "btneach btntitle" id = ' + titleLike + ' onclick="updateLikeTitle(' + rows[i].id + ')">Title  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+rows[i].like_title +'</button>' ).appendTo( '.article' + i);
      $('<button class = "btneach btncontent" id = ' + contentLike + ' onclick="updateLikeContent(' + rows[i].id + ')">Content  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+ rows[i].like_content +'</button>' ).appendTo( '.article' + i);
      $('<button class = "btneach btnlayout" id = ' + layoutLike + ' onclick="updateLikeLayout(' + rows[i].id + ')">Layout  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+rows[i].like_layout +'</button>' ).appendTo( '.article' + i);

    })
    $('<button class = "expandbtn" onclick="expand1_sort_content()"><i class="fas fa-chevron-down"></i><p>View More</p></button>').appendTo('.all_articles');

  },


  function fail(data, status) {
    console.log("fail");
    console.log(data);
    alert('Request failed.  Returned status of ' + status);
  }
);


}


sort_layout = () => {

$.ajax({
  url: '/sort_by_layout',
  type: 'POST',

})
.then(
  function success(json) {
    console.log("success0");
    console.log(json);
    $('.all_articles').empty();
    console.log(json.row);
    let rows = json.row;
    $.each(rows, function(i, item) {

      let icon = json.star;
      console.log("iconnn");
      console.log(icon[i]);
      let titleLike = 'title' + i;
      let contentLike = 'content' + i;
      let layoutLike = 'layout' + i;
      let hidetitle = rows[i].title;
      $(".all_articles").append('<div id="' + rows[i].id + '" class="article'+ i +' art"></div>');
      $("<button class=add_article id=" + i + " name=\"" + rows[i].title + "\" value=\"" + rows[i].link + "\"><i id=icon" + i + " class=\"" + icon[i] + "\"></i></button>" ).appendTo( '.article' + i);
      $('<div id=myModal' + i + ' class="hidden"><a href="/source"><u id=mark' + i + '>Bookmarked!</u></a></div>').appendTo('.article' + i);
      $('<a href="' + rows[i].link + '">'+rows[i].title+'</a>').appendTo( '.article' + i);
      $("<p>" + rows[i].author + '&nbsp&nbsp&nbsp&nbsp&nbsp' + rows[i].reading_time +' min read '+'&nbsp&nbsp&nbsp&nbsp&nbsp'+rows[i].claps+ '&nbsp'+ 'claps'+ "</p>").appendTo( '.article' + i);
      $('<button class = "btneach btntitle" id = ' + titleLike + ' onclick="updateLikeTitle(' + rows[i].id + ')">Title  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+rows[i].like_title +'</button>' ).appendTo( '.article' + i);
      $('<button class = "btneach btncontent" id = ' + contentLike + ' onclick="updateLikeContent(' + rows[i].id + ')">Content  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+ rows[i].like_content +'</button>' ).appendTo( '.article' + i);
      $('<button class = "btneach btnlayout" id = ' + layoutLike + ' onclick="updateLikeLayout(' + rows[i].id + ')">Layout  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+rows[i].like_layout +'</button>' ).appendTo( '.article' + i);

    })

    $('<button class = "expandbtn" onclick="expand1_sort_layout()"><i class="fas fa-chevron-down"></i><p>View More</p></button>').appendTo('.all_articles');

  },


  function fail(data, status) {
    console.log("fail");
    console.log(data);
    alert('Request failed.  Returned status of ' + status);
  }
);


}

expand1 = () => {

$.ajax({
  url: '/expand1',
  type: 'POST',

})
.then(
  function success(json) {
    console.log("expand1 starts");
    console.log(json);
    $('.all_articles').empty();
    console.log(json.row);
    let rows = json.row;
    $.each(rows, function(i, item) {

      let icon = json.star;
      console.log("iconnn");
      console.log(icon[i]);
      let titleLike = 'title' + i;
      let contentLike = 'content' + i;
      let layoutLike = 'layout' + i;
      let hidetitle = rows[i].title;

      $(".all_articles").append('<div id="' + rows[i].id + '" class="article'+ i +' art"></div>');
      $("<button class=add_article id=" + i + " name=\"" + rows[i].title + "\" value=\"" + rows[i].link + "\"><i id=icon" + i + " class=\"" + icon[i] + "\"></i></button>" ).appendTo( '.article' + i);
      $('<div id=myModal' + i + ' class="hidden"><a href="/source"><u id=mark' + i + '>Bookmarked!</u></a></div>').appendTo('.article' + i);
      $('<a href="' + rows[i].link + '">'+rows[i].title+'</a>').appendTo( '.article' + i);
      $("<p>" + rows[i].author + '&nbsp&nbsp&nbsp&nbsp&nbsp' + rows[i].reading_time +' min read '+'&nbsp&nbsp&nbsp&nbsp&nbsp'+rows[i].claps+ '&nbsp'+ 'claps'+ "</p>").appendTo( '.article' + i);
      $('<button class = "btneach btntitle" id = ' + titleLike + ' onclick="updateLikeTitle(' + rows[i].id + ')">Title  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+rows[i].like_title +'</button>' ).appendTo( '.article' + i);
      $('<button class = "btneach btncontent" id = ' + contentLike + ' onclick="updateLikeContent(' + rows[i].id + ')">Content  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+ rows[i].like_content +'</button>' ).appendTo( '.article' + i);
      $('<button class = "btneach btnlayout" id = ' + layoutLike + ' onclick="updateLikeLayout(' + rows[i].id + ')">Layout  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+rows[i].like_layout +'</button>' ).appendTo( '.article' + i);

    })

    $('<button class = "expandbtn" onclick="expand2()"><i class="fas fa-chevron-down"></i><p>ALL</p></button>').appendTo('.all_articles');

  },


  function fail(data, status) {
    console.log("fail");
    console.log(data);
    alert('Expand Request failed.  Returned status of ' + status);
  }
);


}

expand1_sort_title = () => {

$.ajax({
  url: '/expand1_sort_title',
  type: 'POST',

})
.then(
  function success(json) {
    console.log("expand1 title starts");
    console.log(json);
    $('.all_articles').empty();
    console.log(json.row);
    let rows = json.row;
    $.each(rows, function(i, item) {

      let icon = json.star;
      console.log("iconnn");
      console.log(icon[i]);
      let titleLike = 'title' + i;
      let contentLike = 'content' + i;
      let layoutLike = 'layout' + i;
      let hidetitle = rows[i].title;

      $(".all_articles").append('<div id="' + rows[i].id + '" class="article'+ i +' art"></div>');
      $("<button class=add_article id=" + i + " name=\"" + rows[i].title + "\" value=\"" + rows[i].link + "\"><i id=icon" + i + " class=\"" + icon[i] + "\"></i></button>" ).appendTo( '.article' + i);
      $('<div id=myModal' + i + ' class="hidden"><a href="/source"><u id=mark' + i + '>Bookmarked!</u></a></div>').appendTo('.article' + i);
      $('<a href="' + rows[i].link + '">'+rows[i].title+'</a>').appendTo( '.article' + i);
      $("<p>" + rows[i].author + '&nbsp&nbsp&nbsp&nbsp&nbsp' + rows[i].reading_time +' min read '+'&nbsp&nbsp&nbsp&nbsp&nbsp'+rows[i].claps+ '&nbsp'+ 'claps'+ "</p>").appendTo( '.article' + i);
      $('<button class = "btneach btntitle" id = ' + titleLike + ' onclick="updateLikeTitle(' + rows[i].id + ')">Title  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+rows[i].like_title +'</button>' ).appendTo( '.article' + i);
      $('<button class = "btneach btncontent" id = ' + contentLike + ' onclick="updateLikeContent(' + rows[i].id + ')">Content  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+ rows[i].like_content +'</button>' ).appendTo( '.article' + i);
      $('<button class = "btneach btnlayout" id = ' + layoutLike + ' onclick="updateLikeLayout(' + rows[i].id + ')">Layout  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+rows[i].like_layout +'</button>' ).appendTo( '.article' + i);

    })

    $('<button class = "expandbtn" onclick="expand2_sort_title()"><i class="fas fa-chevron-down"></i><p>ALL</p></button>').appendTo('.all_articles');

  },


  function fail(data, status) {
    console.log("fail");
    console.log(data);
    alert('Expand Request failed.  Returned status of ' + status);
  }
);


}

expand2_sort_title = () => {

$.ajax({
  url: '/expand2_sort_title',
  type: 'POST',

})
.then(
  function success(json) {
    console.log("expand2 title starts");
    console.log(json);
    $('.all_articles').empty();
    console.log(json.row);
    let rows = json.row;
    $.each(rows, function(i, item) {

      let icon = json.star;
      console.log("iconnn");
      console.log(icon[i]);
      let titleLike = 'title' + i;
      let contentLike = 'content' + i;
      let layoutLike = 'layout' + i;
      let hidetitle = rows[i].title;

      $(".all_articles").append('<div id="' + rows[i].id + '" class="article'+ i +' art"></div>');
      $("<button class=add_article id=" + i + " name=\"" + rows[i].title + "\" value=\"" + rows[i].link + "\"><i id=icon" + i + " class=\"" + icon[i] + "\"></i></button>" ).appendTo( '.article' + i);
      $('<div id=myModal' + i + ' class="hidden"><a href="/source"><u id=mark' + i + '>Bookmarked!</u></a></div>').appendTo('.article' + i);
      $('<a href="' + rows[i].link + '">'+rows[i].title+'</a>').appendTo( '.article' + i);
      $("<p>" + rows[i].author + '&nbsp&nbsp&nbsp&nbsp&nbsp' + rows[i].reading_time +' min read '+'&nbsp&nbsp&nbsp&nbsp&nbsp'+rows[i].claps+ '&nbsp'+ 'claps'+ "</p>").appendTo( '.article' + i);
      $('<button class = "btneach btntitle" id = ' + titleLike + ' onclick="updateLikeTitle(' + rows[i].id + ')">Title  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+rows[i].like_title +'</button>' ).appendTo( '.article' + i);
      $('<button class = "btneach btncontent" id = ' + contentLike + ' onclick="updateLikeContent(' + rows[i].id + ')">Content  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+ rows[i].like_content +'</button>' ).appendTo( '.article' + i);
      $('<button class = "btneach btnlayout" id = ' + layoutLike + ' onclick="updateLikeLayout(' + rows[i].id + ')">Layout  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+rows[i].like_layout +'</button>' ).appendTo( '.article' + i);

    })



  },


  function fail(data, status) {
    console.log("fail");
    console.log(data);
    alert('Expand Request failed.  Returned status of ' + status);
  }
);


}


expand1_sort_content = () => {

$.ajax({
  url: '/expand1_sort_content',
  type: 'POST',

})
.then(
  function success(json) {
    console.log("expand1 content starts");
    console.log(json);
    $('.all_articles').empty();
    console.log(json.row);
    let rows = json.row;
    $.each(rows, function(i, item) {

      let icon = json.star;
      console.log("iconnn");
      console.log(icon[i]);
      let titleLike = 'title' + i;
      let contentLike = 'content' + i;
      let layoutLike = 'layout' + i;
      let hidetitle = rows[i].title;

      $(".all_articles").append('<div id="' + rows[i].id + '" class="article'+ i +' art"></div>');
      $("<button class=add_article id=" + i + " name=\"" + rows[i].title + "\" value=\"" + rows[i].link + "\"><i id=icon" + i + " class=\"" + icon[i] + "\"></i></button>" ).appendTo( '.article' + i);
      $('<div id=myModal' + i + ' class="hidden"><a href="/source"><u id=mark' + i + '>Bookmarked!</u></a></div>').appendTo('.article' + i);
      $('<a href="' + rows[i].link + '">'+rows[i].title+'</a>').appendTo( '.article' + i);
      $("<p>" + rows[i].author + '&nbsp&nbsp&nbsp&nbsp&nbsp' + rows[i].reading_time +' min read '+'&nbsp&nbsp&nbsp&nbsp&nbsp'+rows[i].claps+ '&nbsp'+ 'claps'+ "</p>").appendTo( '.article' + i);
      $('<button class = "btneach btntitle" id = ' + titleLike + ' onclick="updateLikeTitle(' + rows[i].id + ')">Title  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+rows[i].like_title +'</button>' ).appendTo( '.article' + i);
      $('<button class = "btneach btncontent" id = ' + contentLike + ' onclick="updateLikeContent(' + rows[i].id + ')">Content  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+ rows[i].like_content +'</button>' ).appendTo( '.article' + i);
      $('<button class = "btneach btnlayout" id = ' + layoutLike + ' onclick="updateLikeLayout(' + rows[i].id + ')">Layout  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+rows[i].like_layout +'</button>' ).appendTo( '.article' + i);
    })

    $('<button class = "expandbtn" onclick="expand2_sort_content()"><i class="fas fa-chevron-down"></i><p>ALL</p></button>').appendTo('.all_articles');

  },


  function fail(data, status) {
    console.log("fail");
    console.log(data);
    alert('Expand Request failed.  Returned status of ' + status);
  }
);


}

expand2_sort_content = () => {

$.ajax({
  url: '/expand2_sort_content',
  type: 'POST',

})
.then(
  function success(json) {
    console.log("expand1 content starts");
    console.log(json);
    $('.all_articles').empty();
    console.log(json.row);
    let rows = json.row;
    $.each(rows, function(i, item) {

      let icon = json.star;
      console.log("iconnn");
      console.log(icon[i]);
      let titleLike = 'title' + i;
      let contentLike = 'content' + i;
      let layoutLike = 'layout' + i;
      let hidetitle = rows[i].title;

      $(".all_articles").append('<div id="' + rows[i].id + '" class="article'+ i +' art"></div>');
      $("<button class=add_article id=" + i + " name=\"" + rows[i].title + "\" value=\"" + rows[i].link + "\"><i id=icon" + i + " class=\"" + icon[i] + "\"></i></button>" ).appendTo( '.article' + i);
      $('<div id=myModal' + i + ' class="hidden"><a href="/source"><u id=mark' + i + '>Bookmarked!</u></a></div>').appendTo('.article' + i);
      $('<a href="' + rows[i].link + '">'+rows[i].title+'</a>').appendTo( '.article' + i);
      $("<p>" + rows[i].author + '&nbsp&nbsp&nbsp&nbsp&nbsp' + rows[i].reading_time +' min read '+'&nbsp&nbsp&nbsp&nbsp&nbsp'+rows[i].claps+ '&nbsp'+ 'claps'+ "</p>").appendTo( '.article' + i);
      $('<button class = "btneach btntitle" id = ' + titleLike + ' onclick="updateLikeTitle(' + rows[i].id + ')">Title  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+rows[i].like_title +'</button>' ).appendTo( '.article' + i);
      $('<button class = "btneach btncontent" id = ' + contentLike + ' onclick="updateLikeContent(' + rows[i].id + ')">Content  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+ rows[i].like_content +'</button>' ).appendTo( '.article' + i);
      $('<button class = "btneach btnlayout" id = ' + layoutLike + ' onclick="updateLikeLayout(' + rows[i].id + ')">Layout  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+rows[i].like_layout +'</button>' ).appendTo( '.article' + i);

    })


  },


  function fail(data, status) {
    console.log("fail");
    console.log(data);
    alert('Expand Request failed.  Returned status of ' + status);
  }
);


}



expand1_sort_layout = () => {

$.ajax({
  url: '/expand1_sort_layout',
  type: 'POST',

})
.then(
  function success(json) {
    console.log("expand1 layout starts");
    console.log(json);
    $('.all_articles').empty();
    console.log(json.row);
    let rows = json.row;
    $.each(rows, function(i, item) {

      let icon = json.star;
      console.log("iconnn");
      console.log(icon[i]);
      let titleLike = 'title' + i;
      let contentLike = 'content' + i;
      let layoutLike = 'layout' + i;
      let hidetitle = rows[i].title;

      $(".all_articles").append('<div id="' + rows[i].id + '" class="article'+ i +' art"></div>');
      $("<button class=add_article id=" + i + " name=\"" + rows[i].title + "\" value=\"" + rows[i].link + "\"><i id=icon" + i + " class=\"" + icon[i] + "\"></i></button>" ).appendTo( '.article' + i);
      $('<div id=myModal' + i + ' class="hidden"><a href="/source"><u id=mark' + i + '>Bookmarked!</u></a></div>').appendTo('.article' + i);
      $('<a href="' + rows[i].link + '">'+rows[i].title+'</a>').appendTo( '.article' + i);
      $("<p>" + rows[i].author + '&nbsp&nbsp&nbsp&nbsp&nbsp' + rows[i].reading_time +' min read '+'&nbsp&nbsp&nbsp&nbsp&nbsp'+rows[i].claps+ '&nbsp'+ 'claps'+ "</p>").appendTo( '.article' + i);
      $('<button class = "btneach btntitle" id = ' + titleLike + ' onclick="updateLikeTitle(' + rows[i].id + ')">Title  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+rows[i].like_title +'</button>' ).appendTo( '.article' + i);
      $('<button class = "btneach btncontent" id = ' + contentLike + ' onclick="updateLikeContent(' + rows[i].id + ')">Content  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+ rows[i].like_content +'</button>' ).appendTo( '.article' + i);
      $('<button class = "btneach btnlayout" id = ' + layoutLike + ' onclick="updateLikeLayout(' + rows[i].id + ')">Layout  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+rows[i].like_layout +'</button>' ).appendTo( '.article' + i);

    })

    $('<button class = "expandbtn" onclick="expand2_sort_layout()"><i class="fas fa-chevron-down"></i><p>ALL</p></button>').appendTo('.all_articles');

  },


  function fail(data, status) {
    console.log("fail");
    console.log(data);
    alert('Expand Request failed.  Returned status of ' + status);
  }
);


}

expand2_sort_layout = () => {

$.ajax({
  url: '/expand2_sort_layout',
  type: 'POST',

})
.then(
  function success(json) {
    console.log("expand1 layout starts");
    console.log(json);
    $('.all_articles').empty();
    console.log(json.row);
    let rows = json.row;
    $.each(rows, function(i, item) {

      let icon = json.star;
      console.log("iconnn");
      console.log(icon[i]);
      let titleLike = 'title' + i;
      let contentLike = 'content' + i;
      let layoutLike = 'layout' + i;
      let hidetitle = rows[i].title;

      $(".all_articles").append('<div id="' + rows[i].id + '" class="article'+ i +' art"></div>');
      $("<button class=add_article id=" + i + " name=\"" + rows[i].title + "\" value=\"" + rows[i].link + "\"><i id=icon" + i + " class=\"" + icon[i] + "\"></i></button>" ).appendTo( '.article' + i);
      $('<div id=myModal' + i + ' class="hidden"><a href="/source"><u id=mark' + i + '>Bookmarked!</u></a></div>').appendTo('.article' + i);
      $('<a href="' + rows[i].link + '">'+rows[i].title+'</a>').appendTo( '.article' + i);
      $("<p>" + rows[i].author + '&nbsp&nbsp&nbsp&nbsp&nbsp' + rows[i].reading_time +' min read '+'&nbsp&nbsp&nbsp&nbsp&nbsp'+rows[i].claps+ '&nbsp'+ 'claps'+ "</p>").appendTo( '.article' + i);
      $('<button class = "btneach btntitle" id = ' + titleLike + ' onclick="updateLikeTitle(' + rows[i].id + ')">Title  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+rows[i].like_title +'</button>' ).appendTo( '.article' + i);
      $('<button class = "btneach btncontent" id = ' + contentLike + ' onclick="updateLikeContent(' + rows[i].id + ')">Content  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+ rows[i].like_content +'</button>' ).appendTo( '.article' + i);
      $('<button class = "btneach btnlayout" id = ' + layoutLike + ' onclick="updateLikeLayout(' + rows[i].id + ')">Layout  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+rows[i].like_layout +'</button>' ).appendTo( '.article' + i);

    })


  },


  function fail(data, status) {
    console.log("fail");
    console.log(data);
    alert('Expand Request failed.  Returned status of ' + status);
  }
);


}



expand2 = () => {

$.ajax({
  url: '/expand2',
  type: 'POST',

})
.then(
  function success(json) {
    console.log("expand2 starts");
    console.log(json);
    $('.all_articles').empty();
    console.log(json.row);
    let rows = json.row;
    $.each(rows, function(i, item) {

      let icon = json.star;
      console.log("iconnn");
      console.log(icon[i]);
      let titleLike = 'title' + i;
      let contentLike = 'content' + i;
      let layoutLike = 'layout' + i;
      let hidetitle = rows[i].title;

      $(".all_articles").append('<div id="' + rows[i].id + '" class="article'+ i +' art"></div>');
      $("<button class=add_article id=" + i + " name=\"" + rows[i].title + "\" value=\"" + rows[i].link + "\"><i id=icon" + i + " class=\"" + icon[i] + "\"></i></button>" ).appendTo( '.article' + i);
      $('<div id=myModal' + i + ' class="hidden"><a href="/source"><u id=mark' + i + '>Bookmarked!</u></a></div>').appendTo('.article' + i);
      $('<a href="' + rows[i].link + '">'+rows[i].title+'</a>').appendTo( '.article' + i);
      $("<p>" + rows[i].author + '&nbsp&nbsp&nbsp&nbsp&nbsp' + rows[i].reading_time +' min read '+'&nbsp&nbsp&nbsp&nbsp&nbsp'+rows[i].claps+ '&nbsp'+ 'claps'+ "</p>").appendTo( '.article' + i);
      $('<button class = "btneach btntitle" id = ' + titleLike + ' onclick="updateLikeTitle(' + rows[i].id + ')">Title  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+rows[i].like_title +'</button>' ).appendTo( '.article' + i);
      $('<button class = "btneach btncontent" id = ' + contentLike + ' onclick="updateLikeContent(' + rows[i].id + ')">Content  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+ rows[i].like_content +'</button>' ).appendTo( '.article' + i);
      $('<button class = "btneach btnlayout" id = ' + layoutLike + ' onclick="updateLikeLayout(' + rows[i].id + ')">Layout  '+ '<i class="far fa-thumbs-up"></i>'+'&nbsp'+rows[i].like_layout +'</button>' ).appendTo( '.article' + i);

    })

  },


  function fail(data, status) {
    console.log("fail");
    console.log(data);
    alert('Expand Request failed.  Returned status of ' + status);
  }
);


}

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
  document.getElementById("myBtn").style.display = "block";
} else {
  document.getElementById("myBtn").style.display = "none";
}
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
document.body.scrollTop = 0;
document.documentElement.scrollTop = 0;
}
