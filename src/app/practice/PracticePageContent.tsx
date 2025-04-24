import { useAuth } from '@/components/AuthContext'
import ProblemArea from '@/components/ProblemArea'
import { Pattern, UIState } from '@/utils/Types'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SyncLoader from 'react-spinners/SyncLoader'

export default function PracticePageContent() {
	const { user, isLoading } = useAuth()
	const [uiState, setUiState] = useState<UIState>('loading')
	const [focusedPatterns, setFocusedPatterns] = useState<Pattern[] | null>(
		null
	)

	useEffect(() => {
		if (user != null && !isLoading) {
			const fetchFocusedPatterns = async () => {
				setUiState('loading')
				if (user != null) {
					setFocusedPatterns(await user.getFocusedPatterns())
				}
				setUiState('default')
			}
			fetchFocusedPatterns()
		}
	}, [user, isLoading])

	return (
		<div>
			<AnimatePresence mode="wait">
				{uiState == 'loading' ? (
					<motion.div
						className="w-full h-[100svh] flex flex-col items-center justify-center gap-6"
						initial={{ opacity: 1 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.4 }}
					>
						<SyncLoader
							loading={uiState == 'loading'}
							color="var(--theme-orange)"
							size={11}
						/>

						<p className="text-foreground font-medium text-base">
							Getting things ready...
						</p>
					</motion.div>
				) : (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.4 }}
						className="mx-auto overflow-y-hidden overflow-x-hidden gap-6 p-6 w-full md:w-11/12 xl:w-4/5 flex h-[100svh] flex-col items-center"
					>
						<div className="flex gap-2 justify-between items-center w-full self-start">
							{/* Focused Patterns Bar */}
							{focusedPatterns != null &&
								focusedPatterns.length > 0 && (
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
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
