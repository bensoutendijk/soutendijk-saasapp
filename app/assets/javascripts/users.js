/* global $, Stripe */

// Document Ready
$(document).on('turbolinks:load', function(){
    var theForm = $('#pro-form');
    var submitBtn = $('#form-signup-btn');
    
  // Set our Stripe public key
  Stripe.setPublishableKey($('meta[stripe-key]').attr('content'));
  
  // When user clicks form submit button
  submitBtn.click(function(event){
    
    // we will prevent the default submission behavior
    event.preventDefault();
    submitBtn.val("Processing...").prop('disabled', true);
    
    // Collect the credit card field
    var ccNum = $('#card_number.val()'),
        cvcNum = $('#card_code.val()'),
        expMonth = $('#card_month.val()'),
        expYear = $('#card_year.val()');
        
    // Use Stripe JS lib to check for card errors
    var error = false;
    
    // Validate card number
    if (!Stripe.card.validateCardNumber(ccNum)) {
      error=true;
      alert('Invalid CC number');
    }
    
    // Validate CVC number
    if (!Stripe.card.validateCVC(cvcNum)) {
      error=true;
      alert('Invalid CVC number');
    }
    
    // Validate expiration date
    if (!Stripe.card.validateExpiry(expMonth,expYear)) {
      error=true;
      alert('Invalid card expiration date');
    }
    
    if (error){
    // Dont send to Stripe
    submitBtn.prop('disabled', false).val("Sign up");
    } else {
      // Send card info to Stripe
      Stripe.createToken({
      number: ccNum,
      cvc: cvcNum,
      exp_month: expMonth,
      exp_year: expYear
      }, stripeResponseHandler);
    }
    
    
    return false;
  });
 
  // Stripe will return back a card token
  function stripeResponseHandler(status, response) {
    // Get the token from the response
    var token = response.id;
    
    // Inject card token as hidden field into form
    theForm.append( $('<input type="hidden" name="user[stripe_card_token]>').val(token) );
    // Submit form to Rails app
    theForm.get(0).submit();
  }
});