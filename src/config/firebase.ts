const admin = require('firebase-admin');
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithCredential, GoogleAuthProvider } = require('firebase/auth');
const { getDownloadURL, ref, uploadBytes, getStorage, uploadString } = require('firebase/storage');
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
require('dotenv').config();

const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: 'hhkw-82760.firebaseapp.com',
	projectId: 'hhkw-82760',
	storageBucket: 'hhkw-82760.appspot.com',
	messagingSenderId: '364930357148',
	appId: '1:364930357148:web:b1d0b26427cc00410c5a59',
	measurementId: 'G-JNH5888QT0',
};
const serviceAccount = {
	type: 'service_account',
	project_id: 'hhkw-82760',
	private_key_id: 'b31c707afce51b7077c75d5aed37182768e34c75',
	private_key: process.env.FIREBASE_PRIVATE_KEY,
	client_email: 'firebase-adminsdk-gfq2s@hhkw-82760.iam.gserviceaccount.com',
	client_id: '114887713785650226064',
	auth_uri: 'https://accounts.google.com/o/oauth2/auth',
	token_uri: 'https://oauth2.googleapis.com/token',
	auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
	client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-gfq2s%40hhkw-82760.iam.gserviceaccount.com',
	universe_domain: 'googleapis.com',
};
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://hhkw-82760-default-rtdb.europe-west1.firebasedatabase.app',
});

const db = admin.database();
const firestore = getFirestore();
const firebaseAPP = initializeApp(firebaseConfig);
const auth = admin.auth();
const storage = getStorage(firebaseAPP);

export { db, auth, storage, signInWithCredential, GoogleAuthProvider, getDownloadURL, ref, uploadBytes, uploadString, firebaseAPP, Timestamp, firestore };
