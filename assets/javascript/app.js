// Initialize Firebase
var config = {
  apiKey: "AIzaSyBT4DLqy8oVxmxgEBRf_NrKt30FwV4Y_nY",
  authDomain: "train-schedules.firebaseapp.com",
  databaseURL: "https://train-schedules.firebaseio.com",
  storageBucket: "",
};
firebase.initializeApp(config);


// IMPORTANT!
// Don't for get to set security rules in Firebase to true for testing!!
//

var database = firebase.database();

// Inital global values
var trainName = "";
var destinationCity = "";
var destinationState = "";
var firstTrainTime = 0;
var trainFreq = 0;
var currentTime = moment();
// https://developers.google.com/maps/documentation/static-maps/intro
var apiKey = 'AIzaSyCaNuyDcmyKEnCO_dAadM5shT8mTBx8_ms';
var baseURL = 'https://maps.googleapis.com/maps/api/staticmap';
var center = '?center='
var zoom = '&zoom='

$('#currentTimeDisplay').html("Current time: " + moment(currentTime).format("hh:mm A"));

$('#addTrain').on('click', function() {

  trainName = $('#trainInput').val().trim();
  destinationCity = $('#destCityInput').val().trim();
  destinationState = $('#destStateInput').val().trim();
  firstTrainTime = $('#firstTimeInput').val().trim();
  trainFreq = $('#freqInput').val().trim();



  database.ref().push({
    train: trainName,
    destinationCity: destinationCity,
    destinationState: destinationState,
    firstTrainTime: firstTrainTime,
    frequency: trainFreq,
    dateAdded: firebase.database.ServerValue.TIMESTAMP

  })

  clearInputs();

  return false;
});

database.ref().on("child_added", function(snapshot) {
  // When a child is added to the database rebuild the table on the page

  var trainName = snapshot.val().train;
  var destinationCity = snapshot.val().destinationCity;
  var destinationState = snapshot.val().destinationState;
  var frequency = snapshot.val().frequency;
  var firstTime = snapshot.val().firstTrainTime;

  // Check to make sure the firstTime comes before current time
  var firstTimeConverted = moment(firstTime,"hh:mm").subtract(1, "years");

  console.log(firstTimeConverted);

  // What is the current time?
  var currentTime = moment();

  console.log("Current time is: " + moment(currentTime).format("hh:mm"));

  // Let's take the difference in times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("Difference in Time: " + diffTime);

  // Time apart
  var tRemainder = diffTime % frequency;
  console.log(tRemainder);

  // Minute until train
  var tMinutesTillTrain = frequency - tRemainder;
  console.log("Minutes till train: " + tMinutesTillTrain);

  // Next train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("Arrival time: " + moment(nextTrain).format("hh:mm"))

  $('#trainTable > tbody').append('<tr><td>' + trainName + '</td><td>' + destinationCity + ", " + destinationState + '</td><td>' + frequency + '</td><td>' + moment(nextTrain).format("hh:mm") + '</td><td>' + tMinutesTillTrain + '</td></tr>');

}, function(errorObject){
  console.log("Errors occured: " + errorObject.code);
});

// Function to clear out the input fieldset
function clearInputs() {

  $('#trainInput').val("");
  $('#destCityInput').val("");
  $('#destStateInput').val();
  $('#firstTimeInput').val("");
  $('#freqInput').val("");

};
