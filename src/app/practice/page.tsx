'use client';

import ProblemCard from '@/components/ProblemCard';
import Problem from '@/interfaces/Problem';
import { getFocusedPatterns } from '@/utils/UserFunctions';
import { useEffect, useState } from 'react';

const mockProblem: Problem = {
	prompt: "Given a 2D grid of '1's (land) and '0's (water), count the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
	options: ['DFS', 'BFS', 'Greedy', 'Union-Find'],
	answer: 'DFS',
};

export default function PracticePage() {
	const [focusedPatterns, setFocusedPatterns] = useState<string[]>([]) // This should be dynamic later

	useEffect(() => {
		const tmp = getFocusedPatterns()
		setFocusedPatterns(tmp)
	}, [])

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
        {/* Focused Patterns Bar */}
        {focusedPatterns.length > 0 && 
			<div className='flex flex-col gap-2 font-semibold text-lg'>
				<h3>Focused patterns: </h3>
				<div className="flex flex-wrap gap-2 text-sm text-foreground font-medium">
					{focusedPatterns.map((pattern) => (
					<span key={pattern} className="border-theme-orange border-1 px-3 py-1 rounded-full">
						{pattern}
					</span>
					))}
				</div>
			</div>
        }

		{/* Problem Card */}
		<ProblemCard problem={mockProblem} />

		{/* Bottom Controls */}
		<div className="flex justify-between pt-4">
			<button className="text-sm text-blue-600 hover:underline">
				Change Focus Patterns
			</button>

			<button className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600">
				Next Question
			</button>
		</div>
    </div>
  );
}