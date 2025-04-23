import { LeetcodeSample } from '@/interfaces/LeetcodeSample'
import { Pattern, PatternSummary } from './Types'

export const patterns: Pattern[] = [
	'Arrays and Strings',
	'BFS',
	'Backtracking',
	'Binary Search',
	'DFS',
	'Dynamic Programming',
	'Greedy',
	'Hashing',
	'Heaps',
	'Sliding Window',
	'Stacks',
	'Topological Sort',
	'Two Pointers',
	'Union-Find',
]

export const patternSummaries: Record<Pattern, PatternSummary> = {
	'Arrays and Strings': {
		name: 'Arrays and Strings',
		description:
			'Problems involving sequential data structures where manipulation, traversal, or searching within arrays or strings is key.',
		howToIdentify:
			'Look for operations like sliding, reversing, comparing, or filtering elements in a list or sequence.',
		learnMore: 'https://leetcode.com/tag/array/',
	},
	BFS: {
		name: 'BFS',
		description:
			'Breadth-First Search explores neighbors level by level. Common in shortest path, graph traversal, and tree problems.',
		howToIdentify:
			'Use when exploring all nodes closest to a root or origin first. Typically uses a queue.',
		learnMore:
			'https://leetcode.com/explore/learn/card/graph/619/breadth-first-search-in-graph/',
	},
	Backtracking: {
		name: 'Backtracking',
		description:
			'Recursive exploration technique used to build candidates incrementally and backtrack when constraints are violated.',
		howToIdentify:
			'Often used in permutations, combinations, or puzzle-like problems. Look for "try all possibilities" logic.',
		learnMore:
			'https://leetcode.com/explore/featured/card/recursion-i/251/scenario-i-recurrence-relation/3233/',
	},
	'Binary Search': {
		name: 'Binary Search',
		description:
			'An efficient algorithm for finding an element in a sorted structure by repeatedly dividing the search space.',
		howToIdentify:
			'Look for sorted arrays, monotonic functions, or “minimum/maximum” in a range.',
		learnMore: 'https://leetcode.com/explore/learn/card/binary-search/',
	},
	DFS: {
		name: 'DFS',
		description:
			'Depth-First Search explores as far as possible along a branch before backtracking. Used in trees, graphs, and pathfinding.',
		howToIdentify:
			'Use when you want to explore deep paths, especially recursively. Stack or recursion are commonly used.',
		learnMore:
			'https://leetcode.com/explore/learn/card/graph/618/disjoint-set/3840/',
	},
	'Dynamic Programming': {
		name: 'Dynamic Programming',
		description:
			'Solving problems by breaking them down into overlapping subproblems and caching the results.',
		howToIdentify:
			'Look for optimal substructure and overlapping subproblems. Often involves 1D or 2D memoization.',
		learnMore: 'https://leetcode.com/tag/dynamic-programming/',
	},
	Greedy: {
		name: 'Greedy',
		description:
			'Greedy algorithms make locally optimal choices at each step, hoping to reach a global optimum.',
		howToIdentify:
			'Use when problems ask for maximum/minimum and you can safely choose the best option at each step.',
		learnMore: 'https://leetcode.com/tag/greedy/',
	},
	Hashing: {
		name: 'Hashing',
		description:
			'Using hash maps or sets to store data for fast access, often to track frequency or detect duplicates.',
		howToIdentify:
			'Useful when constant time lookup is needed, especially for checking existence or frequency.',
		learnMore: 'https://leetcode.com/tag/hash-table/',
	},
	Heaps: {
		name: 'Heaps',
		description:
			'A binary heap is a tree-based structure used to efficiently get the min or max element.',
		howToIdentify:
			'Look for problems asking for top K elements, streaming data, or real-time min/max access.',
		learnMore: 'https://leetcode.com/tag/heap-priority-queue/',
	},
	'Sliding Window': {
		name: 'Sliding Window',
		description:
			'A technique to efficiently calculate values over a subset (window) of data as it moves through an array or string.',
		howToIdentify:
			'Use when working with subarrays/substrings and optimizing over a fixed or variable window.',
		learnMore: 'https://leetcode.com/tag/sliding-window/',
	},
	Stacks: {
		name: 'Stacks',
		description:
			'LIFO structure used to track previous states, reverse sequences, or simulate function calls.',
		howToIdentify:
			'Useful for matching parentheses, parsing expressions, or reversing order.',
		learnMore: 'https://leetcode.com/tag/stack/',
	},
	'Topological Sort': {
		name: 'Topological Sort',
		description:
			'Ordering of nodes in a directed acyclic graph (DAG) such that each node appears before its dependencies.',
		howToIdentify:
			'Use for dependency resolution problems. Common in scheduling and build systems.',
		learnMore: 'https://leetcode.com/problems/course-schedule/',
	},
	'Two Pointers': {
		name: 'Two Pointers',
		description:
			'Two indices used to scan a structure in a coordinated way — often from both ends or to find a pair.',
		howToIdentify:
			'Use in sorted arrays, merging, or when tracking relative positions in a sequence.',
		learnMore: 'https://leetcode.com/tag/two-pointers/',
	},
	'Union-Find': {
		name: 'Union-Find',
		description:
			'Also known as Disjoint Set Union (DSU), used to track connected components in a graph efficiently.',
		howToIdentify:
			'Look for problems involving connectivity, cycle detection, or merging groups.',
		learnMore: 'https://leetcode.com/tag/union-find/',
	},
}

