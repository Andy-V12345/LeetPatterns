import { addDoc, doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './FirebaseConfig'
import { FirebaseUser } from '@/classes/FirebaseUser'

const FOCUSED_PATTERNS_COLLECTION = 'focusedPatterns'
const USER_INFO_COLLECTION = 'users'

/**
 * Gets the focused patterns of a user
 * @param uid
 */
export async function getFocusedPatternsFirestore(
	uid: string
): Promise<{ [k: string]: boolean } | null> {
	const docRef = doc(db, FOCUSED_PATTERNS_COLLECTION, uid)
	const docSnap = await getDoc(docRef)

	if (docSnap.exists()) {
		return docSnap.data()
	}

	return null
}

/**
 * Saves focused patterns of a user to Firestore
 * @param uid
 * @param focusedPatterns
 */
export async function saveFocusedPatternsFirestore(
	uid: string,
	focusedPatterns: { [k: string]: boolean }
) {
	await setDoc(doc(db, FOCUSED_PATTERNS_COLLECTION, uid), focusedPatterns, {
		merge: true,
	})
}

export async function saveUserInfo(
	uid: string,
	firstName: string,
	lastName: string
) {
	await setDoc(
		doc(db, USER_INFO_COLLECTION, uid),
		{
			firstName: firstName,
			lastName: lastName,
		},
		{ merge: true }
	)
}

export async function getUserInfo(uid: string): Promise<FirebaseUser | null> {
	const docRef = doc(db, USER_INFO_COLLECTION, uid)
	const docSnap = await getDoc(docRef)

	if (docSnap.exists()) {
		const data = docSnap.data()
		return new FirebaseUser(uid, data.firstName, data.lastName)
	}

	return null
}
