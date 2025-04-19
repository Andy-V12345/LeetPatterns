import { redirect } from 'next/navigation'
import { Pattern } from './Types'

export function saveFocusedPatterns(focusedPatterns: {
	[k: string]: boolean
}): void {
	// for now save to local storage
	if (typeof window !== 'undefined') {
		localStorage.setItem('focusedPatterns', JSON.stringify(focusedPatterns))

		redirect('/practice')
	}
}

export function getFocusedPatterns(): Pattern[] {
	// for now pull from local storage
	if (typeof window !== 'undefined') {
		const storedFocusedPatterns = localStorage.getItem('focusedPatterns')

		if (storedFocusedPatterns) {
			const focusedPatterns = JSON.parse(storedFocusedPatterns)
			return Object.keys(focusedPatterns).filter(
				(pattern) => focusedPatterns[pattern]
			) as Pattern[]
		}
	}

	return []
}
