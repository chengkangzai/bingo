// https://www.obfuscator.io/
const firebaseConfig = {
    apiKey: "AIzaSyAfqVV60xtpvm6BKhp3y1Zc8hSh9UO5IkI",
    authDomain: "global-dominion-257804.firebaseapp.com",
    databaseURL: "https://global-dominion-257804.firebaseio.com",
    projectId: "global-dominion-257804",
    storageBucket: "global-dominion-257804.appspot.com",
    messagingSenderId: "47236666965",
    appId: "1:47236666965:web:1af37f74e46eb9ea2be6dc",
    measurementId: "G-ME1C4JNPSN"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function logout() {
    firebase.auth().signOut()
        .then(() => {
            localStorage.removeItem('userID');
            window.location.href = '../index.html';
        }).catch((error) => {
            console.log(error)
        });
}