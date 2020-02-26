import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/database";

firebase.initializeApp({
	apiKey: "AIzaSyAjW4KFiW22VEcOr4m6bTF4Ugiq6P2CM48",
	authDomain: "onboard-workflow.firebaseapp.com",
	databaseURL: "https://onboard-workflow.firebaseio.com",
	projectId: "onboard-workflow",
	storageBucket: "onboard-workflow.appspot.com",
	messagingSenderId: "74669444264",
	appId: "1:74669444264:web:86993c08f6076b74f4069d"
});

export { firebase };
