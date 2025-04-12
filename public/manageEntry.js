//Create Individual Entry
CIE = "https://prod-18.uksouth.logic.azure.com:443/workflows/a08efa0d6edb484ab386ed85ec2e11d7/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=QoI6B1BscubW6pOEVe0IMwl_9GGeSvbLnptJwMJx1q4";

//Retrieve All Entries - this logic app gets every entry correlating to a specific journal ID
RAE1 = "https://prod-17.ukwest.logic.azure.com/workflows/7b02518886f04cb0bf19b7101ac826a5/triggers/When_a_HTTP_request_is_received/paths/invoke/entries/";
RAE2 = "?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=fYhOguzQJAXVZ-nGwBX3wxjLwmP3cSSlnnnyMahwq1c";

//Delete Individual Entry - this logic app deletes the entry with the corresponding ID
DIE1 = "https://prod-60.uksouth.logic.azure.com/workflows/05140a83cf8b4c32ba1a5bfc76c238b5/triggers/When_a_HTTP_request_is_received/paths/invoke/entry/";
DIE2 = "?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=MxnK0K4SSvN4jmXjWNB2rOZ6NP3DYgsISj6N8C0g1zU";

//Retrieve Individual Entry - this logic app retrieves the logic app correlating to the ID
RIE1 = "https://prod-32.uksouth.logic.azure.com/workflows/d44195ff4cd34e21836dc362df9a032b/triggers/When_a_HTTP_request_is_received/paths/invoke/entry/";
RIE2 = "?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=0lby1O2iQJH2gc8SNpDW0vvLN0Bew-85LbBurx4bHfI";

//Update Entry - this logic app updates the entry
UE = "https://prod-10.ukwest.logic.azure.com/workflows/58fe4850016c49559c4088a0d557787b/triggers/When_a_HTTP_request_is_received/paths/invoke/";
UE2 = "?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=H_1PcaxPIZc_Watdgw8Ykjx78zdRMZ6f2ySbFtqY48I";

//Storage account for the multimedia
BLOB_ACCOUNT = "https://webjournalstorage.blob.core.windows.net";


//Handlers for button clicks
$(document).ready(function() {

  $(".view-button").on("click", function() {
    const entryId = id;
    console.log("Script loaded, fetching data...");

    $('#List').html('<div class="spinner-border" role="status"><span class="sr-only">&nbsp;</span></div>');

    $.getJSON(RIE1 + entryId + RIE2, function(data) {
        console.log("Data received:", data);

        if (!data || data.length === 0) {
            $('#List').html("<p>No data available.</p>");
            return;
        }

        let firstItem = data[0]; // Get the first document
        console.log("Displaying:", firstItem);

        let content = `
            <hr />
            <strong>${firstItem.title}</strong><br />
            Date Written: ${firstItem.createdAt}<br/>
            <hr />
        `;

        $('#List').empty().html(content); // Display only the first item
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Request Failed:", textStatus, errorThrown);
        $('#List').html("<p>Error loading data.</p>");
    });
  });


  $("#getEntries").click(function(){
      getEntries();
  }); 


  $("#subNewEntry").click(function(){
    submitNewEntry();

  }); 

  $("#add-entry").on("click", function() {
    window.location = '/newEntry/' + journalId;
  });

});


function submitNewEntry(){
 submitData = new FormData();
 var fd = new FormData(document.getElementById('newEntryForm'));

 //get current date in readable format
 const date = new Date();
 let day = date.getDate();
 let month = date.getMonth() + 1;
 let year = date.getFullYear();
 let currentDate = `${day}-${month}-${year}`;

 const title = 

 submitData.append('title', $('#title').val());
 submitData.append('body', $('#body').val());
 submitData.append('createdAt', currentDate);
 submitData.append('journalID', journalId);
 submitData.append('userID', userId);

 
 let image = $("#imageInput")[0].files[0];
 let video = $("#videoInput")[0].files[0];
 let audio =$("#audioInput")[0].files[0];
 if(image){
  submitData.append('image', $("#imageInput")[0].files[0]) ;
  console.log('imageInput: ', image);
 }
 if(video){
  submitData.append('video', $("#videoInput")[0].files[0]);
  console.log('videoInput: ', $("#videoInput")[0].files[0]);
 }
 if(audio){
 submitData.append('audio', $("#audioInput")[0].files[0]);
 console.log('audioInput: ', $("#audioInput")[0].files[0]);
 }
 

 /* attempt to allow users to add multiple files at a time for 1 multimedia type
 this successfully allowed multiple file uploads but Azure logic apps didn't like it
 
 // multiple files can be added to 1 entry
 // this will loop through each file to add them individually
 var fileInput = document.getElementById('imageInput');
 var files = fileInput.files;
 for (var i = 0; i < files.length; i++) {
  submitData.append('images', files[i])
  console.log('images:', files[i]);
}
*/

for (var pair of submitData.entries()) {
  console.log(pair[0]+ ', ' + pair[1]); 
}
console.log('------------------------');
console.table([...submitData]);
console.log('------------------------');
console.log(...submitData);

 $.ajax({
  url: CIE,
  data: submitData,
  cache: false,
  enctype: 'multipart/form-data',
  contentType: false,
  processData: false,
  type: 'POST',
  success: function(data){
    window.alert("Entry created successfully!");
    window.location.pathname = 'entries/' + journalId;

 }
 });


}

