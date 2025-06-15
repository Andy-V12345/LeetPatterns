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
	const [weakLoading, setWeakLoading] = useState(false)
	const [focusLoading, setFocusLoading] = useState(false)

	const handleWorkOnWeakPatterns = useCallback(async () => {
		setWeakLoading(true)
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
		setWeakLoading(false)
	}, [user, prevSession])

	const handleWorkOnSameStuff = useCallback(async () => {
		setFocusLoading(true)
		if (user && prevSession) {
			const focusedPatterns = patterns.reduce(
				(acc, pattern) => {
					acc[pattern] = prevSession.focusedPatterns.includes(pattern)
					return acc
				},
				{} as { [pattern: string]: boolean }
			)

			await user.saveFocusedPatterns(focusedPatterns)
			redirect('/practice')
		}
		setFocusLoading(false)
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
													key={`${stat.name}+${i}`}
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
							<div className=" rounded-2xl bg-card-bg backdrop-blur-xl bg-clip-padding p-5 flex flex-col w-full col-span-full md:col-span-3 lg:col-span-2 gap-4 shadow-[0_4px_32px_0_rgba(255,165,0,0.10),0_1.5px_8px_0_rgba(229,46,113,0.08)]">
								<h3 className="font-extrabold text-lg mb-2 bg-gradient-to-r from-theme-orange w-fit to-[#e52e71] bg-clip-text text-transparent flex items-center gap-2">
									Start a session
								</h3>

								{prevSession.weakPatterns.length == 0 && (
									<button
										disabled={weakLoading}
										onClick={handleWorkOnWeakPatterns}
										className={`relative flex items-center justify-between w-full font-semibold text-sm rounded-xl text-left px-5 py-3 bg-gradient-to-r from-theme-orange to-bright-theme-orange overflow-hidden group hover:scale-105 transition-all duration-300`}
									>
										<div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
										<span className="relative z-10 flex gap-3 justify-between items-center w-full">
											{weakLoading ? (
												<BeatLoader
													className="mx-auto"
													loading={weakLoading}
													color="var(--foreground)"
													size={6}
												/>
											) : (
												<>
													<span>
														Work on your weak
														patterns
													</span>
													<ChevronRight className="size-4" />
												</>
											)}
										</span>
									</button>
								)}

								<Link
									href="/onboarding"
									className="relative flex items-center justify-between w-full font-semibold text-sm rounded-xl px-5 py-3 bg-gradient-to-r from-leet-blue to-leet-purple overflow-hidden group transition-all duration-300 hover:scale-105"
								>
									<div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
									<span className="relative z-10 flex gap-3 justify-between items-center w-full">
										<span>Practice new patterns</span>
										<ChevronRight className="size-4" />
									</span>
								</Link>

								<button
									disabled={focusLoading}
									onClick={handleWorkOnSameStuff}
									className={`relative flex items-center justify-between w-full font-semibold text-sm rounded-xl text-left px-5 py-3 bg-gradient-to-r from-green-400 to-emerald-600 overflow-hidden group hover:scale-105 transition-all duration-300`}
								>
									<div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
									<span className="relative z-10 flex gap-3 justify-between items-center w-full">
										{focusLoading ? (
											<BeatLoader
												className="mx-auto"
												loading={focusLoading}
												color="var(--foreground)"
												size={6}
											/>
										) : (
											<>
												<span>
													Focus on the same stuff
												</span>
												<ChevronRight className="size-4" />
											</>
										)}
									</span>
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
