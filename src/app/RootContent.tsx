'use client'

import { AuthProvider } from '@/components/AuthContext'
import { useTheme } from '@/components/ThemeContext'
import { ReactNode } from 'react'

export default function RootContent({ children }: { children: ReactNode }) {
	const { theme } = useTheme()

	return (
		<body
			className={`text-foreground ${theme == 'light' ? 'light' : ''} font-poppins scrollbar-hide antialiased bg-background transition-all`}
		>
			<AuthProvider>{children}</AuthProvider>
		</body>
	)
}
