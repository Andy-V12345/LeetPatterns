import { AppUser } from '@/interfaces/AppUser'
import { PatternStat } from '@/interfaces/PatternStat'
import { Pattern } from '@/utils/Types'
import { redirect } from 'next/navigation'

export class LocalUser implements AppUser {
	async updatePatternStats(
		pattern: Pattern,
		isCorrect: boolean
	): Promise<void> {
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem('localPatternStats')
			const existingStats: PatternStat[] = stored
				? JSON.parse(stored)
				: []

			const existingIndex = existingStats.findIndex(
				(stat) => stat.pattern === pattern
			)

			if (existingIndex !== -1) {
				const stat = existingStats[existingIndex]
				existingStats[existingIndex] = {
					...stat,
					correct: stat.correct + (isCorrect ? 1 : 0),
					attempts: stat.attempts + 1,
				}
			} else {
				existingStats.push({
					pattern,
					correct: isCorrect ? 1 : 0,
					attempts: 1,
				})
			}

			localStorage.setItem(
				'localPatternStats',
				JSON.stringify(existingStats)
			)
		}
	}

	async getFocusedPatterns(): Promise<Pattern[] | null> {
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

		return null
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
