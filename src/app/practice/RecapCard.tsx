import { PatternStat } from '@/interfaces/PatternStat'
import StatCircle from '../../components/StatCircle'
import { useIsMobile } from '@/hooks/use-mobile'

interface RecapCardProps {
	patternStats: PatternStat[]
	createNewProblem: () => void
}

export default function RecapCard({
	patternStats,
	createNewProblem,
}: RecapCardProps) {
	const isMobile = useIsMobile()

	return (
		<div
			className={`flex flex-col w-full ${isMobile && 'h-full'} bg-card-bg rounded-md p-6 text-foreground gap-9`}
		>
			<div
				className={`flex flex-col ${isMobile && 'flex-1/2'} overflow-scroll gap-9`}
			>
				<h2 className="text-2xl font-semibold">Current Session</h2>

				<div
					className={`flex flex-nowrap ${
						isMobile
							? 'flex-col overflow-y-auto'
							: 'flex-row overflow-x-auto'
					} gap-8 w-full justify-center`}
				>
					{patternStats.map((stat, i) => (
						<StatCircle
							key={stat.pattern + i}
							stat={stat}
							size={'size-30'}
							strokeWidth={6}
							textSize={16}
						/>
					))}
				</div>
			</div>

			<div className={`self-end ${isMobile && 'flex-none'}`}>
				<button
					onClick={createNewProblem}
					className="bg-theme-orange text-foreground font-semibold px-4 py-2 rounded hover:bg-theme-hover-orange"
				>
					Continue Practicing
				</button>
			</div>
		</div>
	)
}
