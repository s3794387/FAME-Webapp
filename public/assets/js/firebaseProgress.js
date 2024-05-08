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
var progress = {};

function updateCalendar() {
  for (var date in progress) {
    if (
      progress[date]["Morning"] == "Finished" &&
      progress[date]["Evening"] == "Finished"
    ) {
      markGreen(new Date(date));
    } else {
      markRed(new Date(date));
    }
  }
}
onAuthStateChanged(auth, function (user) {
  if (user) {
    var dataRef = ref(database, "/UsersData/" + user.uid + "/Progress");
    onValue(dataRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        var date = new Date(childSnapshot.key);
        progress[date] = childSnapshot.val();
        if (
          progress[date]["Morning"] == "Finished" &&
          progress[date]["Evening"] == "Finished"
        ) {
          markGreen(date);
        } else {
          markRed(date);
        }
      });
    });
  }
});

function markRed(date) {
  let path =
    '[data-day="' +
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }) +
    '"]';
  let x = $(path);
  x[0].classList.add("specialRed");
}

function markGreen(date) {
  let path =
    '[data-day="' +
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }) +
    '"]';
  let x = $(path);
  x[0].classList.add("specialGreen");
}

$("#calendar").datetimepicker({
  inline: true,
  format: "L",
  sideBySide: true,
});
$(function () {
  $("#calendar").on("change.datetimepicker", function (e) {
    var selectedDate = new Date(e.date._d.setHours(0, 0, 0, 0));
    document.getElementById("date").innerHTML =
      selectedDate.toLocaleDateString("en-AU");
    var today = progress[selectedDate];
    updateCalendar();
    if (today) {
      document.getElementById("morning").innerHTML = today.Morning;
      document.getElementById("evening").innerHTML = today.Evening;
    } else {
      document.getElementById("morning").innerHTML = "";
      document.getElementById("evening").innerHTML = "";
    }
  });
});
document.body.addEventListener("click", updateCalendar(), true); 
