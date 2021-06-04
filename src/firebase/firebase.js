import firebase from 'firebase/app';
import 'firebase/storage';

var firebaseConfig = {
  apiKey: 'AIzaSyA7P6Z18F8LbyluiDaWJt9jD7wXy4AZqnY',
  authDomain: 'nms-screens.firebaseapp.com',
  projectId: 'nms-screens',
  storageBucket: 'nms-screens.appspot.com',
  messagingSenderId: '449149620244',
  appId: '1:449149620244:web:89b5c5bff93d99aff5d701',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const storage = firebase.storage();
