//The URIs of the REST endpoint
CIJ = "https://prod-03.ukwest.logic.azure.com:443/workflows/fe03f09bead94bf2991c35ed44e5f327/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=wSxGq-yTWriVowlNApTuLmCl9OwypgeSLs5oWobdQys"


//Handlers for button clicks
$(document).ready(function() {

 
  $("#getEntries").click(function(){
      getEntries();
  }); 

   //Handler for the new asset submission button
   $("#subNewForm").click(function(){

    console.log();
    //Execute the submit new asset function
    submitNewPost();
    
  }); 
});

//A function to submit a new asset to the REST endpoint 
function submitNewPost(){

  //Create a form data object
 submitData = new FormData();
 //Get form variables and append them to the form data object
 submitData.append('journalName', $('#title').val());
 submitData.append('File', $("#UpFile")[0].files[0]);
 submitData.append('userID', 'userID');

 //Post the form data to the endpoint, note the need to set the content type header
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

function retImages() {
  $('#ImagesList').html('<div class="spinner-border" role="status"><span class="sr-only">&nbsp;</span></div>');

  $.getJSON(MEDIALIST, function(data) {
    var items = [];
    // Create an array to hold all the retrieved assets
    var items = [];

    // Iterate through the returned records and build HTML
    $.each(data, function(key, val) {
      if (val["mediaType"] == 'image') {
        items.push("<hr />");
        items.push(val["title"] + "<br />");
        items.push("<img src='" + BLOB_ACCOUNT + val["filePath"] + "' width='400'/> <br/>");
        items.push("Caption : " + "<br />" + val["caption"] + "<br />");
        items.push("Uploaded by: " + val["userName"] + "  (User ID: " + val["userID"] + ")" + "<br/>");
        items.push("Posted On: " + val["createdAt"] + "<br/>");
        items.push("Tags : " + "<br />" + val["tags"] + "<br />");
        items.push("Created : " + "<br />" + val["createdAt"] + "<br />");
        items.push("Last Edited : " + "<br />" + val["editedAt"] + "<br />");

        
        items.push(`<button class='btn btn-secondary delete-button' data-id='${val["id"]}' style='margin-top: 10px;'>Delete Post</button><br/>`);
        items.push(`<button class='btn btn-primary edit-button' data-id='${val["id"]}' style='margin-top: 10px;'>Edit Post</button> <br/>`);

        items.push("<hr />");
      }

      if (val["mediaType"] == 'video') {
        items.push("<hr />");
        items.push(val["title"] + "<br />");
        items.push(
          "<video width='400' controls>" +
          "<source src='" + BLOB_ACCOUNT + val["filePath"] + "' type='video/mp4'>" +
          "Your browser does not support the video tag." +
          "</video> <br/>"
        );
        items.push("Caption : " + "<br />" + val["caption"] + "<br />");
        items.push("Uploaded by: " + val["userName"] + "  (User ID: " + val["userID"] + ")" + "<br/>");
        items.push("Posted On: " + val["createdAt"] + "<br/>");
        items.push("Tags : " + "<br />" + val["tags"] + "<br />");
        items.push("Created : " + "<br />" + val["createdAt"] + "<br />");
        items.push("Last Edited : " + "<br />" + val["editedAt"] + "<br />");

        // Add a button after the video
        items.push(`<button class='btn btn-secondary delete-button' data-id='${val["id"]}' style='margin-top: 10px;'>Delete Post</button> <br/>`);
        items.push(`<button class='btn btn-primary edit-button' data-id='${val["id"]}' style='margin-top: 10px;'>Edit Post</button> <br/>`);

        items.push("<hr />");
      }
    });

    // Clear the asset list div
    $('#ImagesList').empty();

    // Append the contents of the items array to the ImagesList Div
    $("<ul/>", {
      "class": "my-new-list",
      html: items.join("")
    }).appendTo("#ImagesList");

    $(".delete-button").on("click", function() {
      const postId = $(this).data("id"); // Retrieve the id from the data-id attribute
      if (confirm("Are you sure you want to delete this post?")) {
        deletePost(postId);
      }
    });

    $(".edit-button").on("click", function() {
      const postId = $(this).data("id"); // Get the ID of the post to edit
      $.getJSON(GOP1 + postId + GOP2, function(data) {
        

        $("#editTitle").val(data.title);
        $("#editCaption").val(data.caption);
        $("#editTags").val(data.tags);
    
        $("#EditPost").show(); // Show the edit form
        $("#ImagesList").hide(); // Hide the images list
    
        $("#saveEdit").data("id", postId); // Save the ID for saving changes
      });
    });
    
    $("#cancelEdit").on("click", function() {
      $("#EditPost").hide(); // Hide the edit form
      $("#ImagesList").show(); // Show the images list
    });

    $("#saveEdit").off("click").on("click", function() {
      const postId = $(this).data("id");
      const GETPOST = GOP1 + postId + GOP2;
      console.log("GET URL:", GETPOST);
      console.log("Received data:", data);
    
      // Fetch current post details (if needed for confirmation or fallback)
      $.getJSON(GETPOST, function(data) {
        const updatedData = {
          id: postId,
          filePath: data.filePath,
          fileLocator: postId,
          userID: data.userID,
          userName: data.userName,
          createdAt: data.createdAt,
          editedAt: new Date().toISOString(),
          mediaType: data.mediaType,
          title: $("#editTitle").val() || data.title,
          caption: $("#editCaption").val() || data.caption,
          tags: $("#editTags").val() || data.tags,
        };

    
        // Send the PUT request
        $.ajax({
          type: "PUT",
          url: UP1 + postId + UP2,
          data: JSON.stringify(updatedData),
          contentType: "application/json",
          success: function() {
            alert("Post updated successfully!");
            console.log("GET URL:", GETPOST);
            console.log("Received data:", data);
            retImages(); // Reload the images
            $("#EditPost").hide(); // Hide the edit form
            $("#ImagesList").show(); // Show the images list
          },
          error: function() {
            alert("Failed to update the post.");
          },
        });
      });
    });
    
  

  });
}
