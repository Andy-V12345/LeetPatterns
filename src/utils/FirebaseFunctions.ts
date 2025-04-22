import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { increment } from 'firebase/firestore'
import { db } from './FirebaseConfig'
import { FirebaseUser } from '@/classes/FirebaseUser'
import { PatternStat } from '@/interfaces/PatternStat'
import { Pattern } from './Types'

const FOCUSED_PATTERNS_COLLECTION = 'focusedPatterns'
const USER_INFO_COLLECTION = 'users'
const PATTERN_STATS_COLLECTION = 'patternStats'

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

export async function updatePatternStatsFirestore(
	uid: string,
	pattern: Pattern,
	isCorrect: boolean
) {
	const docRef = doc(db, PATTERN_STATS_COLLECTION, uid)
	const docSnap = await getDoc(docRef)

	if (!docSnap.exists()) {
		await setDoc(docRef, {
			[`${pattern}`]: {
				correct: isCorrect ? 1 : 0,
				attempts: 1,
			},
		})
		return
	}

	await updateDoc(docRef, {
		[`${pattern as string}.correct`]: increment(isCorrect ? 1 : 0),
		[`${pattern as string}.attempts`]: increment(1),
	})
}

export async function getPatternStatsFirestore(
	uid: string
): Promise<PatternStat[]> {
	const docRef = doc(db, PATTERN_STATS_COLLECTION, uid)
	const docSnap = await getDoc(docRef)

	if (!docSnap.exists()) {
		return []
	}

	const data = docSnap.data()
	const patternStats: PatternStat[] = Object.entries(data).map(
		([pattern, stats]) =>
			({
				pattern,
				correct: stats.correct ?? 0,
				attempts: stats.attempts ?? 0,
			}) as PatternStat
	)

	return patternStats
}
