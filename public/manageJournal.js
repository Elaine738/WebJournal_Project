//The URIs of the Azure endpoint and blob account

//Create Individual Journal - allows user to create their new journal
CIJ = "https://prod-03.ukwest.logic.azure.com:443/workflows/fe03f09bead94bf2991c35ed44e5f327/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=wSxGq-yTWriVowlNApTuLmCl9OwypgeSLs5oWobdQys";
//Retrieve All Journals - allows user to view their journals upon registering or logging in
RAJ1 = "https://prod-00.uksouth.logic.azure.com/workflows/dbebdcf4ca5c4b9c9e991fe436cf1f38/triggers/When_a_HTTP_request_is_received/paths/invoke/journals/";
RAJ2 = "?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=4a-KNy3roqCYdg_IYc3xhnFPsW5FtZ1oxJcgtJRWqCs";
//Retrieve Individual Journal - needed for editing details
RIJ1 = "https://prod-19.uksouth.logic.azure.com/workflows/4c3c838289dc490f9949823edeb1c51b/triggers/When_a_HTTP_request_is_received/paths/invoke/journal/";
RIJ2 = "?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=D65TyHGar6T6FWvLZfuZ80Qv8kYoEZBjeQ-3I0Jw2H4";

//Delete Individual Journal 1 + 2 - split so that a unique ID can be placed inbetween when sending a request
DIJ1 = "https://prod-28.ukwest.logic.azure.com/workflows/991fb177d6c849ca9963052469c7b270/triggers/When_a_HTTP_request_is_received/paths/invoke/delete/journal/";
DIJ2 = "?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=QxbzXl_1-2hnO_FY_I452LNTgwRyRkWfI2PPTRHcyFs";

//Update Individual Journal 1 + 2 split so that a unique ID can be placed inbetween when sending a request
UIJ1 = "https://prod-08.ukwest.logic.azure.com/workflows/bf91eab02c924b2592ad484be3178f40/triggers/When_a_HTTP_request_is_received/paths/invoke/update/journal/";
UIJ2 = "?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=soAytIHb0W3cPy6tS0meZ8e3Rk-vCLF47nUSIu843hQ";
//Link to blob account where multimedia is stored
BLOB_ACCOUNT = "https://webjournalstorage.blob.core.windows.net";

//Handlers for button clicks
$(document).ready(function() {

 
  $("#getJournals").click(function(){
      getJournals();
  }); 

   $("#subNewJournal").click(function(){
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
 submitData.append('userID', userId);

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
 /*.done(function() {
  alert("Journal created successfully!");
  getJournals();
})
  */
 });
  

}

function getJournals() {
  $('#JournalList').html('<div class="spinner-border" role="status"><span class="sr-only">&nbsp;</span></div>');
  //RUJ = retrieve users journals - other users journals will not be visible
  RUJ = RAJ1 + userId + RAJ2;
  console.log(RUJ);

  $.getJSON(RUJ, function(data) {
    var items = [];
    // Create an array to hold the users Journals
    var items = [];

    // Iterate through the returned records and build HTML
    $.each(data, function(key, val) {
      console.log(data);
      items.push("<hr />");
      items.push(val["journalName"] + "<br />");
      items.push("<img src='" + BLOB_ACCOUNT + val["filePath"] + "' width='400'/> <br/>");
      items.push(`<button class='btn btn-secondary delete-button' data-id='${val["id"]}' style='margin-top: 10px;'>Delete Journal</button><br/>`);
      items.push(`<button class='btn btn-primary edit-button' data-id='${val["id"]}' style='margin-top: 10px;'>Edit Journal</button> <br/>`);
      items.push(`<button class='btn btn-primary view-entries' data-id='${val["id"]}' style='margin-top: 10px;'>View Entries</button> <br/>`);
      items.push("<hr />");
      
    });

    // Clear the Journal list div
    $('#JournalList').empty();

    $("<ul/>", {
      "class": "my-new-list",
      html: items.join("")
    }).appendTo("#JournalList");


    $(".delete-button").on("click", function() {
      const journalId = $(this).data("id"); // Retrieve the id from the data-id attribute
      if (confirm("Are you sure you want to delete this Journal? All entries entered will also be deleted!")) {
        deleteJournal(journalId);
      }
    });

    $(".view-entries").on("click", function(req, res) {
      const journalId = $(this).data("id");
      console.log(journalId);
      window.location = '/entries/' + journalId;
      //res.redirect('/entries/' + journalId);
    });

    $(".edit-button").on("click", function() {
      const journalId = $(this).data("id"); 
      $.getJSON(RIJ1 + journalId + RIJ2, function(data) {
        $("#editJournalName").val(data.journalName);
        console.log("#editJournalName:", $("#editJournalName").val())
        //$("#editJournalName").val(data.journalName);
    
        $("#EditJournal").show(); 
        $("#JournalList").hide(); 
    
        $("#saveEdit").data("id", journalId); 
      });
    });
    
    $("#cancelEdit").on("click", function() {
      $("#EditJournal").hide(); 
      $("#JournalList").show(); 
    });

    $("#saveEdit").off("click").on("click", function() {
      const journalId = $(this).data("id");
      const GETJOURNAL = RIJ1 + journalId + RIJ2;
      console.log("GET URL:", GETJOURNAL);
      console.log("Received data:", data);
    
      // Fetch current post details (if needed for confirmation or fallback)
      $.getJSON(GETJOURNAL, function(data) {
        const updatedData = {
          id: journalId,
          filePath: data.filePath,
          fileLocator: journalId,
          userID: data.userID,
          journalName: $("#editJournalName").val(),
        };
    
        // Send the PUT request
        $.ajax({
          type: "PUT",
          url: UIJ1 + journalId + UIJ2,
          data: JSON.stringify(updatedData),
          contentType: "application/json",
          success: function() {
            alert("Journal updated successfully!");
            getJournals();
            $("#EditJournal").hide();
            $("#JournalList").show(); 
          },
          error: function() {
            alert("Failed to update the Journal.");
          },
        });
      });
    });
    
  

  });
}

function deleteJournal(id) {
  $.ajax({
    type: "DELETE",
    url: DIJ1 + id + DIJ2,
  })
    .done(function() {
      alert("Journal deleted successfully!");
      getJournals();
    })
}
