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
      })
    }
  });
  $.ajax({
    url: 'news/',
    type: 'GET',
    dataType: 'json',
    success: (data) => {
      data = data.map((data, i) => {
        console.log(data);
        $('#news').html(data);
      })
    }
  });
  $('body').on('click', '.trend-data', function (e) {
    e.preventDefault();
    const target = this.id;
    const name = this.name;
    console.log(name);
    const requestURL = 'trends.html';
    $(location).attr('href', requestURL);
  });


});
