import { PatternStat } from "@/interfaces/PatternStat";
import StatCircle from "./StatCircle";

export default function RecapCard() {
	const patternStats: PatternStat[] = [
		{ pattern: 'DFS', correct: 2, attempts: 3 },
		{ pattern: 'Greedy', correct: 1, attempts: 2 },
		{ pattern: "Arrays / Strings", correct: 3, attempts: 3 },
		{ pattern: "BFS", correct: 3, attempts: 8 },
		{ pattern: "Backtracking", correct: 3, attempts: 8 },
		{ pattern: "Backtracking", correct: 3, attempts: 8 },
	];

  	return (
		<div className="flex flex-col w-full self-stretch bg-card-bg rounded-md p-6 text-white gap-7">
			<h2 className="text-2xl font-semibold">Current Session Recap</h2>

			<div className="flex justify-center gap-7 flex-wrap">
				{patternStats.map((stat, i) => (
					<StatCircle key={stat.pattern + i} stat={stat} />
				))}
			</div>
		
		<div className="self-end flex gap-4">
			<button className="bg-theme-orange text-foreground font-semibold px-4 py-2 rounded hover:bg-theme-hover-orange">
				Continue Practicing
			</button>
		</div>
		</div>
  	);
}