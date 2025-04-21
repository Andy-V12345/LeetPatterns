import { Pattern } from '@/utils/Types'

export interface AppUser {
	getFocusedPatterns(): Promise<Pattern[]>
	saveFocusedPatterns(focusedPatterns: {
		[k: string]: boolean
	}): Promise<void>
}
