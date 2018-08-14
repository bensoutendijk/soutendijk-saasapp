/* global $, Stripe */
//Document ready.
$(document).on('turbolinks:load', function(){
  
  $(function() {
    $('.directUpload').find("input:file").each(function(i, elem) {
      var fileInput    = $(elem);
      var form         = $(fileInput.parents('form:first'));
      var submitButton = form.find('input[type="submit"]');
      var progressBar  = $("<div class='bar'></div>");
      var barContainer = $("<div class='progress'></div>").append(progressBar);
      fileInput.after(barContainer);
      fileInput.fileupload({
        fileInput:       fileInput,
        url:             form.data('url'),
        type:            'POST',
        autoUpload:       true,
        formData:         form.data('form-data'),
        paramName:        'file', // S3 does not like nested name fields i.e. name="user[avatar_url]"
        dataType:         'XML',  // S3 returns XML if success_action_status is set to 201
        replaceFileInput: false,
        progressall: function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
          progressBar.css('width', progress + '%');
        },
        start: function (e) {
          submitButton.prop('disabled', true);
  
          progressBar.
            css('background', 'green').
            css('display', 'block').
            css('width', '0%').
            text("Loading...");
        },
        done: function(e, data) {
          submitButton.prop('disabled', false);
          progressBar.text("Uploading done");
  
          // extract key and generate URL from response
          var key   = $(data.jqXHR.responseXML).find("Key").text();
          var url   = '//' + form.data('host') + '/' + key;
  
          // create hidden field
          var input = $("<input />", { type:'hidden', name: fileInput.attr('name'), value: url });
          form.append(input);
        },
        fail: function(e, data) {
          submitButton.prop('disabled', false);
  
          progressBar.
            css("background", "red").
            text("Failed");
        }
      });
    });
  });
  
  var stripe = Stripe( $('meta[name="stripe-key"]').attr('content') );
  var elements = stripe.elements();
  
  // Custom styling can be passed to options when creating an Element.
  var style = {
    base: {
      // Add your base input styles here. For example:
      fontSize: '16px',
      lineHeight: '24px'
    }
  };
  
  // Create an instance of the card Element
  var card = elements.create('card', {style: style});

  // Add an instance of the card Element into the `card-element` <div>
  card.mount('#card-element');
  
  // Add EventListener to catch mistakes as user types
  card.addEventListener('change', function(event) {
    var displayError = document.getElementById('card-errors');
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = '';
    }
  });
  
  // Create a token or display an error when the form is submitted.
  var form = document.getElementById('pro-form');
  form.addEventListener('submit', function(event) {
    event.preventDefault();

    stripe.createToken(card).then(function(result) {
      if (result.error) {
        // Inform the user if there was an error
        var errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
      } else {
        // Send the token to your server
        stripeTokenHandler(result.token);
      }
    });
  });
});

function stripeTokenHandler(token) {
  // Insert the token ID into the form so it gets submitted to the server
  var form = document.getElementById('pro-form');
  var hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'user[stripeToken]');
  hiddenInput.setAttribute('value', token.id);
  form.appendChild(hiddenInput);

  // Submit the form
  form.submit();
}