import { AppUser } from '@/interfaces/AppUser'
import { PatternStat } from '@/interfaces/PatternStat'
import { PrevSession } from '@/interfaces/PrevSession'
import { ProfileInfo } from '@/interfaces/ProfileInfo'
import { Pattern } from '@/utils/Types'
import { getWeakPatterns } from '@/utils/UtilFunctions'
import { redirect } from 'next/navigation'

export class LocalUser implements AppUser {
	getProfileInfo(): ProfileInfo | null {
		return null
	}

	async savePrevSession(
		focusedPatterns: Pattern[],
		patternStats: PatternStat[]
	): Promise<void> {
		if (typeof window !== 'undefined') {
			const weakPatterns = getWeakPatterns(patternStats)
			const prevSession: PrevSession = {
				focusedPatterns,
				weakPatterns,
				patternStats,
			}
			localStorage.setItem('prevSession', JSON.stringify(prevSession))
		}
	}

	async getPrevSession(): Promise<PrevSession | null> {
		if (typeof window !== 'undefined') {
			const storedSession = localStorage.getItem('prevSession')
			if (storedSession) {
				try {
					const prevSession: PrevSession = JSON.parse(storedSession)

					return prevSession
				} catch (error) {
					return null
				}
			}
		}

		return null
	}

	async getPatternStats(): Promise<PatternStat[] | null> {
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem('localPatternStats')
			const existingStats: PatternStat[] = stored
				? JSON.parse(stored)
				: []

			return existingStats
		}

		return null
	}

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
