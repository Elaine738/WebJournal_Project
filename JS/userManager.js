RIU = "";
CIU = "https://prod-04.ukwest.logic.azure.com/workflows/f0c9f6d8978f401bb66b505320f0405b/triggers/When_a_HTTP_request_is_received/paths/invoke/register?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=x64fYlaLHPsJ5ovDODDeknsf--aJLEMOFLYwACzO5C0";


//Handlers for button clicks
$(document).ready(function() {

 
  $("#loginFunction").click(function(){
      login();
  }); 

   //Handler for the new asset submission button
  $("#register").click(function(){

    //Execute the submit new asset function
    registerFunction();
    
  }); 
});


function registerFunction(){
    const bcrypt = require('bcryptjs');
    const { v4: uuidv4 } = require('uuid'); //https://www.npmjs.com/package/uuid
    submitData = new FormData();
    const hashPassword = bcrypt($('password'.val()));

    submitData.append('userID', uuidv4().stringify());
    submitData.append('email',$('email'.val()));
    submitData.append('username',$('username'.val()));
    submitData.append('passwordHash',hashPassword);

    $.ajax({
        url: CIU,
        data: submitData,
        cache: false,
        enctype: 'multipart/form-data',
        contentType: false,
        processData: false,
        type: 'POST',
        success: function(data){
       
        }
        });

}