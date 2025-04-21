import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/AuthContext'

export const metadata: Metadata = {
	title: 'LeetPatterns.ai',
	description: 'Learn common LeetCode patterns',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`text-foreground font-poppins antialiased`}>
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	)
}
