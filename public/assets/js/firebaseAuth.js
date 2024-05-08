import { app } from "./firebaseInit.js";
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signInButton = document.getElementById("sign-in-btn");
const signOutButton = document.getElementById("sign-out-btn");
const accountDetails = document.getElementById("quickstart-account-details");

// getting reference to the authentication service
const auth = getAuth();

function toggleSignIn() {
  if (auth.currentUser) {
    signOut(auth);
  } else {
    const email = emailInput.value;
    const password = passwordInput.value;
    if (email.length < 4) {
      alert("Please enter an email address.");
      return;
    }
    if (password.length < 4) {
      alert("Please enter a password.");
      return;
    }
    // Sign in with email and pass.
    signInWithEmailAndPassword(auth, email, password).catch(function (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === "auth/wrong-password") {
        alert("Wrong password.");
      } else {
        alert(errorMessage);
      }
      console.log(error);
      signInButton.disabled = false;
    });
  }
  signInButton.disabled = true;
}

onAuthStateChanged(auth, function (user) {
  if (user) {
    // User is signed in.
    const displayName = user.displayName;
    const email = user.email;
    const emailVerified = user.emailVerified;
    const photoURL = user.photoURL;
    const isAnonymous = user.isAnonymous;
    const uid = user.uid;
    const providerData = user.providerData;
    accountDetails.textContent = JSON.stringify(user, null, "  ");
    $("#sign_in_modal_trigger").parent().hide();
    $("#sign_in_modal_trigger").leanModal({
      top: 100,
      overlay: 0.6,
      closeButton: ".modal_close",
      LoginStatus: "true",
    });
    $("#sign_out_modal_trigger").parent().show();
  } else {
    // User is signed out.
    signInButton.textContent = "Sign in";
    accountDetails.textContent = "null";

    $("#sign_in_modal_trigger").parent().show();
    $("#sign_out_modal_trigger").parent().hide();
    $("#sign_out_modal_trigger").leanModal({
      top: 100,
      overlay: 0.6,
      closeButton: ".modal_close",
      LoginStatus: "true",
    });
  }
  signInButton.disabled = false;
});
signInButton.addEventListener("click", toggleSignIn, false);
signOutButton.addEventListener("click", toggleSignIn, false);
