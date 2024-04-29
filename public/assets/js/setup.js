import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
// Import the functions you need from the SDKs you need
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// getting reference to the authentication service
const auth = getAuth();
// getting reference to the database
const database = getDatabase();
const user = auth.currentUser;

var pens_weight = { 1: 0, 2: 0, 3: 0, 4: 0 };
var currentPen = 0;


onAuthStateChanged(auth, function (user) {
    if (user) {
        var dataRef = ref(database, '/UsersData/' + user.uid + '/Readings');
        onValue(dataRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const pen = childSnapshot.key;
                const weight = childSnapshot.val();
                pens_weight[pen] = weight;
            })
        })
    }
})