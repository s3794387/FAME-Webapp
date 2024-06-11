import { app } from "./firebaseInit.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
// Import the functions you need from the SDKs you need
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const pens_type = { 1: "Mint", 2: "Thyme", 3: "Mandarin", 4: "Jasmine" };
var pens_weight = { 1: 0, 2: 0, 3: 0, 4: 0 };
var currentPen = 0;
var currentWeight = 0;
const NextButton = document.getElementById("next-button");
const BeginButton = document.getElementById("begin-button");
var proceed = false;
var error = false;
var errorPen = 0;
var timerStarted = false;
var timerPaused = false;
var today = new Date();
var errorSound = new Audio("./assets/audio/8-bit-error.wav");

var dateUS = today
  .toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
  .replace(/\//g, "-");

// getting reference to the authentication service
const auth = getAuth();
// getting reference to the database
const database = getDatabase();
const user = auth.currentUser;
var dataRef2;

onAuthStateChanged(auth, function (user) {
  if (user) {
    alert("Traning has started...");
    var dataRef1 = ref(database, "/UsersData/" + user.uid + "/Readings");
    dataRef2 = ref(database, "/UsersData/" + user.uid + "/Progress/" + dateUS);
    onValue(dataRef1, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const pen = childSnapshot.key;
        const weight = childSnapshot.val();
        pens_weight[pen] = weight;
      });
      // Initial Check
      if (currentPen == 0) {
        initialCheck();
        if (!error) {
          currentPen++;
        }
      }
      // User Error Detection
      for (var pen in pens_weight) {
        if (pens_weight[pen] < 10 && pen != currentPen) {
          error = true;
          errorPen = pen;

          if (!timerPaused) {
            pauseTimer();
            errorSound.play();
            timerPaused = true;
          }
          document.getElementById("training_instruction").innerHTML =
            '<h4 style="color: #FF0000;">You have picked up the wrong pen, please put Pen ' +
            errorPen +
            " back.</h4>";
          $("#training").hide();
        }
        if (error && pens_weight[errorPen] > 10) {
          error = false;
          timerStarted = false;
          timerPaused = false;
        }
      }

      // Main Training Process
      if (currentPen != 0 && currentPen < 5 && !error) {
        if (!proceed) {
          pickUp();
        } else {
          place();
        }
      } else if (!error && currentPen == 5) {
        showComplete();
        logProgress();
      }
    });
    set(dataRef2, {
      Morning: "",
      Evening: "",
    });
  }

  //Do sth if user not Logged in
  else {
  }
});

// Check if all the pens are in the correct place
function initialCheck() {
  for (var pen in pens_weight) {
    if (pens_weight[pen] < 10) {
      error = true;
      errorPen = pen;
      document.getElementById("training_instruction").innerHTML =
        '<h3 style="color: #FF0000;">You have picked up the wrong pen, please put Pen ' +
        errorPen +
        " back.</h3>";
    }
  }
}
// Main functions for the training process
function pickUp() {
  $("#training").hide();
  instruction_pickup(currentPen);
  if (pens_weight[currentPen] < 10) {
    instruction_hold(currentPen);
  }
}
function place() {
  $("#training").hide();
  instruction_place(currentPen);
  if (pens_weight[currentPen] > 10) {
    currentPen++;
    proceed = false;
  }
}
function showComplete() {
  $("#training").hide();
  document.getElementById("training_instruction").innerHTML =
    "Congratulations! You have completed the training.";
}

function logProgress() {
  today = new Date();
  today.getHours <= 14
    ? set(dataRef2, {
        Morning: {
          Finished: true,
          TimeStamp: today.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        },
      })
    : set(dataRef2, {
        Evening: {
          Finished: true,
          TimeStamp: today.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        },
      });
}

// Display Next Image
function next() {
  timerStarted = false;
  proceed = true;
}

// Send Instruction for the User to Pickup the Pen
function instruction_pickup(pen) {
  document.getElementById("training_instruction").innerHTML =
    "Please pick up <em> Pen " + pen + "<em>";
}

// Send Instruction for the User to Hold the Pen
function instruction_hold(pen) {
  document.getElementById("training_instruction").innerHTML =
    "Intentionally inhale for 15 seconds. Click Next when done.";

  $("#training").show();
  document.getElementById("training-image").src =
    "./assets/images/" + pens_type[currentPen] + ".jpg";
  document.getElementById("image-title").innerHTML =
    "<em>" + pens_type[pen] + "<em>";
  $("#next-button").show();
  $("#base-timer").show();
  if (!timerStarted) {
    startTimer(newTimeLimit);
    timerStarted = true;
  }
}

// Send Instruction for the User to Place the Pen
function instruction_place(pen) {
  document.getElementById("training_instruction").innerHTML =
    "Close the cap and place it back in hole " + currentPen;
}

// Add Event Listener
NextButton.addEventListener("click", next, false);

export { user };
