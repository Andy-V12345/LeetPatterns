'use client'

import { useProtectedRoute } from '@/components/AuthContext'
import PatternFromTemplatePageContent from './PatternFromTemplatePageContent'

export default function PatternFromTemplatePage() {
	useProtectedRoute()

	return <PatternFromTemplatePageContent />
}
