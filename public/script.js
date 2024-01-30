$(function() {
    $('#testForm').submit(function(e) {
      $.ajax({
        url: '/api/stock-prices',
        type: 'get',
        data: $('#testForm').serialize(),
        success: function(data) {
          $('#jsonResult').html(`<code>${JSON.stringify(data)}</code>`);
        }
      });
      e.preventDefault();
    });
    $('#testForm2').submit(function(e) {
      $.ajax({
        url: '/api/stock-prices',
        type: 'get',
        data: $('#testForm2').serialize(),
        success: function(data) {
          $('#jsonResult').html(`<code>${JSON.stringify(data)}</code>`);
        }
      });
      e.preventDefault();
    });
  });