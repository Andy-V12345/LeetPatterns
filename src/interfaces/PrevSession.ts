import { Pattern } from '@/utils/Types'
import { PatternStat } from './PatternStat'

export interface PrevSession {
	patternStats: PatternStat[]
	weakPatterns: Pattern[]
	focusedPatterns: Pattern[]
}
