import StatCircle from '@/components/StatCircle'
import { patternSummaries } from '@/utils/Consts'
import { Pattern, UIState } from '@/utils/Types'
import {
	calculateTotalAttempts,
	calculateTotalCorrect,
} from '@/utils/UtilFunctions'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { SquareArrowOutUpRight } from 'lucide-react'
import {
	TooltipTrigger,
	Tooltip,
	TooltipProvider,
	TooltipContent,
} from '@/components/ui/tooltip'
import Stat from '@/interfaces/Stat'

interface PatternStatsGridProps {
	patternStats: Stat<Pattern>[]
	uiState: UIState
	streaks: { longestStreak: number; curStreak: number } | null
}

export default function PatternStatsGrid({
	patternStats,
	uiState,
	streaks,
}: PatternStatsGridProps) {
	return (
		<div className="space-y-[10px] mt-4">
			<p className="text-theme-orange font-bold text-lg">
				Your overall stats
			</p>

			<div className="grid grid-cols-6 gap-[10px]">
				<div
					className="rounded-md bg-card-bg px-5 pb-5 pt-4 flex flex-col gap-2 col-span-full md:col-span-2"
					style={{
						boxShadow: '0px 0px 5px 3px var(--theme-orange)',
					}}
				>
					<div className="flex gap-3 items-center text-lg font-semibold">
						<p>Longest Streak</p>
						<p>🔥</p>
					</div>
					<p className="text-4xl font-bold text-theme-orange">
						{`${streaks!.longestStreak} ${streaks!.longestStreak == 1 ? 'day' : 'days'}`}
					</p>
				</div>

				<div className="rounded-md bg-card-bg px-5 pb-5 pt-4 flex flex-col gap-2 col-span-full md:col-span-2">
					<h3 className="font-semibold text-lg">Total Correct</h3>
					<p className="text-4xl font-bold text-theme-orange">
						{calculateTotalCorrect(patternStats)}
					</p>
				</div>

				<div className="rounded-md bg-card-bg px-5 pb-5 pt-4 flex flex-col gap-2 col-span-full md:col-span-2">
					<h3 className="font-semibold text-lg">Total Attempts</h3>
					<p className="text-4xl font-bold text-theme-orange">
						{calculateTotalAttempts(patternStats)}
					</p>
				</div>
			</div>

			{/* Wrap the whole grid in a single TooltipProvider */}
			<TooltipProvider>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns:
							'repeat(auto-fill, minmax(255px, 1fr))',
						gap: '10px',
					}}
				>
					{patternStats.map((stat) => {
						const [flipped, setFlipped] = useState(false)
						return (
							<Tooltip key={stat.name}>
								<TooltipTrigger asChild>
									<div
										className="relative flex w-full h-56 hover:opacity-85 transition-all"
										style={{
											perspective: '1000px',
										}}
										onClick={() => {
											if (uiState != 'loading') {
												setFlipped(!flipped)
											}
										}}
									>
										<motion.div
											className="w-full h-full"
											initial={false}
											animate={{
												rotateX: flipped ? 180 : 0,
											}}
											transition={{
												duration: 0.3,
											}}
											style={{
												position: 'relative',
												transformStyle: 'preserve-3d',
											}}
										>
											{uiState != 'loading' && (
												<>
													<motion.div className="w-full h-full py-10 absolute bg-card-bg rounded-md flex justify-center items-center">
														<StatCircle
															stat={stat}
															size={'size-36'}
															strokeWidth={5}
															textSize={15}
														/>
														<SquareArrowOutUpRight
															size={15}
															color="var(--theme-orange)"
															className="absolute top-2 right-2"
														/>
													</motion.div>
													<motion.div
														className="w-full h-full absolute bg-card-bg rounded-md p-5 overflow-y-scroll"
														style={{
															transform:
																'rotateX(180deg)',
															backfaceVisibility:
																'hidden',
														}}
													>
														<div className="space-y-5">
															<div className="space-y-1">
																<h3 className="text-sm text-theme-orange font-semibold">
																	About
																</h3>
																<p className="text-sm">
																	{
																		patternSummaries[
																			stat
																				.name
																		]
																			.description
																	}
																</p>
															</div>
															<div className="space-y-1">
																<h3 className="text-sm text-theme-orange font-semibold">
																	How to
																	identify
																</h3>
																<p className="text-sm">
																	{
																		patternSummaries[
																			stat
																				.name
																		]
																			.howToIdentify
																	}
																</p>
															</div>
															<Link
																href={
																	patternSummaries[
																		stat
																			.name
																	].learnMore
																}
																className="flex w-fit items-center gap-1"
																target="_blank"
															>
																{/* Icon and text */}
																<p className="text-sm font-medium">
																	Learn more
																</p>
															</Link>
														</div>
													</motion.div>
												</>
											)}
										</motion.div>
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p>Tap to flip</p>
								</TooltipContent>
							</Tooltip>
						)
					})}
				</div>
			</TooltipProvider>
		</div>
	)
}
