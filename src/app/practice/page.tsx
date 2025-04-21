import { getFocusedPatterns } from '@/utils/UserFunctions'
import { Suspense } from 'react'
import PracticePageContent from './PracticePageContent'

export default function PracticePage() {
	const focusedPatterns = getFocusedPatterns()

	return (
		<Suspense>
			<PracticePageContent asyncFocusedPatterns={focusedPatterns} />
		</Suspense>
	)
}
