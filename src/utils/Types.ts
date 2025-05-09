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

export type DashboardTypes = 'dashboard' | 'profile' | 'notes'

export type UIState = 'default' | 'loading' | 'error' | 'success'

export type PatternSummary = {
	name: string
	description: string
	howToIdentify: string
	learnMore: string
}

export type ChatMode = 'guidance' | 'explanation'

export type GeminiMessage = {
	role: 'user' | 'model'
	parts: { text: string }[]
}
