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

  $(".delete-button").on("click", function() {
    id = userId;
    deleteAccount(id);
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

function deleteAccount(id){
  console.log('deleteAccount reached');
  userID = id;

  //insert code to delete account from MongoDB here
  var url = "mongodb://localhost:27017/";

  mongoose.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("users");
    var myquery = { "_id": ObjectId(id) };
    dbo.collection("users").deleteOne(myquery, function(err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      db.close();
    });
  });

  $.ajax({
    type: "DELETE",
    url: DAJ1 + userID + DAJ2,
  })
    .done(function() {
      console.log("DAJ success")
    })

    $.ajax({
      type: "DELETE",
      url: DAE1 + userID + DAE2,
    })
      .done(function() {
        console.log("DAE success")
      })

}