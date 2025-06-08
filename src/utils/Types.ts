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

export type TemplateVariantTitle =
	| 'DFS on Tree'
	| 'DFS on Graphs'
	| 'BFS on Tree'
	| 'BFS on Graphs'
	| 'BFS on a Matrix'
	| 'Sliding Window (Fixed Size)'
	| 'Sliding Window Flexible - Longest'
	| 'Sliding Window Flexible - Shortest'
	| 'Backtracking 1 (Combinations)'
	| 'Backtracking 2 (Permutations)'
	| 'Binary Search (Standard)'
	| 'Mono Stack (Next Greater Element)'
	| 'Trie - Insert & Search'
	| 'Topological Sort (DFS-based)'
	| 'Topological Sort (Kahn’s Algorithm)'
	| 'Union-Find (with Path Compression)'
	| 'Basic Prefix Sum Array'
	| 'Range Sum Using Prefix Array'
	| 'Bottom-Up (Tabulation)'
	| 'Top-Down (Memoization)'
	| 'Start-End Pointer on Sorted Array'
	| 'Slow-Fast Pointer'

export type ColorTheme = 'light' | 'dark'

export type DashboardTypes = 'dashboard' | 'profile' | 'notes' | 'templates'

export type UIState = 'default' | 'loading' | 'error' | 'success'

export type PatternSummary = {
	name: string
	description: string
	howToIdentify: string
	learnMore: string
}

export type CodeTemplate = {
	variants: TemplateVariant[]
	explanation: string
}

export type TemplateVariant = {
	template: string // the template code
	title: TemplateVariantTitle
}

export type TemplateMode =
	| 'flashcards'
	| 'pattern_from_template'
	| 'template_face_off'

export type ChatMode = 'guidance' | 'explanation'

export type GeminiMessage = {
	role: 'user' | 'model'
	parts: { text: string }[]
}

export type FlashcardStatus = 'seen' | 'learned' | 'need_to_learn'
