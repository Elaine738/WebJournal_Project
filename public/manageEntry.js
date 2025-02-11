//Create Individual Entry
CIE = "https://prod-18.uksouth.logic.azure.com:443/workflows/a08efa0d6edb484ab386ed85ec2e11d7/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=QoI6B1BscubW6pOEVe0IMwl_9GGeSvbLnptJwMJx1q4";
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


  $("#subNewEntry").click(function(){

    submitNewEntry();

  }); 
});


function submitNewEntry(){
 submitData = new FormData();

 const date = new Date();
 let day = date.getDate();
 let month = date.getMonth() + 1;
 let year = date.getFullYear();
 let currentDate = `${day}-${month}-${year}`;

 submitData.append('title', $('#title').val());
 submitData.append('body', $('#body').val());
 submitData.append('createdAt', currentDate);
 submitData.append('File', $("#UpFile")[0].files[0]);


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

function getEntries() {
  $('#EntriesList').html('<div class="spinner-border" role="status"><span class="sr-only">&nbsp;</span></div>');

  $.getJSON(MEDIALIST, function(data) {
    var items = [];

    var items = [];

    $.each(data.Documents, function(key, val) {
      items.push("<hr />");
      items.push(val["title"] + "<br />");
      items.push("<img src='" + BLOB_ACCOUNT + val["filePath"] + "' width='400'/> <br/>");
      items.push("Caption : " + "<br />" + val["caption"] + "<br />");
      items.push("Uploaded by: " + val["userName"] + "  (User ID: " + val["userID"] + ")" + "<br/>");
      items.push("Posted On: " + val["createdAt"] + "<br/>");
      items.push("Tags : " + "<br />" + val["tags"] + "<br />");
      items.push("Created : " + "<br />" + val["createdAt"] + "<br />");
      items.push("Last Edited : " + "<br />" + val["editedAt"] + "<br />");


      items.push(`<button class='btn btn-secondary delete-button' data-id='${val["id"]}' style='margin-top: 10px;'>Delete Entry</button><br/>`);
      items.push(`<button class='btn btn-primary edit-button' data-id='${val["id"]}' style='margin-top: 10px;'>Edit Entry</button> <br/>`);

      items.push("<hr />");
    });

    $('#ImagesList').empty();

    $("<ul/>", {
      "class": "my-new-list",
      html: items.join("")
    }).appendTo("#ImagesList");

    $(".delete-button").on("click", function() {
      const postId = $(this).data("id"); 
      if (confirm("Are you sure you want to delete this post?")) {
        deletePost(postId);
      }
    });

    $(".edit-button").on("click", function() {
      const postId = $(this).data("id");
      $.getJSON(GOP1 + postId + GOP2, function(data) {


        $("#editTitle").val(data.title);
        $("#editCaption").val(data.caption);
        $("#editTags").val(data.tags);

        $("#EditPost").show();
        $("#ImagesList").hide();

        $("#saveEdit").data("id", postId);
      });
    });

    $("#cancelEdit").on("click", function() {
      $("#EditPost").hide();
      $("#ImagesList").show();
    });

    $("#saveEdit").off("click").on("click", function() {
      const postId = $(this).data("id");
      const GETPOST = GOP1 + postId + GOP2;
      console.log("GET URL:", GETPOST);
      console.log("Received data:", data);

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


        $.ajax({
          type: "PUT",
          url: UP1 + postId + UP2,
          data: JSON.stringify(updatedData),
          contentType: "application/json",
          success: function() {
            alert("Post updated successfully!");
            console.log("GET URL:", GETPOST);
            console.log("Received data:", data);
            retImages();
            $("#EditPost").hide();
            $("#ImagesList").show(); 
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