function getEntries() {
  $('#EntriesList').html('<div class="spinner-border" role="status"><span class="sr-only">&nbsp;</span></div>');
  fullRetrieveURL = RAE1 + journalId + RAE2;

  $.getJSON(fullRetrieveURL, function(data) {
    var items = [];

    var items = [];

    $.each(data, function(key, val) {
      items.push("<hr />");
      items.push(val["title"] + "<br />");
      items.push("Date Written: " + val["createdAt"] + "<br/>");


      items.push(`<button class='btn btn-secondary delete-button' data-id='${val["id"]}' style='margin-top: 10px;'>Delete Entry</button><br/>`);
      items.push(`<button class='btn btn-primary edit-button' data-id='${val["id"]}' style='margin-top: 10px;'>Edit Entry</button> <br/>`);
      items.push(`<button class='btn btn-primary view-button' data-id='${val["id"]}' style='margin-top: 10px;'>View Entry</button> <br/>`);

      items.push("<hr />");
    });

    $('#EntriesList').empty();

    $("<ul/>", {
      "class": "my-new-list",
      html: items.join("")
    }).appendTo("#EntriesList");

    $(".delete-button").on("click", function() {
      const entryId = $(this).data("id"); 
      if (confirm("Are you sure you want to delete this entry?")) {
        deleteEntry(entryId);
      }
    });

    $(".view-button").on("click", function() {
      const entryId = $(this).data("id");
      $.getJSON(RIE1 + entryId + RIE2, function(data) {

        document.getElementById('entryTitle').innerHTML = data.title;
        document.getElementById('entryBody').innerHTML = data.body;
        var img = document.getElementById('entryImage');
        var imagefilePath = data.imageFilePath;
        console.log('data.imageFilePath: ',data.imageFilePath);

        img.src = BLOB_ACCOUNT + data.imageFilePath;
        console.log('Image: ', img.src);
        
        //if a image was not chosen when creating the entry - do not display the broken image icon
        if(imagefilePath == 'n/a' || !imagefilePath){
          img.style.display = "none";
        }

        var video = document.getElementById('entryVideo');
        var videoSource = document.getElementById('entryVideoSource');
        var videofilePath = data.videoFilePath;

        videoSource.src = BLOB_ACCOUNT + videofilePath;
          videoSource.type = "video/mp4";
          video.load();
          console.log('Video display: ', videoSource.src);
        
        //if an image was not chosen when creating the entry - do not display the broken image icon
        if(videofilePath == 'n/a' || !videofilePath){
          video.style.display = "none";
          console.log('video undefined');
        }

        var audio = document.getElementById('entryAudio');
        var audiofilePath = data.audioFilePath;

        audio.src = BLOB_ACCOUNT + audiofilePath;
          console.log('audio.src: ', document.getElementById('entryAudio').src);
          audio.type = "audio/mp3";
          console.log('Else statement');
        
        //if an image was not chosen when creating the entry - do not display the broken image icon
        if(audiofilePath == 'n/a' || !audiofilePath){
          audio.style.display = "none";
          console.log('filePath != undefined');
        }

        $("#ViewEntry").show();
        $("#EntriesList").hide();
        $("#add-entry-button").hide();
      });
    });

$("#cancelView").on("click", function() {
  $("#ViewEntry").hide();
  $("#EntriesList").show();
  $("#add-entry-button").show();
});

    $(".edit-button").on("click", function() {
      const entryId = $(this).data("id");

      $.getJSON(RIE1 + entryId + RIE2, function(data) {
        $("#editTitle").val(data.title);
        $("#editBody").val(data.body);
        //$("#editEntryImage").val(image);
        //$("#editEntryVideo").val(video);
        //$("#editEntryAudio").val(audio);
        

        $("#EditEntry").show();
        $("#EntriesList").hide();
        $("#add-entry-button").hide();

        $("#saveEdit").data("id", entryId);
      });
    });

    $("#cancelEdit").on("click", function() {
      $("#EditEntry").hide();
      $("#EntriesList").show();
      $("#add-entry-button").show();
    });

    $("#saveEdit").off("click").on("click", function() {
      const entryId = $(this).data("id");
      const ENTRY = RIE1 + entryId + RIE2;

      $.getJSON(ENTRY, function(data) {
        newImage = $("#editEntryImage")[0].files[0];
        newVideo = $("#editEntryVideo")[0].files[0];
        newAudio = $("#editEntryAudio")[0].files[0];

        submitData = new FormData();
        submitData.append('id', entryId);
        if(newImage){
          submitData.append('image', newImage);
        }
        else{
          submitData.append('imageFilePath', data.imageFilePath);
          submitData.append('imageFileLocator', data.imageFileLocator);
        }
        if(newVideo){
          submitData.append('video', newVideo);
        }
        else{
          submitData.append('videoFilePath', data.videoFilePath);
          submitData.append('videoFileLocator', data.videoFileLocator);
        }
        if(newAudio){
          submitData.append('audio', newAudio);
        }
        else{
          submitData.append('audioFilePath', data.audioFilePath);
          submitData.append('audioFileLocator', data.audioFileLocator);
        }
        submitData.append('userID', data.userID);          
        submitData.append('title', $("#editTitle").val());
        submitData.append('body', $("#editBody").val());
        submitData.append('journalID', data.journalId);    
        submitData.append('createdAt', data.createdAt);


        for (var pair of submitData.entries()) {
          console.log(pair[0]+ ', ' + pair[1]); 
        }
        console.log('------------------------');
        console.table([...submitData]);
        console.log('------------------------');
        console.log(...submitData);



        $.ajax({
          type: "PUT",
          url: UE + entryId + UE2,
          data: submitData,
          cache: false,
          enctype: "multipart/form-data",
          contentType: false,
          processData: false,
          success: function() {
            alert("Entry updated successfully!");
            getEntries();
            $("#EditEntry").hide();
            $("#EntriesList").show(); 
          },
          error: function() {
            alert("Failed to update the entry.");
          },
        });
      });
    });



  });
}

