'use client'

import { useAuth, useProtectedRoute } from '@/components/AuthContext'

export default function DashboardPage() {
	const { logout } = useAuth()

	useProtectedRoute()

	return (
		<div>
			<button onClick={logout}>dashboard</button>
		</div>
	)
}