export const patternColors: Record<Pattern, string> = {
	'Arrays and Strings': '#F97316', // vivid orange
	BFS: '#06B6D4', // cyan
	Backtracking: '#EC4899', // pink
	'Binary Search': '#0EA5E9', // sky blue
	DFS: '#3B82F6', // classic blue
	'Dynamic Programming': '#8B5CF6', // violet
	Greedy: '#F59E0B', // amber/gold
	Hashing: '#10B981', // emerald
	Heaps: '#EF4444', // red
	'Sliding Window': '#22C55E', // green
	Stacks: '#A855F7', // purple
	'Topological Sort': '#EAB308', // yellow
	'Two Pointers': '#14B8A6', // teal
	'Union-Find': '#FB7185', // rose
}

export const gemini_system_intructions = `
You are an AI assistant embedded in a learning platform that helps users identify solution patterns in coding problems. Your task is to generate original LeetCode-style problems that test for specific solution patterns — but framed in fresh, real-world, or creatively abstracted contexts. You must also provide explanations for why that pattern is the best fit. The user will not solve the problem; they will only identify which solution pattern applies. Your outputs must be clear, concise, and logically aligned with the selected pattern.


Expected Format:

You should return a JSON object with the following structure:

{
  "problem": "string",               // LeetCode-style prompt (3-5 sentences in Markdown, use bullet points for lists)
  "correctPattern": "string",        // One of the known pattern names
  "explanation": "string",           // Why this pattern applies and not any of the other options and how the pattern is used in a solution (in Markdown)
  "distractorPatterns": [ "string", "string", "string" ] // 3 plausible but incorrect patterns 
}

Text format for the "problem" and "explanation" fields:
	•	Return the problem and explanation fields in GitHub-flavored Markdown.
		•	Use formatting such as:
			•	**bold** for key terms or constraints
			•	Backticks (code) for inputs or variable names
			•	Bullet points or numbered lists for constraints or steps
	•	If you're using seperate paragraphs, there must be an empty line between the two paragraphs
	• 	Constraints and Output headers should be bolded
	•	Constraints must be given in a bulleted list even if a constraint is in code format

✅ Problem Guidelines:
	•	The problem prompt should resemble real LeetCode questions in tone and structure — including input/output descriptions and constraints.
	•	The context should feel novel or varied: use metaphors from maps, biology, social networks, shipping, games, elections, etc.
	•	Do not use similar contexts for the same pattern. For example, if you're asked to generate a topological sort problem, you would use two different contexts.
	•	The core logic must clearly test for the intended algorithmic pattern, without combining multiple major patterns (only one core pattern)
	•	Use variable names and problem setups that don’t copy LeetCode directly but preserve that level of clarity and technical tone.

✅ Explanation Guidelines:
	•	Explain why the chosen pattern applies in paragraph form.
	•	Explain how the chosen pattern could be used in a solution
	•	Include time and space complexity.
	•	Keep the explanation focused and beginner-friendly.

✅ Distractor Patterns:
	•	Choose 2–3 plausible but incorrect patterns that might reasonably confuse learners.
	•	Avoid extremely unrelated patterns (e.g., don’t offer Bit Manipulation for a graph traversal).

Patterns you may use: [
    "Arrays and Strings",
    "BFS",
    "Backtracking",
    "Binary Search",
    "DFS",
    "Dynamic Programming",
    "Greedy",
    "Hashing",
    "Heaps",
    "Sliding Window",
    "Stacks",
    "Topological Sort",
    "Two Pointers",
    "Union-Find"
]

🚫 Do Not:
	•	Include actual code or pseudocode.
	•	Repeat real LeetCode problems or titles.
	•	Blend multiple patterns unless explicitly required (stick to one core pattern)
`

