import { Pattern } from '@/utils/Types'
import { PrevSession } from './PrevSession'
import { ProfileInfo } from './ProfileInfo'
import { Note } from './Note'
import Stat from './Stat'

export interface AppUser {
	getFocusedPatterns(): Promise<Pattern[] | null>
	saveFocusedPatterns(focusedPatterns: {
		[k: string]: boolean
	}): Promise<void>
	updatePatternStats(pattern: Pattern, isCorrect: boolean): Promise<void>
	getPatternStats(): Promise<Stat<Pattern>[] | null>
	savePrevSession(
		focusedPatterns: Pattern[],
		patternStats: Stat<Pattern>[]
	): Promise<void>
	getPrevSession(): Promise<PrevSession | null>
	getProfileInfo(): ProfileInfo | null
	updateStreak(): Promise<void>
	getStreak(): Promise<{ longestStreak: number; curStreak: number }>
	saveNote(note: Note): Promise<void>
	getNotes(): Promise<Note[]>
	deleteNote(note: Note): Promise<void>
}
