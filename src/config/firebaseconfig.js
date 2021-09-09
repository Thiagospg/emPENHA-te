import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBhhUCTXmHyW1S3IqzFVRg4hGlvU69IXzs",
  authDomain: "empenha-te.firebaseapp.com",
  projectId: "empenha-te",
  storageBucket: "empenha-te.appspot.com",
  messagingSenderId: "369592394902",
  appId: "1:369592394902:web:f32a6d2b40e575ac97ceb7"
};

firebase.initializeApp(firebaseConfig);

export default firebase;

