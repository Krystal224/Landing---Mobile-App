// jQuery convention for running when the document has been fully loaded:
$(document).ready(() => {
  $.ajax({
    url: 'trends/',
    type: 'GET',
    dataType: 'json',
    success: (data) => {
      data = data.map((data, i) => {
        const tag = $("<button class=\"trend-data\" name=\"" + data + "\" id= " + "trend" + i + ">" + data + "</button>");
        tag.appendTo('#trends');

      });
    }
  });


  $('body').on('click', '.trend-data', function (e) {
    $('#news').empty();
    e.preventDefault();
    const target = this.id;
    const name = this.name;
    const requestURL = 'trends/' + name;
    $.ajax({
      url: requestURL,
      type: 'GET',
      dataType: 'json',
      success: (data) => {
        console.log("sucesssssssssssss");
        data = data.map((data, i) => {
          const news = $("<h2>" + data.title + "</h2><a href=" + data.url + ">" + data.url + "</a><p>" + data.snippet + "</p>");          
          news.appendTo('#news');
        })
      }
    });
    // $(location).attr('href', requestURL);
  });



});
