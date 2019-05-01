// jQuery convention for running when the document has been fully loaded:
$(document).ready(() => {
  $('button').click (e => {
    e.preventDefault();
    const target = this.id;
    console.log(target);
    $(location).attr('href', "skill.html");
  });

  $.ajax({
    url: 'writing/',
    type: 'GET',
    dataType: 'json',
    success: (data) => {
      data = data.map((data, i) => {
        const title = $("<a class=\"writing-data\" name=\"" + data + "\" id= " + "title" + i + ">" + data + "</a></br>");
        title.appendTo('#titles');
      });
      console.log(data);
      // data.appendTo('#titles');

    }
  });

  $('body').on('click', '.writing-data', function (e) {
    e.preventDefault();
    const target = this.id;
    const name = this.name;
    console.log(name);
    const requestURL = 'articles.html';
    $(location).attr('href', requestURL);
  });
});
