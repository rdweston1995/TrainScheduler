//TESTING COMMIT
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
  
  //When the submit button is clicked
  $("#submit").on("click", function(){
    //Grabing the values of the input from the user
    var trainName = $("#addTrain").val().trim();
    var destination = $("#addDestination").val().trim();
    var trainTime = $("#firstTrainTime").val().trim();
    var frequency = $("#frequency").val().trim();

    //Creating the newTrain object to be pushed to the database
    var newTrain = {
      "trainName": trainName,
      "destination": destination,
      "trainTime": trainTime,
      "frequency": frequency
    };

    database.ref().push(newTrain);

    //Clearing the values of the input
    $("#addTrain").val("");
    $("#addDestination").val("");
    $("#firstTrainTime").val("");
    $("#frequency").val("");
  });

  //When a child is added to the database or on a new page load to display the information in the table of the trains
  database.ref().on("child_added", function(childSnapshot){
    //All this to get the time to the next train and what time it will arrive at
    var hourStart = childSnapshot.val().trainTime;
    hourStart = parseInt(hourStart.substr(0,2));
    var minStart = childSnapshot.val().trainTime;
    minStart = parseInt(minStart.substr(minStart.length - 2, minStart.length - 1));
    var minTimeStart = (hourStart * 60) + minStart;

    var hourCurrent = moment().hour();
    var minCurrent = moment().minute();
    var minTimeCurrent = (hourCurrent * 60) + minCurrent;

    var timePastStart = minTimeCurrent - minTimeStart;
    var timeTillNext = parseInt(childSnapshot.val().frequency) - (timePastStart % parseInt(childSnapshot.val().frequency));

    var nextHour = hourCurrent;
    var nextMin = minCurrent + timeTillNext;
    if(nextMin >= 60){
      nextMin -= 60;
      nextHour++;
    }

    if(nextHour >= 24){
      nextHour = 0;
    }

    if(nextMin === 0){
      nextMin = "00";
    }
    
    var amPM = "AM";

    if(nextHour >= 12){
      amPM = "PM";
    }

    nextHour = nextHour % 12;
    if(nextHour === 0){
      nextHour = 12;
    }

    //Adding each child in the database to the table
    $(".trainsTable").append("<tr class='train" + trainCount + "'><td scope='col'>" + childSnapshot.val().trainName + 
        "</td><td scope='col'>" + childSnapshot.val().destination + 
        "</td><td scope='col'>" + childSnapshot.val().frequency + 
        "</td><td scope='col'>" + nextHour + ":" + nextMin + " " + amPM +
        "</td><td scope='col'>" + timeTillNext + "</td></tr>");

    //Adding one to the trainCount variable    
    trainCount++;
  });
});