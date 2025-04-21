'use client'

import { useProtectedRoute } from '@/components/AuthContext'
import ProblemArea from '@/components/ProblemArea'
import { Pattern } from '@/utils/Types'
import Link from 'next/link'
import { use } from 'react'

interface PracticePageContentProps {
	asyncFocusedPatterns: Promise<Pattern[]>
}

export default function PracticePageContent({
	asyncFocusedPatterns,
}: PracticePageContentProps) {
	useProtectedRoute()

	const focusedPatterns = use(asyncFocusedPatterns)

	return (
		<div className="mx-auto overflow-y-scroll overflow-x-hidden gap-6 p-6 w-full md:w-11/12 xl:w-4/5 flex h-[100svh] flex-col items-center">
			<div className="flex gap-2 justify-between items-center w-full self-start">
				{/* Focused Patterns Bar */}
				{focusedPatterns != null && focusedPatterns.length > 0 && (
					<div className="flex flex-col gap-2 font-semibold text-lg self-start">
						<h3>Focused patterns: </h3>
						<div className="flex flex-wrap gap-2 text-sm text-foreground font-medium">
							{focusedPatterns.map((pattern) => (
								<span
									key={pattern}
									className="border-theme-orange border-1 px-3 py-1 rounded-full"
								>
									{pattern}
								</span>
							))}
						</div>
					</div>
				)}

				{/* Dashboard Button */}
				<Link
					href={'/dashboard'}
					className="bg-theme-orange hover:bg-theme-hover-orange transition-color ml-auto text-sm font-medium px-4 py-2 rounded-md"
				>
					Dashboard
				</Link>
			</div>

			{/* Problem Area */}
			<ProblemArea focusedPatterns={focusedPatterns} />
		</div>
	)
}