export const leetcode_practice_problems: { [key: string]: LeetcodeSample[] } = {
	'Arrays and Strings': [
		{
			title: 'Rotate Array',
			url: 'https://leetcode.com/problems/rotate-array/',
		},
		{
			title: 'Longest Common Prefix',
			url: 'https://leetcode.com/problems/longest-common-prefix/',
		},
		{
			title: 'Spiral Matrix',
			url: 'https://leetcode.com/problems/spiral-matrix/',
		},
	],
	BFS: [
		{
			title: 'Word Ladder',
			url: 'https://leetcode.com/problems/word-ladder/',
		},
		{
			title: 'Open the Lock',
			url: 'https://leetcode.com/problems/open-the-lock/',
		},
		{
			title: 'Rotting Oranges',
			url: 'https://leetcode.com/problems/rotting-oranges/',
		},
	],
	Backtracking: [
		{
			title: 'Letter Combinations of a Phone Number',
			url: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/',
		},
		{
			title: 'Subsets',
			url: 'https://leetcode.com/problems/subsets/',
		},
		{
			title: 'Word Search',
			url: 'https://leetcode.com/problems/word-search/',
		},
	],
	'Binary Search': [
		{
			title: 'Search in Rotated Sorted Array',
			url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
		},
		{
			title: 'Find Minimum in Rotated Sorted Array',
			url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
		},
		{
			title: 'Median of Two Sorted Arrays',
			url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
		},
	],
	DFS: [
		{
			title: 'Number of Islands',
			url: 'https://leetcode.com/problems/number-of-islands/',
		},
		{
			title: 'Clone Graph',
			url: 'https://leetcode.com/problems/clone-graph/',
		},
		{
			title: 'Surrounded Regions',
			url: 'https://leetcode.com/problems/surrounded-regions/',
		},
	],
	'Dynamic Programming': [
		{
			title: 'House Robber',
			url: 'https://leetcode.com/problems/house-robber/',
		},
		{
			title: 'Coin Change',
			url: 'https://leetcode.com/problems/coin-change/',
		},
		{
			title: 'Longest Palindromic Substring',
			url: 'https://leetcode.com/problems/longest-palindromic-substring/',
		},
	],
	Greedy: [
		{
			title: 'Jump Game',
			url: 'https://leetcode.com/problems/jump-game/',
		},
		{
			title: 'Partition Labels',
			url: 'https://leetcode.com/problems/partition-labels/',
		},
		{
			title: 'Candy',
			url: 'https://leetcode.com/problems/candy/',
		},
	],
	Hashing: [
		{
			title: 'Group Anagrams',
			url: 'https://leetcode.com/problems/group-anagrams/',
		},
		{
			title: 'Valid Anagram',
			url: 'https://leetcode.com/problems/valid-anagram/',
		},
		{
			title: 'Top K Frequent Elements',
			url: 'https://leetcode.com/problems/top-k-frequent-elements/',
		},
	],
	Heaps: [
		{
			title: 'Top K Frequent Words',
			url: 'https://leetcode.com/problems/top-k-frequent-words/',
		},
		{
			title: 'Merge K Sorted Lists',
			url: 'https://leetcode.com/problems/merge-k-sorted-lists/',
		},
		{
			title: 'Find Median from Data Stream',
			url: 'https://leetcode.com/problems/find-median-from-data-stream/',
		},
	],
	'Sliding Window': [
		{
			title: 'Minimum Size Subarray Sum',
			url: 'https://leetcode.com/problems/minimum-size-subarray-sum/',
		},
		{
			title: 'Longest Substring Without Repeating Characters',
			url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
		},
		{
			title: 'Maximum Average Subarray I',
			url: 'https://leetcode.com/problems/maximum-average-subarray-i/',
		},
	],
	Stacks: [
		{
			title: 'Valid Parentheses',
			url: 'https://leetcode.com/problems/valid-parentheses/',
		},
		{
			title: 'Daily Temperatures',
			url: 'https://leetcode.com/problems/daily-temperatures/',
		},
		{
			title: 'Min Stack',
			url: 'https://leetcode.com/problems/min-stack/',
		},
	],
	'Topological Sort': [
		{
			title: 'Course Schedule',
			url: 'https://leetcode.com/problems/course-schedule/',
		},
		{
			title: 'Alien Dictionary',
			url: 'https://leetcode.com/problems/alien-dictionary/',
		},
		{
			title: 'Course Schedule II',
			url: 'https://leetcode.com/problems/course-schedule-ii/',
		},
	],
	'Two Pointers': [
		{
			title: 'Two Sum II - Input Array Is Sorted',
			url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
		},
		{
			title: '3Sum',
			url: 'https://leetcode.com/problems/3sum/',
		},
		{
			title: 'Remove Duplicates from Sorted Array',
			url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/',
		},
	],
	'Union-Find': [
		{
			title: 'Number of Provinces',
			url: 'https://leetcode.com/problems/number-of-provinces/',
		},
		{
			title: 'Accounts Merge',
			url: 'https://leetcode.com/problems/accounts-merge/',
		},
		{
			title: 'Redundant Connection',
			url: 'https://leetcode.com/problems/redundant-connection/',
		},
	],
}
