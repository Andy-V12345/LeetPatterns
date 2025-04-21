import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: 'leetpatterns.firebaseapp.com',
	projectId: 'leetpatterns',
	storageBucket: 'leetpatterns.firebasestorage.app',
	messagingSenderId: '116829189582',
	appId: '1:116829189582:web:1019428d776c95a3b3a79f',
	measurementId: 'G-RMRDV8FFWY',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
