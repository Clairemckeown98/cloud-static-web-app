//The URIs of the REST endpoint
IUPS = "https://prod-54.northeurope.logic.azure.com:443/workflows/d4d8ce37377446c994f14e5e5a327529/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Z06Wp0sAugEMPj_YfPZEZNCIvRO2RqKViYmA1UA2BMM";
RAI = "https://prod-57.northeurope.logic.azure.com:443/workflows/a5b6e46177844fe6a9c3304641ea9f7a/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=4WNE1KTtVJRpmQBlazPoFyjSuIgRFucMVwaSXwgg6BU";
DAI_START = "https://prod-03.northeurope.logic.azure.com/workflows/723afd0b94ff46f6afa91fa8f1debcff/triggers/manual/paths/invoke/rest/v1/assets/";
DAI_END = "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=eJJIqQ7EniJaABUmzEaSWkznxO4tFYX9r6aTx5VYTxM";

BLOB_ACCOUNT = "https://omgshreb00776820.blob.core.windows.net";

//Handlers for button clicks
$(document).ready(function() {

 
  $("#retVideos").click(function(){

      //Run the get asset list function
      getVideos();

  }); 

   //Handler for the new asset submission button
  $("#subNewForm").click(function(){

    //Execute the submit new asset function
    submitNewAsset();
    
  }); 
});

//A function to submit a new asset to the REST endpoint
function submitNewAsset(){
  //Create a form data object
   submitData = new FormData();
   //Get form variables and append them to the form data object
   submitData.append('FileName', $('#FileName').val());
   submitData.append('userID', $('#userID').val());
   submitData.append('userName', $('#userName').val());
   submitData.append('File', $("#UpFile")[0].files[0]);
   submitData.append('title', $('#title').val());
   submitData.append('publisher', $('#publisher').val());
   submitData.append('genre', $('#genre').val());
   submitData.append('ageRating', $('#ageRating').val());
  
   //Post the form data to the endpoint, note the need to set the content type header
   $.ajax({
   url: IUPS,
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
   

//A function to get a list of all the assets and write them to the Div with the AssetList Div
function getVideos(){
//Replace the current HTML in that div with a loading message
 $('#VideoList').html('<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>');
 $.getJSON(RAI, function( data ) {
 //Create an array to hold all the retrieved assets
 var items = [];

 //Iterate through the returned records and build HTML, incorporating the key values of the record in the data
 $.each( data, function( key, val ) {
 items.push( "<hr />");
 items.push("<video controls width='320' height='240' controls autoplay src='"+BLOB_ACCOUNT + val["filePath"] +"'type='video/mp4'/></video> <br />")
 items.push( "Title : " + val["title"] + "<br />");
 items.push( "Uploaded by: " + val["userName"] + " (user id: "+val["userID"]+")<br />");
 
 items.push( "Genre: " + val["genre"] + " (Age Rating: "+val["ageRating"]+")<br />");
 items.push('<button type="button" onclick=\"deleteVideoFunction(\''+val["id"]+'\')">Delete</button>');
 items.push( "<hr />");
 });
 //Clear the assetlist div
 $('#VideoList').empty();
 //Append the contents of the items array to the VideoList Div
 $( "<ul/>", {
 "class": "my-new-list",
 html: items.join( "" )
 }).appendTo( "#VideoList" );
 });
}

function deleteVideoFunction(id){
$.ajax({
  type:"DELETE",
  url:DAI_START + id + DAI_END
}).done(function(){
  getVideos();
})
}
