// jQuery convention for running when the document has been fully loaded:
$(document).ready(() => {

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
