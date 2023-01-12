import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


function StartFirebase(){
    const firebaseConfig = {
    apiKey: "AIzaSyA38KWleQXz95u_WDRICUX-8ZTaz-jJmDs",
    authDomain: "cira-copy.firebaseapp.com",
    databaseURL: "https://cira-copy-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "cira-copy",
    storageBucket: "cira-copy.appspot.com",
    messagingSenderId: "941007405098",
    appId: "1:941007405098:web:ba0063b4d4496738774353"
    };

    const app = initializeApp(firebaseConfig);


    return getDatabase(app);

}



export default StartFirebase;


