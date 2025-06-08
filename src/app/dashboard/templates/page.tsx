'use client'

import { useProtectedRoute } from '@/components/AuthContext'
import TemplatePageContent from './TemplatePageContent'

export default function Templates() {
	useProtectedRoute()

	return <TemplatePageContent />
}
