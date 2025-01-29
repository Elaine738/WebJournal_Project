//Handlers for button clicks
$(document).ready(function() {
 
  $("#loginFunction").click(function(){
      login();
  }); 

  $("#register").click(function(){

    registerFunction();
    
  }); 
});


async function registerFunction(){
    submitData = new FormData();

    var email = $('#email').val();
    var username = $('#username').val();
    var password = $('#password').val();

    
    $.ajax({
      url: '/register',
      type: 'POST',
      contentType: false,
      processData: false,
      data: {
        email: email,
        username: username,
        password: password
      },
      success: function(response) {
        console.log('Registration successful', response);
        alert("Registration successful!");
      },
      error: function(xhr, status, error) {
        console.error('Registration failed', error);
        alert("Registration failed. Please try again.");
      }
    });

}