/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
import '../public/style.css';
import firebase from 'firebase/app';
import 'firebase/analytics';

var firebaseConfig = {
  apiKey: 'AIzaSyCR-DbShxSqAe9gAVEwoZxpbbs8ofEwFxo',
  authDomain: 'benknight-website.firebaseapp.com',
  databaseURL: 'https://benknight-website.firebaseio.com',
  projectId: 'benknight-website',
  storageBucket: 'benknight-website.appspot.com',
  messagingSenderId: '46618137938',
  appId: '1:46618137938:web:80bebcd66c8ed7aa04d68b',
  measurementId: 'G-3436TME345',
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
