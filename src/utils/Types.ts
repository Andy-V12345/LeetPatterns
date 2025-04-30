export type ProblemCardState = 'default' | 'correct' | 'wrong' | 'loading'

export type Pattern =
	| 'Prefix Sum'
	| 'BFS'
	| 'Backtracking'
	| 'Binary Search'
	| 'DFS'
	| 'Dynamic Programming'
	| 'Greedy'
	| 'Hashing'
	| 'Heaps'
	| 'Sliding Window'
	| 'Stacks'
	| 'Topological Sort'
	| 'Two Pointers'
	| 'Union-Find'
	| 'Tries'

export type ColorTheme = 'light' | 'dark'

export type DashboardTypes = 'dashboard' | 'profile'

export type UIState = 'default' | 'loading' | 'error'

export type PatternSummary = {
	name: string
	description: string
	howToIdentify: string
	learnMore: string
}