// function called when user wants to delete an entry - the id of the entry to be deleted is passed in to identify it
function deleteEntry(id) {
  $.ajax({
    type: "DELETE",
    url: DIE1 + id + DIE2,
  })
    .done(function() {
      alert("Entry deleted successfully!");
      getEntries();
    })
}


// The following code generates a preview for the selected image and video
const imageInput = document.getElementById('imageInput');
const previewContainer = document.getElementById('previewContainer');
function previewSelectedImages() {
  previewContainer.innerHTML = '';
                
  if (!imageInput.files.length) return;
                
  for (let i = 0; i < imageInput.files.length; i++) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.width = '170px';
      img.style.borderRadius = '5px';
      img.style.margin = '10px';
      
      previewContainer.appendChild(img);
    };
    reader.readAsDataURL(imageInput.files[i]);
  }
}
imageInput.addEventListener('change', previewSelectedImages);  

const videoInput = document.getElementById('videoInput');
const previewVideo = document.getElementById('previewVideo');
function previewSelectedVideos() {
  previewVideo.innerHTML = '';
                
  if (!videoInput.files.length) return;
                
  for (let i = 0; i < videoInput.files.length; i++) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const video = document.createElement('video');
      video.src = e.target.result;
      video.style.width = '220px';
      video.style.borderRadius = '5px';
      video.style.margin = '10px';
      video.controls = true;
      
      previewVideo.appendChild(video);
    };
    reader.readAsDataURL(videoInput.files[i]);
  }
}
videoInput.addEventListener('change', previewSelectedVideos);  


const audioInput = document.getElementById('audioInput');
const previewAudio = document.getElementById('previewAudio');
function previewSelectedAudios() {
  previewAudio.innerHTML = '';
                
  if (!audioInput.files.length) return;
                
  for (let i = 0; i < audioInput.files.length; i++) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const audio = document.createElement('audio');
      audio.src = e.target.result;
      audio.style.margin = '10px';
      audio.controls = true;
      
      previewAudio.appendChild(audio);
    };
    reader.readAsDataURL(audioInput.files[i]);
  }
}
audioInput.addEventListener('change', previewSelectedAudios); 