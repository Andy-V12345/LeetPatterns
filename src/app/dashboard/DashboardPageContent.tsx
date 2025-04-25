import { PatternStat } from '@/interfaces/PatternStat'
import { patterns } from '@/utils/Consts'
import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthContext'
import { UIState } from '@/utils/Types'
import { PrevSession } from '@/interfaces/PrevSession'
import PreviousSessionDisplay from './PreviousSessionDisplay'
import PatternStatsGrid from './PatternStatsGrid'
import SyncLoader from 'react-spinners/SyncLoader'
import { SidebarTrigger } from '@/components/ui/sidebar'

export default function DashboardPageContent() {
	const { user, isLoading } = useAuth()
	const [uiState, setUiState] = useState<UIState>('loading')
	const [prevSession, setPrevSession] = useState<PrevSession | null>(null)
	const [streaks, setStreaks] = useState<{
		longestStreak: number
		curStreak: number
	} | null>(null)

	const [patternStats, setPatternStats] = useState<PatternStat[]>(
		patterns.map((pattern) => ({
			pattern,
			correct: 0,
			attempts: 0,
		}))
	)

	const fetchDashboardData = useCallback(async () => {
		setUiState('loading')

		if (user != null) {
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
						(s) => s.pattern == stat.pattern
					)
					newPatternStats[i].correct = stat.correct
					newPatternStats[i].attempts = stat.attempts
				}

				setPatternStats(newPatternStats)
			}
			setStreaks(streaks)
			setPrevSession(session)
		}

		setUiState('default')
	}, [user, patternStats])

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
					<PreviousSessionDisplay prevSession={prevSession} />

					<PatternStatsGrid
						streaks={streaks}
						patternStats={patternStats}
						uiState={uiState}
					/>
				</>
			)}
		</div>
	)
}
