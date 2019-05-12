// jQuery convention for running when the document has been fully loaded:
$(document).ready(() => {

  $('body').on('click', '.trend-data', function (e) {
    console.log("clickkkkkked");
    $('#news').empty();
    e.preventDefault();
    const name = this.name;
    console.log(name);
    const requestURL = 'trends/' + name;
    // $.ajax({
    //   url: requestURL,
    //   type: 'GET',
    //   dataType: 'json',
    //   success: (data) => {
    //     console.log("sucesssssssssssss");
    //     data = data.map((data, i) => {
    //       const news = $("<h2>" + data.title + "</h2><a href=" + data.url + ">" + data.url + "</a><p>" + data.snippet + "</p>");
    //       news.appendTo('#news');
    //     })
    //   }
    // });
    $(location).attr('href', requestURL);
  });

});
