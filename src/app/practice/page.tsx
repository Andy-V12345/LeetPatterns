'use client';

import ProblemArea from '@/components/ProblemArea';
import Problem from '@/interfaces/Problem';
import { generateProblem } from '@/utils/GeminiFunctions';
import { getFocusedPatterns } from '@/utils/UserFunctions';
import { useEffect, useState } from 'react';

const mockProblem: Problem = {
	prompt: "Given a 2D grid of '1's (land) and '0's (water), count the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
	options: ['DFS', 'BFS', 'Greedy', 'Union-Find'],
	answer: {
		correct: "DFS",
		leetcodeTitle: "Number of Islands",
		leetcodeUrl: "https://leetcode.com/problems/number-of-islands/",
		explanation: "Depth-First Search (DFS) is the most suitable solution for this problem because it efficiently traverses connected components in a 2D grid. The task involves identifying and counting distinct islands, where each island is formed by adjacent ‘1’s representing land. By using DFS, we can start from any unvisited land cell and recursively explore all of its connected neighbors—up, down, left, and right—marking each one as visited to avoid counting it again. This approach ensures that we fully explore one island before moving on to the next. While other techniques like Breadth-First Search (BFS) or Union-Find could also solve the problem, DFS offers a straightforward and intuitive method, making it an ideal choice for this type of grid-based traversal."
	},
};

export default function PracticePage() {
	const [focusedPatterns, setFocusedPatterns] = useState<string[] | null>()

	useEffect(() => {
		const tmp = getFocusedPatterns()
		setFocusedPatterns(tmp)
	}, [])

  return (
    <div className="mx-auto overflow-y-scroll overflow-x-hidden gap-8 p-6 w-full md:w-11/12 xl:w-4/5 flex h-[100svh] flex-col items-center">

        {/* Focused Patterns Bar */}
        {focusedPatterns != null  && focusedPatterns.length > 0 && 
			<div className='flex flex-col gap-2 font-semibold text-lg self-start '>
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

		{/* Problem Area */}
		<ProblemArea focusedPatterns={focusedPatterns} />

		
    </div>
  );
}