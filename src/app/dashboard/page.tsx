'use client'

import { useProtectedRoute } from '@/components/AuthContext'
import DashboardPageContent from './DashboardPageContent'

export default function DashboardPage() {
	useProtectedRoute()

	return <DashboardPageContent />
}
