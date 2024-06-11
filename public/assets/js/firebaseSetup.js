import { app } from "./firebaseInit.js";

import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
// Import the functions you need from the SDKs you need
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// getting reference to the authentication service
const auth = getAuth();
// getting reference to the database
const database = getDatabase();
const user = auth.currentUser;
var currentPen = 0;
var errorPen = 0;
var start = false;
var nextBtn = false;
var error = false;
var errorSound = new Audio("./assets/audio/8-bit-error.wav");
var successSound = new Audio("./assets/audio/success.wav");

const NextButton = document.getElementById("next-button");

var pens_weight = { 1: 0, 2: 0, 3: 0, 4: 0 };
var currentPen = 0;

onAuthStateChanged(auth, function (user) {
  if (user) {
    var dataRef = ref(database, "/UsersData/" + user.uid + "/Readings");
    onValue(dataRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const pen = childSnapshot.key;
        const weight = childSnapshot.val();
        pens_weight[pen] = weight;
      });

      if (currentPen == 0 && !nextBtn) {
        document.getElementById("instruction").innerHTML = `
                <h3 style="color: red">
                  Please disconnect the casing from power and remove all pens.
                </h3>`;
      }

      // User Error Detection
      if (currentPen != 0) {
        for (var pen in pens_weight) {
          if (pens_weight[pen] > 1 && pen > currentPen) {
            error = true;
            errorSound.play();
            errorPen = pen;
            document.getElementById("instruction").innerHTML =
              '<h3 style="color: #FF0000;">You have placed the pen in the wrong hole, please remove Pen in hole number ' +
              errorPen +
              ".</h3>";
          }
          if (error && pen > currentPen && pens_weight[errorPen] < 1) {
            error = false;
          }

          if (pens_weight[pen] < 1 && pen < currentPen) {
            error = true;
            errorSound.play();

            errorPen = pen;
            document.getElementById("instruction").innerHTML =
              '<h4 style="color: #FF0000;">You have picked up the wrong pen, please return Pen ' +
              errorPen +
              " in hole number " +
              errorPen +
              ".</h4>";
          }
          if (error && pen < currentPen && pens_weight[errorPen] > 1) {
            error = false;
          }
        }
      }
      if (start) {
        currentPen++;
        start = false;
      }
      // Main Setup Process
      if (currentPen != 0 && currentPen < 5 && !error) {
        place();
      } else if (!error && currentPen == 5) {
        showComplete();
      }
    });
  }
});

function place() {
  instruction_place(currentPen);
  if (pens_weight[currentPen] > 10) {
    currentPen++;
  }
}

function instruction_place(pen) {
  document.getElementById("instruction").innerHTML =
    `<h3 style="color: red">Place pen labled number ` +
    currentPen +
    " in hole number " +
    currentPen +
    " with the cap facing downwards.</h3>";
}

function startSetup() {
  $("#next-button").hide();
  start = true;
}

function showComplete() {
  document.getElementById(
    "instruction"
  ).innerHTML = `<h3 style="color: red">Congratulations! You have completed setting up your casing.</h3>`;
  NextButton.innerHTML = `<a href="training.html">Start Training</a>`;
  $("#next-button").show();
  successSound.play();
}
function next() {
  nextBtn = true;
  document.getElementById("instruction").innerHTML = `
                <h2><em>Step 2</em></h2>
                <h3 style="color: red">
                  Use the included cable to connect the Casing to a power souce. It can be plugged into the USB port of a computer or any brick charger.
                </h3>
                `;
  NextButton.innerHTML = "Start Setup";
  NextButton.addEventListener("click", startSetup, false);
}

NextButton.addEventListener("click", next, false);
