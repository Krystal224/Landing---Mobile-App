/**This method is used in**/
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
