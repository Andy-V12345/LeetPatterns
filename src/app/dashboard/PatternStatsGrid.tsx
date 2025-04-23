import { LeetcodeIcon } from '@/components/ProblemAnswer'
import StatCircle from '@/components/StatCircle'
import { Skeleton } from '@/components/ui/skeleton'
import { PatternStat } from '@/interfaces/PatternStat'
import { patternSummaries } from '@/utils/Consts'
import { UIState } from '@/utils/Types'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

interface PatternStatsGridProps {
	patternStats: PatternStat[]
	uiState: UIState
}

export default function PatternStatsGrid({
	patternStats,
	uiState,
}: PatternStatsGridProps) {
	return (
		<div className="space-y-2 mt-4">
			<p className="text-theme-orange font-bold text-lg">
				Your overall stats
			</p>

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
						<div
							onClick={() => {
								if (uiState != 'loading') {
									setFlipped(!flipped)
								}
							}}
							className="relative flex w-full h-56 hover:opacity-85 transition-all"
							style={{
								perspective: '1000px',
							}}
							key={stat.pattern}
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
										<motion.div
											className="w-full h-full py-10 absolute bg-card-bg rounded-md flex justify-center items-center"
											style={{}}
										>
											<StatCircle
												stat={stat}
												size={'size-36'}
												strokeWidth={5}
												textSize={15}
											/>
										</motion.div>

										<motion.div
											className="w-full h-full absolute bg-card-bg rounded-md p-5 overflow-y-scroll"
											style={{
												transform: 'rotateX(180deg)',
												backfaceVisibility: 'hidden',
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
																stat.pattern
															].description
														}
													</p>
												</div>

												<div className="space-y-1">
													<h3 className="text-sm text-theme-orange font-semibold">
														How to identify
													</h3>

													<p className="text-sm">
														{
															patternSummaries[
																stat.pattern
															].howToIdentify
														}
													</p>
												</div>

												<Link
													href={
														patternSummaries[
															stat.pattern
														].learnMore
													}
													className="flex w-fit items-center gap-1"
													target="_blank"
												>
													<LeetcodeIcon />
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
					)
				})}
			</div>
		</div>
	)
}
