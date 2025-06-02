import { AppUser } from '@/interfaces/AppUser'
import { PrevSession } from '@/interfaces/PrevSession'
import { ProfileInfo } from '@/interfaces/ProfileInfo'
import { Pattern } from '@/utils/Types'
import { getWeakest } from '@/utils/UtilFunctions'
import { redirect } from 'next/navigation'
import { areConsecutiveDays } from '@/utils/UtilFunctions'
import { Note } from '@/interfaces/Note'
import Stat from '@/interfaces/Stat'

const NOTES_KEY = 'userNotes'

export class LocalUser implements AppUser {
	// Delete a note from local storage.
	async deleteNote(note: Note): Promise<void> {
		if (typeof window !== 'undefined') {
			// Get the existing notes from local storage.
			const stored = localStorage.getItem(NOTES_KEY)
			let notes: Note[] = stored ? JSON.parse(stored) : []

			// Filter out the note that matches the pattern.
			notes = notes.filter((n) => n.pattern !== note.pattern)

			// Save the updated notes array.
			localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
		}
	}

	// Save a new note or update an existing note.
	async saveNote(note: Note): Promise<void> {
		if (typeof window !== 'undefined') {
			// Get the existing notes from local storage.
			const stored = localStorage.getItem(NOTES_KEY)
			let notes: Note[] = stored ? JSON.parse(stored) : []

			// Check if a note with the same pattern already exists.
			const index = notes.findIndex((n) => n.pattern === note.pattern)
			if (index > -1) {
				// Update the existing note.
				notes[index] = note
			} else {
				// Add the new note.
				notes.push(note)
			}

			// Save the updated notes array.
			localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
		}
	}

	// Retrieve all notes from local storage.
	async getNotes(): Promise<Note[]> {
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem(NOTES_KEY)
			const notes: Note[] = stored ? JSON.parse(stored) : []
			// Sort the notes alphabetically by the note's pattern.
			notes.sort((a, b) => a.pattern.localeCompare(b.pattern))
			return notes
		}

		return []
	}

	async updateStreak(): Promise<void> {
		if (typeof window !== 'undefined') {
			const key = 'userStreak'
			const currentDate = new Date().toISOString()
			let streakData: {
				curStreak: number
				longestStreak: number
				lastDate: string
			}

			const stored = localStorage.getItem(key)
			if (stored) {
				try {
					streakData = JSON.parse(stored) as {
						curStreak: number
						longestStreak: number
						lastDate: string
					}

					// Check if the current date is consecutive with the stored lastDate
					const isConsecutive = areConsecutiveDays(
						new Date(currentDate),
						new Date(streakData.lastDate)
					)

					if (isConsecutive == 1) {
						const newStreak = streakData.curStreak + 1
						const newLongest = Math.max(
							newStreak,
							streakData.longestStreak
						)

						const newStreakData = {
							curStreak: newStreak,
							longestStreak: newLongest,
							lastDate: currentDate,
						}

						localStorage.setItem(key, JSON.stringify(newStreakData))
					} else if (isConsecutive == -1) {
						const newStreakData = {
							curStreak: 1,
							longestStreak: Math.max(
								streakData.curStreak,
								streakData.longestStreak
							),
							lastDate: currentDate,
						}
						localStorage.setItem(key, JSON.stringify(newStreakData))
					}
				} catch (error) {
					console.error(
						'error updating streak in local storage:',
						error
					)
				}
			} else {
				streakData = {
					curStreak: 1,
					longestStreak: 1,
					lastDate: currentDate,
				}

				localStorage.setItem(key, JSON.stringify(streakData))
			}
		}
	}
	async getStreak(): Promise<{ longestStreak: number; curStreak: number }> {
		if (typeof window !== 'undefined') {
			const key = 'userStreak'
			const stored = localStorage.getItem(key)
			if (stored) {
				try {
					const streakData = JSON.parse(stored) as {
						curStreak: number
						longestStreak: number
						lastDate: string
					}
					return {
						curStreak: streakData.curStreak,
						longestStreak: streakData.longestStreak,
					}
				} catch (error) {
					console.error(
						'error loading streak from local storage:',
						error
					)
					return {
						curStreak: 0,
						longestStreak: 0,
					}
				}
			}

			return {
				curStreak: 0,
				longestStreak: 0,
			}
		}

		return {
			curStreak: 0,
			longestStreak: 0,
		}
	}

	getProfileInfo(): ProfileInfo | null {
		return null
	}

	async savePrevSession(
		focusedPatterns: Pattern[],
		patternStats: Stat<Pattern>[]
	): Promise<void> {
		if (typeof window !== 'undefined') {
			const weakPatterns = getWeakest(patternStats)
			const prevSession = {
				focusedPatterns,
				weakPatterns,
				patternStats: patternStats.map((stat) => ({
					pattern: stat.name,
					correct: stat.correct,
					attempts: stat.attempts,
				})),
			}
			localStorage.setItem('prevSession', JSON.stringify(prevSession))
		}
	}

	async getPrevSession(): Promise<PrevSession | null> {
		if (typeof window !== 'undefined') {
			const storedSession = localStorage.getItem('prevSession')
			if (storedSession) {
				try {
					const prevSessionUnconverted = JSON.parse(storedSession)
					const prevSession: PrevSession = {
						focusedPatterns: prevSessionUnconverted.focusedPatterns,
						weakPatterns: prevSessionUnconverted.weakPatterns,
						patternStats: prevSessionUnconverted.patternStats.map(
							(stat: any) => ({
								name: stat.pattern,
								correct: stat.correct,
								attempts: stat.attempts,
							})
						),
					}

					return prevSession
				} catch (error) {
					return null
				}
			}
		}

		return null
	}

	async getPatternStats(): Promise<Stat<Pattern>[] | null> {
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem('localPatternStats')
			const existingStatsUnconverted = stored ? JSON.parse(stored) : []

			const existingStats = existingStatsUnconverted.map((stat: any) => ({
				name: stat.pattern,
				correct: stat.correct,
				attempts: stat.attempts,
			}))

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
			const existingStatsUnconverted = stored ? JSON.parse(stored) : []

			const existingStats: Stat<Pattern>[] = existingStatsUnconverted.map(
				(stat: any) => ({
					name: stat.pattern,
					correct: stat.correct,
					attempts: stat.attempts,
				})
			)

			const existingIndex = existingStats.findIndex(
				(stat) => stat.name === pattern
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
					name: pattern,
					correct: isCorrect ? 1 : 0,
					attempts: 1,
				})
			}

			const updatedStats = existingStats.map((stat) => ({
				pattern: stat.name,
				correct: stat.correct,
				attempts: stat.attempts,
			}))

			localStorage.setItem(
				'localPatternStats',
				JSON.stringify(updatedStats)
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
