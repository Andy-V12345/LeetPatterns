import { deleteField, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { increment } from 'firebase/firestore'
import { db } from './FirebaseConfig'
import { FirebaseUser } from '@/classes/FirebaseUser'
import { Pattern } from './Types'
import { PrevSession } from '@/interfaces/PrevSession'
import { areConsecutiveDays, getWeakest } from './UtilFunctions'
import { Note } from '@/interfaces/Note'
import Stat from '@/interfaces/Stat'

const FOCUSED_PATTERNS_COLLECTION = 'focusedPatterns'
const USER_INFO_COLLECTION = 'users'
const PATTERN_STATS_COLLECTION = 'patternStats'
const PREV_SESSION_COLLECTION = 'prevSessions'
const STREAKS_COLLECTION = 'streaks'
const NOTES_COLLECTION = 'notes'

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
): Promise<Stat<Pattern>[]> {
	const docRef = doc(db, PATTERN_STATS_COLLECTION, uid)
	const docSnap = await getDoc(docRef)

	if (!docSnap.exists()) {
		return []
	}

	const data = docSnap.data()
	const patternStats: Stat<Pattern>[] = Object.entries(data).map(
		([pattern, stats]) =>
			({
				name: pattern,
				correct: stats.correct ?? 0,
				attempts: stats.attempts ?? 0,
			}) as Stat<Pattern>
	)

	return patternStats
}

export async function getPrevSessionFirestore(
	uid: string
): Promise<PrevSession | null> {
	const docRef = doc(db, PREV_SESSION_COLLECTION, uid)
	const docSnap = await getDoc(docRef)

	if (docSnap.exists()) {
		const data = docSnap.data()
		const prevSession: PrevSession = {
			patternStats: data.patternStats.map((stat: any) => ({
				name: stat.pattern,
				correct: stat.correct,
				attempts: stat.attempts,
			})),
			weakPatterns: data.weakPatterns,
			focusedPatterns: data.focusedPatterns,
		}

		return prevSession
	}

	return null
}

export async function setPrevSession(
	uid: string,
	focusedPatterns: Pattern[],
	patternStats: Stat<Pattern>[]
) {
	const docRef = doc(db, PREV_SESSION_COLLECTION, uid)
	await setDoc(
		docRef,
		{
			weakPatterns: getWeakest(patternStats),
			patternStats: patternStats.map((stat) => ({
				pattern: stat.name,
				correct: stat.correct,
				attempts: stat.attempts,
			})),
			focusedPatterns: focusedPatterns,
		},
		{
			merge: true,
		}
	)
}

export async function setStreakFirestore(uid: string, date: string) {
	const docRef = doc(db, STREAKS_COLLECTION, uid)
	const docSnap = await getDoc(docRef)

	if (docSnap.exists()) {
		const data = docSnap.data()
		const { curStreak, lastDate, longestStreak } = data

		const isConsecutive = areConsecutiveDays(
			new Date(date),
			new Date(lastDate)
		)

		if (isConsecutive == 1) {
			// consecutive days
			const newStreak = curStreak + 1
			const newLongest = Math.max(newStreak, longestStreak)

			await updateDoc(docRef, {
				curStreak: newStreak,
				lastDate: date,
				longestStreak: newLongest,
			})
		} else if (isConsecutive == -1) {
			// non consecutive days
			const newLongest = Math.max(curStreak, longestStreak)

			await updateDoc(docRef, {
				curStreak: 1,
				lastDate: date,
				longestStreak: newLongest,
			})
		}
	} else {
		await setDoc(docRef, {
			curStreak: 1,
			lastDate: date,
			longestStreak: 1,
		})
	}
}

export async function getStreakFirestore(uid: string): Promise<{
	longestStreak: number
	curStreak: number
}> {
	const docRef = doc(db, STREAKS_COLLECTION, uid)
	const docSnap = await getDoc(docRef)

	if (docSnap.exists()) {
		const data = docSnap.data()

		return {
			longestStreak: data.longestStreak,
			curStreak: data.curStreak,
		}
	}

	return {
		longestStreak: 0,
		curStreak: 0,
	}
}

export async function saveNoteFirestore(uid: string, note: Note) {
	const docRef = doc(db, NOTES_COLLECTION, uid)

	await setDoc(
		docRef,
		{
			[`${note.pattern}`]: {
				pattern: note.pattern,
				text: note.text,
			},
		},
		{
			merge: true,
		}
	)
}

export async function getNotesFirestore(uid: string): Promise<Note[]> {
	const docRef = doc(db, NOTES_COLLECTION, uid)
	const docSnap = await getDoc(docRef)

	if (!docSnap.exists()) {
		return []
	}

	const data = docSnap.data() as { [key: string]: Note }
	const notes: Note[] = []

	// Iterate through each key in the document's data.
	for (const key in data) {
		if (data.hasOwnProperty(key)) {
			notes.push(data[key])
		}
	}

	// Sort alphabetically by pattern name.
	notes.sort((a, b) => a.pattern.localeCompare(b.pattern))

	return notes
}

export async function deleteNoteFirestore(uid: string, note: Note) {
	const docRef = doc(db, NOTES_COLLECTION, uid)

	// Check if the document exists before updating
	const docSnap = await getDoc(docRef)
	if (!docSnap.exists()) {
		return
	}

	// Delete the note by setting its field value to a delete sentinel.
	await updateDoc(docRef, {
		[`${note.pattern}`]: deleteField(),
	})
}
