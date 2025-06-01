import { useAuth } from '@/components/AuthContext'
import ProblemArea from '@/app/practice/ProblemArea'
import { Pattern, UIState } from '@/utils/Types'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SyncLoader from 'react-spinners/SyncLoader'
import { useIsMobile } from '@/hooks/use-mobile'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import { BotMessageSquare } from 'lucide-react'
import ThemeSwitch from '@/components/ThemeSwitch'
import { patternColors } from '@/utils/Consts'

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
					const streakPromise = user.updateStreak()
					const focusedPatternsPromise = user.getFocusedPatterns()

					const [_, patterns] = await Promise.all([
						streakPromise,
						focusedPatternsPromise,
					])

					setFocusedPatterns(patterns)
				}
				setUiState('default')
			}
			fetchFocusedPatterns()
		}
	}, [user, isLoading])

	const isMobile = useIsMobile()

	return (
		<Sheet>
			<div className="relative overflow-x-hidden overflow-y-scroll">
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
							className="mx-auto scrollbar-hide overflow-x-hidden gap-6 p-6 w-full md:w-11/12 flex h-[100svh] flex-col items-center"
						>
							<div
								className={`flex ${isMobile ? 'flex-col gap-4' : 'flex-row gap-10'} justify-between items-center w-full self-start`}
							>
								{/* Focused Patterns Bar */}
								{focusedPatterns != null &&
									focusedPatterns.length > 0 && (
										<div className="flex flex-col w-full gap-2 overflow-x-scroll font-semibold text-lg self-start">
											<h3>Focused patterns: </h3>
											<div
												className={`flex w-full scrollbar-hide flex-nowrap overflow-x-scroll gap-2 text-sm text-foreground font-medium`}
											>
												{focusedPatterns.map(
													(pattern) => (
														<span
															key={pattern}
															className="whitespace-nowrap px-3 py-1 rounded-full border"
															style={{
																borderColor:
																	patternColors[
																		pattern
																	],
																color: patternColors[
																	pattern
																],
															}}
														>
															{pattern}
														</span>
													)
												)}
											</div>
										</div>
									)}

								{/* Dashboard Button */}
								<Link
									href={'/dashboard'}
									className={`bg-card-bg hover:opacity-65 transition-all ${isMobile ? 'self-stretch text-center' : 'ml-auto'} text-sm font-medium px-4 py-3 rounded-md`}
								>
									{isMobile ? 'Go to Dashboard' : 'Dashboard'}
								</Link>
							</div>

							{/* Problem Area */}
							<ProblemArea focusedPatterns={focusedPatterns} />
						</motion.div>
					)}
				</AnimatePresence>

				{uiState != 'loading' && (
					<SheetTrigger asChild>
						<motion.div
							initial={{ right: -40 }}
							whileHover={{ right: -30 }}
							transition={{
								duration: 0.4,
								type: 'spring',
								bounce: 0.5,
							}}
							className="absolute top-1/2"
							style={{
								transform: 'translate(0, -50%)',
							}}
						>
							<button
								className="flex rounded-full bg-gradient-to-r from-blue-500 to-purple-500 pl-3 md:pl-4 pr-12 py-2 md:py-3"
								style={{
									boxShadow:
										'0px 0px 8px 2px var(--theme-orange)',
								}}
							>
								<BotMessageSquare
									color="white"
									size={isMobile ? 24 : 34}
								/>
							</button>
						</motion.div>
					</SheetTrigger>
				)}
			</div>
		</Sheet>
	)
}
