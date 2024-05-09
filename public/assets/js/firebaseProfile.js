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

const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const genderSelect = document.getElementById("genderSelect");
const commenceDate = document.getElementById("commenceDate");
const commentInput = document.getElementById("commentInput");
const editBtn = document.getElementById("editBtn");

onAuthStateChanged(auth, function (user) {
  if (user) {
    var dataRef = ref(database, "/UsersData/" + user.uid + "/UserInfo");
    onValue(dataRef, (snapshot) => {
      var user = snapshot.val();
      nameInput.value = user.Name;
      emailInput.value = user.Email;
      genderSelect.value = user.Gender;
      // document.getElementById("commenceDate").value = new Date(user.CommenceDate);
    });
  }
});

function edit() {
  nameInput.disabled = false;
  genderSelect.disabled = false;
  commentInput.disabled = false;
  editBtn.innerHTML = "Save";
  editBtn.addEventListener("click", save, true);
}
editBtn.addEventListener("click", edit, true);
