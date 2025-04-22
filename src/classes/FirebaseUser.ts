import { AppUser } from '@/interfaces/AppUser'
import { PatternStat } from '@/interfaces/PatternStat'
import {
	getFocusedPatternsFirestore,
	saveFocusedPatternsFirestore,
	updatePatternStatsFirestore,
} from '@/utils/FirebaseFunctions'
import { Pattern } from '@/utils/Types'
import { redirect } from 'next/navigation'

export class FirebaseUser implements AppUser {
	private uid = process.env.TEST_USER_ID as string
	private firstName: string
	private lastName: string

	constructor(uid: string, firstName: string, lastName: string) {
		this.uid = uid
		this.firstName = firstName
		this.lastName = lastName
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
