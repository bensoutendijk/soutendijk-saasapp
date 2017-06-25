/* global $, Stripe */

// Document Ready
$(document).on('turbolinks:load', function(){
    var theForm = $('#pro-form');
    var submitBtn = $('#form-signup-btn')
    
  // Set our Stripe public key
  Stripe.setPublishableKey($('meta[stripe-key]').attr('content'))
  
  // When user clicks form submit button
  submitBtn.click(function(event){
    // we will prevent the default submission behavior
    event.preventDefault();
    // Collect the credit card field
    var ccNum = $('#card_number.val()'),
        cvcNUM = $('#card_code.val()'),
        expMonth = $('#card_month.val()'),
        expYear = $('#card_year.val()');
    // Send card info to Stripe
    Stripe.createToken({
      number: ccNum,
      cvc: cvcNum,
      exp_month: expMonth,
      exp_year: expYear
    }, stripeResponseHandler)
  });
  
 
  // Stripe will return back a card token
  // Inject card token as hidden field into form
  // Submit form to Rails app
});