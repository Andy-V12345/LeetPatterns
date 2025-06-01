import { patterns } from '@/utils/Consts'
import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthContext'
import { Pattern, UIState } from '@/utils/Types'
import { PrevSession } from '@/interfaces/PrevSession'
import PreviousSessionDisplay from './PreviousSessionDisplay'
import PatternStatsGrid from './PatternStatsGrid'
import SyncLoader from 'react-spinners/SyncLoader'
import { SidebarTrigger } from '@/components/ui/sidebar'
import Stat from '@/interfaces/Stat'
import { motion } from 'framer-motion'

export default function DashboardPageContent() {
	const { user, isLoading } = useAuth()
	const [uiState, setUiState] = useState<UIState>('loading')
	const [error, setError] = useState<string | null>(null)
	const [prevSession, setPrevSession] = useState<PrevSession | null>(null)
	const [streaks, setStreaks] = useState<{
		longestStreak: number
		curStreak: number
	} | null>(null)

	const [patternStats, setPatternStats] = useState<Stat<Pattern>[]>(
		patterns.map((pattern) => ({
			name: pattern,
			correct: 0,
			attempts: 0,
		}))
	)

	const fetchDashboardData = useCallback(async () => {
		setUiState('loading')

		if (user != null) {
			try {
				const statsPromise = user.getPatternStats()
				const sessionPromise = user.getPrevSession()
				const streaksPromise = user.getStreak()

				const [stats, session, streaks] = await Promise.all([
					statsPromise,
					sessionPromise,
					streaksPromise,
				])

				if (stats) {
					const newPatternStats = patternStats
					for (const stat of stats) {
						const i = newPatternStats.findIndex(
							(s) => s.name == stat.name
						)
						newPatternStats[i].correct = stat.correct
						newPatternStats[i].attempts = stat.attempts
					}

					setPatternStats(newPatternStats)
				}

				setStreaks(streaks)
				setPrevSession(session)
				setUiState('default')
			} catch (error) {
				console.error(error)
				setUiState('error')
				setError('Error fetching dashboard data')
			}
		} else {
			// impossible to happen
			setUiState('error')
			setError('You must be logged in to view this page')
		}
	}, [user, patternStats])

	const handleRetry = useCallback(() => {
		fetchDashboardData()
	}, [fetchDashboardData])

	useEffect(() => {
		if (user != null && !isLoading) {
			fetchDashboardData()
		}
	}, [user, isLoading])

	return (
		<div className="flex flex-col gap-7 bg-background h-[100svh] p-[30px] overflow-scroll">
			<div className="flex items-center gap-5">
				<SidebarTrigger className="" />

				<h1 className="text-3xl font-bold text-foreground">
					Dashboard
				</h1>
			</div>

			{uiState == 'loading' ? (
				<div className="mx-auto my-auto flex flex-col gap-6 justify-center items-center">
					<SyncLoader
						loading={uiState == 'loading'}
						color="var(--theme-orange)"
						size={11}
					/>

					<p className="text-foreground font-medium text-base">
						Loading your stuff...
					</p>
				</div>
			) : (
				<>
					{uiState == 'error' ? (
						<motion.div
							key="error-div"
							className="flex flex-col justify-center items-center gap-5 h-full relative"
							initial={{ opacity: 1 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
						>
							<div className="flex flex-col justify-center gap-2">
								<p className="font-medium text-base text-wrong-red">
									{error}
								</p>

								<button
									onClick={handleRetry}
									className="px-3 py-2 text-sm text-wrong-red rounded-lg hover:opacity-75 transition-all"
									style={{
										backgroundColor:
											'rgba(255, 0, 84, 0.2)',
									}}
								>
									Retry
								</button>
							</div>
						</motion.div>
					) : (
						<>
							<PreviousSessionDisplay prevSession={prevSession} />

							<PatternStatsGrid
								streaks={streaks}
								patternStats={patternStats}
								uiState={uiState}
							/>
						</>
					)}
				</>
			)}
		</div>
	)
}
