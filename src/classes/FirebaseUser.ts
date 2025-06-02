import { AppUser } from '@/interfaces/AppUser'
import { Note } from '@/interfaces/Note'
import { PrevSession } from '@/interfaces/PrevSession'
import { ProfileInfo } from '@/interfaces/ProfileInfo'
import Stat from '@/interfaces/Stat'
import {
	deleteNoteFirestore,
	getFocusedPatternsFirestore,
	getNotesFirestore,
	getPatternStatsFirestore,
	getPrevSessionFirestore,
	getStreakFirestore,
	saveFocusedPatternsFirestore,
	saveNoteFirestore,
	setPrevSession,
	setStreakFirestore,
	updatePatternStatsFirestore,
} from '@/utils/FirebaseFunctions'
import { Pattern } from '@/utils/Types'
import { User } from 'firebase/auth'
import { redirect } from 'next/navigation'

export class FirebaseUser implements AppUser {
	private uid = process.env.TEST_USER_ID as string
	private firstName: string
	private lastName: string
	private firebaseUser: User | null = null

	constructor(uid: string, firstName: string, lastName: string) {
		this.uid = uid
		this.firstName = firstName
		this.lastName = lastName
	}

	async getTokenId(): Promise<string> {
		if (this.firebaseUser) {
			return await this.firebaseUser.getIdToken()
		}
		return ''
	}

	async deleteNote(note: Note): Promise<void> {
		await deleteNoteFirestore(this.uid, note)
	}

	async saveNote(note: Note): Promise<void> {
		await saveNoteFirestore(this.uid, note)
	}

	async getNotes(): Promise<Note[]> {
		return await getNotesFirestore(this.uid)
	}

	async updateStreak(): Promise<void> {
		const curDate = new Date()
		await setStreakFirestore(this.uid, curDate.toISOString())
	}
	async getStreak(): Promise<{ longestStreak: number; curStreak: number }> {
		return await getStreakFirestore(this.uid)
	}

	setFirebaseUser(user: User) {
		this.firebaseUser = user
	}

	getProfileInfo(): ProfileInfo | null {
		if (this.firebaseUser) {
			return {
				firstName: this.firstName,
				lastName: this.lastName,
				email: this.firebaseUser.email,
				photoUrl: this.firebaseUser.photoURL,
			} as ProfileInfo
		}

		return null
	}

	async savePrevSession(
		focusedPatterns: Pattern[],
		patternStats: Stat<Pattern>[]
	): Promise<void> {
		await setPrevSession(this.uid, focusedPatterns, patternStats)
	}

	async getPrevSession(): Promise<PrevSession | null> {
		return await getPrevSessionFirestore(this.uid)
	}

	async getPatternStats(): Promise<Stat<Pattern>[] | null> {
		return await getPatternStatsFirestore(this.uid)
	}

	async updatePatternStats(
		pattern: Pattern,
		isCorrect: boolean
	): Promise<void> {
		await updatePatternStatsFirestore(this.uid, pattern, isCorrect)
	}

	async getFocusedPatterns(): Promise<Pattern[] | null> {
		const focusedPatterns = await getFocusedPatternsFirestore(this.uid)

		if (focusedPatterns != null) {
			return Object.keys(focusedPatterns).filter(
				(pattern) => focusedPatterns[pattern]
			) as Pattern[]
		}

		return null
	}

	async saveFocusedPatterns(focusedPatterns: {
		[k: string]: boolean
	}): Promise<void> {
		await saveFocusedPatternsFirestore(this.uid, focusedPatterns)
		redirect('/practice')
	}
}
