import { AppUser } from '@/interfaces/AppUser'
import { Pattern } from '@/utils/Types'
import { redirect } from 'next/navigation'

export class LocalUser implements AppUser {
	async getFocusedPatterns(): Promise<Pattern[]> {
		if (typeof window !== 'undefined') {
			const storedFocusedPatterns =
				localStorage.getItem('focusedPatterns')

			if (storedFocusedPatterns) {
				const focusedPatterns = JSON.parse(storedFocusedPatterns)
				return Object.keys(focusedPatterns).filter(
					(pattern) => focusedPatterns[pattern]
				) as Pattern[]
			}
		}

		return []
	}

	async saveFocusedPatterns(focusedPatterns: {
		[k: string]: boolean
	}): Promise<void> {
		if (typeof window !== 'undefined') {
			localStorage.setItem(
				'focusedPatterns',
				JSON.stringify(focusedPatterns)
			)

			redirect('/practice')
		}
	}
}
