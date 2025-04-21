import { Pattern } from '@/utils/Types'

export interface AppUser {
	getFocusedPatterns(): Promise<Pattern[] | null>
	saveFocusedPatterns(focusedPatterns: {
		[k: string]: boolean
	}): Promise<void>
}
