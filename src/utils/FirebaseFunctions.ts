import { addDoc, doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './FirebaseConfig'

const FOCUSED_PATTERNS_COLLECTION = 'focusedPatterns'

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
