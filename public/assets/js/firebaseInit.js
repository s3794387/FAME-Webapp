import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  getDatabase,
  ref,update,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
// Import the functions you need from the SDKs you need
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyBNS_F-e14KEHuJAezYZxnbbVC8twIHboc",
  authDomain: "esp32-fame.firebaseapp.com",
  databaseURL:
    "https://esp32-fame-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "esp32-fame",
  storageBucket: "esp32-fame.appspot.com",
  messagingSenderId: "517095421240",
  appId: "1:517095421240:web:4d1023ac677d6eff87bdcd",
  measurementId: "G-QEGTJRPM80",
};

var app = initializeApp(firebaseConfig);
// getting reference to the authentication service
const auth = getAuth();
// getting reference to the database
const database = getDatabase();

onAuthStateChanged(auth, function (user) {
  if (user) {
    var dataRef1 = ref(database, "/UsersData/" + user.uid + "/UserInfo");
    var dataRef2 = ref(database, "/UsersData/" + user.uid + "/Progress");
/*     update(dataRef1, {
      Name: "Quy Dat Le",
      Email: "quydat1711@gmail.com",
      DoB: "17/11/1998",
      Gender: "Male",
      SniffSet: "2",
      CommenceDate: "04/30/2024",
    }); */
    update(dataRef2, {
      "05-03-2024": {
        Morning: { Finished: true, TimeStamp: "09:55:12" },
        Evening: { Finished: true, TimeStamp: "17:35:43" },
      },
      "05-04-2024": {
        Morning: { Finished: true, TimeStamp: "08:30:12" },
        Evening: { Finished: true, TimeStamp: "19:35:43" },
      },
      "05-05-2024": {
        Morning: { Finished: false, TimeStamp: "" },
        Evening: { Finished: true, TimeStamp: "20:30:43" },
      },
      "05-06-2024": {
        Morning: { Finished: false, TimeStamp: "" },
        Evening: { Finished: false, TimeStamp: "" },
      },
      "05-07-2024": {
        Morning: { Finished: true, TimeStamp: "09:20:11" },
        Evening: { Finished: false, TimeStamp: "" },
      },
      "05-08-2024": {
        Morning: { Finished: true, TimeStamp: "08:40:00" },
        Evening: { Finished: true, TimeStamp: "17:45:33" },
      },
      "05-09-2024": {
        Morning: { Finished: false, TimeStamp: "" },
        Evening: { Finished: true, TimeStamp: "17:45:33" },
      },
      "05-10-2024": {
        Morning: { Finished: true, TimeStamp: "08:40:00" },
        Evening: { Finished: true, TimeStamp: "17:45:33" },
      },
      "05-11-2024": {
        Morning: { Finished: true, TimeStamp: "08:40:00" },
        Evening: { Finished: true, TimeStamp: "17:45:33" },
      },
      "05-12-2024": {
        Morning: { Finished: true, TimeStamp: "08:40:00" },
        Evening: { Finished: true, TimeStamp: "17:45:33" },
      },
      "05-13-2024": {
        Morning: { Finished: true, TimeStamp: "08:40:00" },
        Evening: { Finished: true, TimeStamp: "17:45:33" },
      },
      "05-14-2024": {
        Morning: { Finished: true, TimeStamp: "08:40:00" },
        Evening: { Finished: true, TimeStamp: "17:45:33" },
      },
    });
  }
});
export { app };
