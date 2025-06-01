import { Pattern } from '@/utils/Types'
import Stat from './Stat'

export interface PrevSession {
	patternStats: Stat<Pattern>[]
	weakPatterns: Pattern[]
	focusedPatterns: Pattern[]
}
