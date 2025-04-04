//links to Azure logic apps to delete users journals when deleting their account
DAJ1 = "https://prod-40.uksouth.logic.azure.com/workflows/6482b059874746a18953268fb5c82ce6/triggers/When_a_HTTP_request_is_received/paths/invoke/";
DAJ2 = "?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=YPr55GdPEbGbz6zR2oYGuQh8RClSVcYhR5ZxtsXngQ4";

DAE1 = "https://prod-14.ukwest.logic.azure.com/workflows/65c4bff7b1734ddcbbdfb82dd4a0592c/triggers/When_a_HTTP_request_is_received/paths/invoke/";
DAE2 = "?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=aIvfBhWwhUzlp8C2NhkRk1JTfG6_OsuuoY5RVLeDuaM";

//Handlers for button clicks
$(document).ready(function() {
  
  $("#register").click(function(){

    registerFunction();
    
  }); 

  $("#deleteAccount").click(function(){

    deleteAccount(userId);
    
  }); 

  $("#savePassword").click(function(){
    console.log('changepassword clicked');

    const newPassword = $("#newPassword").val();
    console.log('newPassword:', newPassword);

    if (!newPassword) {
      alert('Please enter a new password');
      return;
    }
    saveNewPassword(newPassword);
    
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
        window.location = '/'

      },
      error: function(xhr, status, error) {
        console.error('Registration failed', error);
        alert("Registration failed. Please try again.");
      }
    });

}


async function deleteAccount(id){
  console.log('deleteAccount reached');
  userID = id;

  if (confirm("Are you sure you want to delete your account? This action cannot be undone!")) {
    const response = await fetch("/account", { 
      method: "DELETE"
    });

    if (response.ok) {
      alert("Your account has been deleted.");
      window.location.href = "/";
    } else {
      alert("Error deleting account.");
    }
  }

}
async function saveNewPassword(password){
  console.log('saveNewPassword code code reached');
  console.log('userID:',userId);
  //const newPassword = document.getElementById('newPassword').value;
  alert('message received!');
  const newPassword = password;

  try {
    console.log('trying......................................................................');
    const response = await fetch('/account', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newPassword })
    });

    alert('success!');
  } catch (error) {
    alert('an error has occured!', error);
  }

}