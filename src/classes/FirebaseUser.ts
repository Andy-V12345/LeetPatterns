import { AppUser } from '@/interfaces/AppUser'
import {
	getFocusedPatternsFirestore,
	saveFocusedPatternsFirestore,
} from '@/utils/FirebaseFunctions'
import { Pattern } from '@/utils/Types'
import { redirect } from 'next/navigation'

export class FirebaseUser implements AppUser {
	private uid = process.env.TEST_USER_ID as string

	constructor(uid: string) {
		this.uid = uid
	}

	async getFocusedPatterns(): Promise<Pattern[]> {
		const focusedPatterns = await getFocusedPatternsFirestore(this.uid)

		if (focusedPatterns != null) {
			return Object.keys(focusedPatterns).filter(
				(pattern) => focusedPatterns[pattern]
			) as Pattern[]
		}

		return []
	}

	async saveFocusedPatterns(focusedPatterns: {
		[k: string]: boolean
	}): Promise<void> {
		await saveFocusedPatternsFirestore(this.uid, focusedPatterns)
		redirect('/practice')
	}
}
