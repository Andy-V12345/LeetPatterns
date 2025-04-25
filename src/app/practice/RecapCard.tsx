import { PatternStat } from '@/interfaces/PatternStat'
import StatCircle from '../../components/StatCircle'

interface RecapCardProps {
	patternStats: PatternStat[]
	createNewProblem: () => void
}

export default function RecapCard({
	patternStats,
	createNewProblem,
}: RecapCardProps) {
	return (
		<div className="flex flex-col w-full bg-card-bg rounded-md p-6 text-foreground gap-9">
			<h2 className="text-2xl font-semibold">Current Session Recap</h2>

			<div className="flex justify-center gap-8 flex-wrap">
				{patternStats.map((stat, i) => (
					<StatCircle key={stat.pattern + i} stat={stat} />
				))}
			</div>

			<div className="self-end flex gap-4">
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
