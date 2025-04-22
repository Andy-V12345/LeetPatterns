'use client'

import PracticePageContent from './PracticePageContent'
import { useProtectedRoute } from '@/components/AuthContext'

export default function PracticePage() {
	useProtectedRoute()

	return <PracticePageContent />
}
