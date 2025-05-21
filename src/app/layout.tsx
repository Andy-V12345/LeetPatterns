import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeContext'
import RootContent from './RootContent'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
	title: 'LeetPatterns.ai',
	description: 'Learn common LeetCode patterns',
	icons: {
		icon: '/favicon.ico',
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<ThemeProvider>
				<RootContent>{children}</RootContent>
				<Analytics />
				<SpeedInsights />
			</ThemeProvider>
		</html>
	)
}
