$(document).ready(function(){
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDCVGHIxBAf6Ba2h0Lm8KM9on0c1V2-xE4",
    authDomain: "train-scheduler-1a25b.firebaseapp.com",
    databaseURL: "https://train-scheduler-1a25b.firebaseio.com",
    projectId: "train-scheduler-1a25b",
    storageBucket: "train-scheduler-1a25b.appspot.com",
    messagingSenderId: "72342945746",
    appId: "1:72342945746:web:f41442553a0bfe23"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();

  var trainCount = 0;
  
  $("#submit").on("click", function(){
    var trainName = $("#trainName").val().trim();
    var destination = $("#addDestination").val().trim();
    var trainTime = $("#firstTrainTime").val().trim();
    var frequency = $("#frequency").val().trim();

    var newTrain = {
      "trainName": trainName,
      "destination": destination,
      "trainTime": trainTime,
      "frequency": frequency
    };

    database.ref().push(newTrain);
  });

  database.ref().on("clild_added", function(childSnapshot){
    console.log(childSnapshot);
    $(".newTrains").append("<tr class='train" + trainCount + "'><td>" + childSnapshot.val().trainName + "</td><td>" +
        childSnapshot.val().destination + "</td><td>" + childSnapshot.val().trainTime + 
        "</td><td>" + childSnapshot.val().frequency + "</td></tr>");
  });
});