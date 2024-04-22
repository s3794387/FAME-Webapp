import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
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
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
// Import the functions you need from the SDKs you need
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBNS_F-e14KEHuJAezYZxnbbVC8twIHboc",
	authDomain: "esp32-fame.firebaseapp.com",
	databaseURL: "https://esp32-fame-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "esp32-fame",
	storageBucket: "esp32-fame.appspot.com",
	messagingSenderId: "517095421240",
	appId: "1:517095421240:web:4d1023ac677d6eff87bdcd",
	measurementId: "G-QEGTJRPM80"
};

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signInButton = document.getElementById('sign-in-btn');
const signOutButton = document.getElementById('sign-out-btn');

const accountDetails = document.getElementById('quickstart-account-details');

// Initialize Firebase

initializeApp(firebaseConfig);


// getting reference to the database
const database = getDatabase();

// getting reference to the authentication service
const auth = getAuth();



function toggleSignIn() {
	if (auth.currentUser) {
		signOut(auth);
	} else {
		const email = emailInput.value;
		const password = passwordInput.value;
		if (email.length < 4) {
			alert('Please enter an email address.');
			return;
		}
		if (password.length < 4) {
			alert('Please enter a password.');
			return;
		}
		// Sign in with email and pass.
		signInWithEmailAndPassword(auth, email, password).catch(function (error) {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			if (errorCode === 'auth/wrong-password') {
				alert('Wrong password.');
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
		accountDetails.textContent = JSON.stringify(user, null, '  ');
		$("#modal_trigger1").parent().hide();
		$("#modal_trigger1").leanModal({
			top: 100,
			overlay: 0.6,
			closeButton: ".modal_close",
			LoginStatus: "true"
		});
		$("#modal_trigger2").parent().show();

		//getting reference to the data we want
		var dataRef1 = ref(database, '/UsersData/' + uid + '/readings/Pen 1');
		//fetch the data
		onValue(dataRef1, (snapshot) => {
			var weight = snapshot.val();
			document.getElementById('weight').innerHTML = weight;
		})

	} else {
		// User is signed out.
		signInButton.textContent = 'Sign in';
		accountDetails.textContent = 'null';

		$("#modal_trigger1").parent().show();
		$("#modal_trigger2").parent().hide();
		$("#modal_trigger2").leanModal({
			top: 100,
			overlay: 0.6,
			closeButton: ".modal_close",
			LoginStatus: "true"
		});
	}
	signInButton.disabled = false;
});
signInButton.addEventListener('click', toggleSignIn, false);
signOutButton.addEventListener('click', toggleSignIn, false);