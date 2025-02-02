//The URIs of the Azure endpoint and blob account
CIJ = "https://prod-03.ukwest.logic.azure.com:443/workflows/fe03f09bead94bf2991c35ed44e5f327/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=wSxGq-yTWriVowlNApTuLmCl9OwypgeSLs5oWobdQys";
RAJ = "https://prod-00.uksouth.logic.azure.com:443/workflows/dbebdcf4ca5c4b9c9e991fe436cf1f38/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=4a-KNy3roqCYdg_IYc3xhnFPsW5FtZ1oxJcgtJRWqCs";
BLOB_ACCOUNT = "https://webjournalstorage.blob.core.windows.net";

//Handlers for button clicks
$(document).ready(function() {

 
  $("#getJournals").click(function(){
      getJournals();
  }); 

   $("#subNewJournal").click(function(){

    console.log();
    //Call the function to add the journal
    submitNewJournal();
    
  }); 
});

//function called to add new journal to DB hosted on Azure
function submitNewJournal(){

  //Create a form data object
 submitData = new FormData();
 //Get form variables and append them to the form data object
 submitData.append('journalName', $('#title').val());
 submitData.append('File', $("#UpFile")[0].files[0]);
 submitData.append('userID', 'userID');

 //Post the form data to the CIJ (create individual journal) endpoint in azure
 $.ajax({
 url: CIJ,
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

function getJournals() {
  $('#JournalList').html('<div class="spinner-border" role="status"><span class="sr-only">&nbsp;</span></div>');

  $.getJSON(RAJ, function(data) {
    var items = [];
    // Create an array to hold the users Journals
    var items = [];

    // Iterate through the returned records and build HTML
    $.each(data.Documents, function(key, val) {
      console.log(data);
      items.push("<hr />");
      items.push(val["journalName"] + "<br />");
      items.push("<img src='" + BLOB_ACCOUNT + val["filePath"] + "' width='400'/> <br/>");
      items.push("<hr />");
      
    });

    // Clear the Journal list div
    $('#JournalList').empty();

    // Append the contents of the items array to the JournalList Div
    $("<ul/>", {
      "class": "my-new-list",
      html: items.join("")
    }).appendTo("#JournalList");


  });
}
