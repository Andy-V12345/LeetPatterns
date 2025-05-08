import React, { useCallback, useState } from 'react'
import { PrevSession } from '@/interfaces/PrevSession'
import StatCircle from '@/components/StatCircle'
import { patternColors, patterns } from '@/utils/Consts'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthContext'
import { redirect } from 'next/navigation'
import BeatLoader from 'react-spinners/BeatLoader'
import {
	calculateTotalCorrect,
	calculateTotalAttempts,
} from '@/utils/UtilFunctions'

interface PreviousSessionDisplayProps {
	prevSession: PrevSession | null
}

export default function PreviousSessionDisplay({
	prevSession,
}: PreviousSessionDisplayProps) {
	const { user } = useAuth()
	const [loading, setLoading] = useState(false)

	const handleWorkOnWeakPatterns = useCallback(async () => {
		setLoading(true)
		if (user && prevSession) {
			const focusedPatterns = patterns.reduce(
				(acc, pattern) => {
					acc[pattern] = prevSession.weakPatterns.includes(pattern)
					return acc
				},
				{} as { [pattern: string]: boolean }
			)

			await user.saveFocusedPatterns(focusedPatterns)
			redirect('/practice')
		}
		setLoading(false)
	}, [user, prevSession])

	return (
		<div className="space-y-2">
			<p className="text-theme-orange font-bold text-lg">
				Your previous session
			</p>

			<div
				className={`${prevSession == null ? 'bg-card-bg px-5 py-20' : ''} rounded-md flex-col flex gap-4 justify-center items-center`}
			>
				{prevSession == null ? (
					<div className="flex flex-col justify-center items-center gap-5">
						<p className="">You haven't practiced yet!</p>

						<Link
							href={'/practice'}
							className="button-82-pushable mx-auto"
							role="button"
						>
							<span className="button-82-shadow"></span>
							<span className="button-82-edge"></span>
							<span className="button-82-front text-lg font-bold">
								Start a Session
							</span>
						</Link>
					</div>
				) : (
					<div className="flex flex-col gap-[10px] w-full">
						<div className="w-full grid grid-cols-10 gap-[10px]">
							{/* Focused Patterns Cell */}
							<div className="rounded-md bg-card-bg px-5 pb-5 pt-4 flex flex-col col-span-full md:col-span-5 lg:col-span-3 gap-3">
								<h3 className="font-semibold text-lg">
									Patterns You Focused On
								</h3>

								{prevSession.focusedPatterns.length == 0 && (
									<i className="text-theme-orange text-sm mx-auto my-auto">
										No patterns
									</i>
								)}

								{prevSession.focusedPatterns.length > 0 && (
									<div className="flex flex-wrap gap-2">
										{prevSession.focusedPatterns.map(
											(pattern) => (
												<p
													key={pattern}
													className="px-3 py-1 border rounded-full font-medium text-sm"
													style={{
														whiteSpace: 'nowrap',
														textOverflow:
															'ellipsis',
														color: patternColors[
															pattern
														],
														borderColor:
															patternColors[
																pattern
															],
													}}
												>
													{pattern}
												</p>
											)
										)}
									</div>
								)}
							</div>

							{/* Weakest Patterns Cell */}
							<div className="rounded-md bg-card-bg px-5 pb-5 pt-4 flex flex-col col-span-full md:col-span-5 lg:col-span-3 gap-3">
								<h3 className="font-semibold text-lg ">
									Weak Patterns
								</h3>
								{prevSession.weakPatterns.length == 0 && (
									<i className="text-theme-orange text-sm mx-auto my-auto">
										No patterns
									</i>
								)}

								{prevSession.weakPatterns.length > 0 && (
									<div className="flex flex-wrap gap-2">
										{prevSession.weakPatterns.map(
											(pattern) => (
												<p
													key={pattern}
													className="px-3 py-1 border rounded-full font-medium text-sm"
													style={{
														whiteSpace: 'nowrap',
														textOverflow:
															'ellipsis',
														color: patternColors[
															pattern
														],
														borderColor:
															patternColors[
																pattern
															],
													}}
												>
													{pattern}
												</p>
											)
										)}
									</div>
								)}
							</div>

							{/* Total Correct Cell */}
							<div className="rounded-md bg-card-bg px-5 pb-5 pt-4 flex flex-col gap-2 col-span-5 lg:col-span-2">
								<h3 className="font-semibold text-lg">
									Correct
								</h3>
								<p className="text-4xl font-bold text-theme-orange">
									{calculateTotalCorrect(
										prevSession.patternStats
									)}
								</p>
							</div>

							{/* Total Attempts Cell */}
							<div className="rounded-md bg-card-bg px-5 pb-5 pt-4 flex flex-col gap-2 col-span-5 lg:col-span-2">
								<h3 className="font-semibold text-lg">
									Attempts
								</h3>
								<p className="text-4xl font-bold text-theme-orange">
									{calculateTotalAttempts(
										prevSession.patternStats
									)}
								</p>
							</div>
						</div>

						<div className="grid w-full grid-cols-6 gap-[10px]">
							{/* Pattern Stats Cell */}
							<div className="rounded-md bg-card-bg px-5 pb-5 pt-4 w-full flex flex-col gap-4 col-span-full md:col-span-3 lg:col-span-4">
								<h3 className="font-semibold text-lg">
									Pattern Stats
								</h3>
								{prevSession.patternStats.length == 0 && (
									<i className="text-theme-orange text-sm mx-auto my-auto">
										No stats available
									</i>
								)}

								{prevSession.patternStats.length > 0 && (
									<div className="flex flex-nowrap justify-center gap-7 my-auto overflow-x-auto">
										{prevSession.patternStats.map(
											(stat, i) => (
												<StatCircle
													key={`${stat.pattern}+${i}`}
													stat={stat}
													size="size-32"
													strokeWidth={5}
													textSize={16}
												/>
											)
										)}
									</div>
								)}
							</div>

							{/* Button Options */}
							<div
								className="rounded-md bg-card-bg px-5 pb-5 pt-4 flex flex-col w-full col-span-full md:col-span-3 lg:col-span-2 gap-3"
								style={{
									boxShadow:
										'0px 0px 5px 3px var(--theme-orange)',
								}}
							>
								<h3 className="font-semibold text-theme-orange text-lg">
									Start a Session
								</h3>

								{prevSession.weakPatterns.length > 0 && (
									<button
										disabled={loading}
										onClick={handleWorkOnWeakPatterns}
										className={`relative flex items-center transition-none justify-between bg-card-fg font-semibold text-sm rounded-md text-left p-4 ${loading ? '' : 'hover:opacity-80'} transition-all gap-3`}
									>
										{loading ? (
											<>
												<BeatLoader
													className="absolute inset-0 flex items-center justify-center"
													loading={loading}
													color="var(--foreground)"
													size={6}
												/>
												<p
													className={`text-sm ${loading && 'text-transparent'}`}
												>
													f
												</p>
											</>
										) : (
											<>
												<div
													className={`flex gap-3 items-center`}
												>
													<p>💪</p>
													<p>
														Work on your weak
														patterns
													</p>
												</div>

												<ChevronRight className="size-4" />
											</>
										)}
									</button>
								)}

								<Link
									href="/onboarding"
									className={`flex items-center justify-between bg-card-fg font-semibold text-sm rounded-md text-left ${loading ? 'pointer-events-none' : 'hover:opacity-80'} p-4 transition-all gap-3`}
								>
									<div className="flex gap-3 items-center">
										<p>🧠</p>
										<p>Practice new patterns</p>
									</div>
									<ChevronRight className="size-4" />
								</Link>

								<Link
									href="/practice"
									className={`flex items-center justify-between bg-card-fg font-semibold text-sm rounded-md text-left ${loading ? 'pointer-events-none' : 'hover:opacity-80'} p-4 transition-all gap-3`}
								>
									<div className="flex gap-3 items-center">
										<p>🏃</p>
										<p>Focus on the same stuff</p>
									</div>
									<ChevronRight className="size-4" />
								</Link>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
