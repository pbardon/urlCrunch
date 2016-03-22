$(document).ready(function(){
    $('#submitUrl').click(function() {
        var url = $('input')[0].value;
        if (!validUrl(url)){
            return $('#appContent').html(function() {
                var link = window.location.href;
                return '<h4>There was a problem generating your shortened url, try again:</h4><br><a href="' + link +'">Back to Homepage</a>';
            });
        }
        var request = $.ajax({
              method: 'POST',
              url: '/link',
              dataType: 'json',
              contentType: 'application-json',
              data: { url: url },
              success: function(data) {
                  var obj = data;
                  $('#appContent').html(function() {
                      var link = window.location.href + 'link/'+ obj._id;
                      return '<h4>Your shortened url is: <a href="' + link +'" >' +link +'</a></h4>';
                  });
              },
              error: function(err){
                  $('#appContent').html(function() {
                      var link = window.location.href;
                      return '<h4>There was a problem generating your shortened url, try again:</h4><br><a href="' + link +'">Back to Homepage</a>';
                  });

              }
        });
    });
});

function validUrl(url) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator)
    if(!pattern.test(url)) {
        return false;
    } else {
        return true;
    }
}
