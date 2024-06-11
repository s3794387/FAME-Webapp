import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  update,
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
var progress = {};
const today = new Date();
var commenceDate;

function updateCalendar() {
  for (var date in progress) {
    if (
      progress[date]["Morning"]["Finished"] &&
      progress[date]["Evening"]["Finished"]
    ) {
      markGreen(new Date(date));
    } else {
      markRed(new Date(date));
    }
  }
}
onAuthStateChanged(auth, function (user) {
  if (user) {
    var dataRef1 = ref(database, "/UsersData/" + user.uid + "/Progress");
    var dataRef2 = ref(database, "/UsersData/" + user.uid + "/UserInfo");
    onValue(dataRef2, (snapshot) => {
      if (snapshot.exists()) {
        commenceDate = new Date(snapshot.val().CommenceDate);
      } else {
        console.log("No data available");
      }
    });

    onValue(dataRef1, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        var date = new Date(childSnapshot.key);
        progress[date] = childSnapshot.val();
      });
      for (
        let dateIndex = commenceDate;
        dateIndex < today;
        dateIndex.setDate(dateIndex.getDate() + 1)
      ) {
        if (!progress[dateIndex]) {
          update(dataRef1, {
            [dateIndex
              .toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
              .replace(/\//g, "-")]: {
              Morning: { Finished: false },
              Evening: { Finished: false },
            },
          });
        }
      }
      updateCalendar();
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
  if (x.length) {
    x[0].classList.add("specialRed");
  }
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
  if (x.length) {
    x[0].classList.add("specialGreen");
  }
}

$("#calendar").datetimepicker({
  inline: true,
  format: "L",
  sideBySide: true,
});
$(function () {
  $("#calendar").on("update.datetimepicker", function (e) {
    updateCalendar();
  });
});
$(function () {
  $("#calendar").on("change.datetimepicker", function (e) {
    var selectedDate = new Date(e.date._d.setHours(0, 0, 0, 0));
    document.getElementById("date").innerHTML =
      selectedDate.toLocaleDateString("en-AU");
    var day = progress[selectedDate];
    updateCalendar();
    if (day) {
      document.getElementById("morning").innerHTML = day.Morning.Finished
        ? "Finished at " + day.Morning.TimeStamp
        : "Not Finished";
      document.getElementById("evening").innerHTML = day.Evening.Finished
        ? "Finished at " + day.Evening.TimeStamp
        : "Not Finished";
    } else {
      document.getElementById("morning").innerHTML = "";
      document.getElementById("evening").innerHTML = "";
    }
  });
});
