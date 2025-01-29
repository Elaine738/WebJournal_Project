//The URIs of the REST endpoint
MEDIAUPLOADAPP = "https://prod-13.northcentralus.logic.azure.com:443/workflows/5241e2964b3c465989520db12e0d2d96/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=8ePtZIpjphUcHoibmkFBdRsY-Bz3xhafmAwN1vHFvvM";
MEDIALIST = "https://prod-12.northcentralus.logic.azure.com:443/workflows/b527573c32114bc59515eaae19d729d1/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=SSpflLVW29ZwdSXK_8P7S-lZyXnLfQZyEMrwR7TCflA";
DOP1 = "https://prod-14.northeurope.logic.azure.com/workflows/1f0f37af2eb146efb890b5d4145d60e8/triggers/When_a_HTTP_request_is_received/paths/invoke/rest/v1/post/";
DOP2 = "?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=0Hs54y1m1mpNmS5zaBPt3ChkD1cU3eNRJPFAzT0fXKo";

GOP1 = "https://prod-25.northeurope.logic.azure.com/workflows/8e95dd024c254224ada79733f7f4bfa2/triggers/When_a_HTTP_request_is_received/paths/invoke/rest/v1/post/";
GOP2 = "?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=PrV1R6yOwil6wDL7jhqX0L-opzw8cQOtEX4jkNSswxA";

UP1 = "https://prod-05.northcentralus.logic.azure.com/workflows/265d1145f07f4b3cbe79bfd9047469fd/triggers/When_a_HTTP_request_is_received/paths/invoke/rest/v1/post/%7Bid%7D";
UP2 = "?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=8UJuCR8FkUPqNUxDtVzC1ruI0u6b1w6pNLJUe1YwZP4";

BLOB_ACCOUNT = "https://cloudnativecw.blob.core.windows.net";


//Handlers for button clicks
$(document).ready(function() {

 
  $("#getEntries").click(function(){
      getEntries();
  }); 

   //Handler for the new asset submission button
  $("#subNewForm").click(function(){

    //Execute the submit new asset function
    submitNewPost();
    
  }); 
});

//A function to submit a new asset to the REST endpoint 
function submitNewPost(){

  //Create a form data object
 submitData = new FormData();
 //Get form variables and append them to the form data object
 submitData.append('title', $('#title').val());
 submitData.append('userID', $('#userID').val());
 submitData.append('userName', $('#userName').val());
 submitData.append('caption', $('#caption').val());
 submitData.append('tags', $('#tags').val());
 submitData.append('createdAt', $('#createdAt').val());
 submitData.append('editedAt', $('#createdAt').val());
 submitData.append('File', $("#UpFile")[0].files[0]);
 submitData.append('mediaType', $("#mediaType").val());

 //Post the form data to the endpoint, note the need to set the content type header
 $.ajax({
 url: MEDIAUPLOADAPP,
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

function deletePost(id) {
  $.ajax({
    type: "DELETE",
    url: DOP1 + id + DOP2,
  })
    .done(function() {
      alert("Post deleted successfully!");
      retImages();
    })
}