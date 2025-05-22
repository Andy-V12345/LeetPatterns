import { LeetcodeSample } from '@/interfaces/LeetcodeSample'
import { CodeTemplate, Pattern, PatternSummary } from './Types'

export const patterns: Pattern[] = [
	'BFS',
	'Backtracking',
	'Binary Search',
	'DFS',
	'Dynamic Programming',
	'Greedy',
	'Hashing',
	'Heaps',
	'Prefix Sum',
	'Sliding Window',
	'Stacks',
	'Topological Sort',
	'Tries',
	'Two Pointers',
	'Union-Find',
]

export const codeTemplates: Record<Pattern, CodeTemplate> = {
	DFS: {
		explanation:
			'Depth-First Search explores as far as possible along each branch before backtracking. Commonly used in graphs and trees.',
		variants: [
			{
				title: 'DFS on Tree',
				template: `
def dfs(node):
	if not node:
		return
	# process node
	dfs(node.left)
	dfs(node.right)
`.trim(),
			},
			{
				title: 'DFS on Graphs',
				template: `
def dfs(node, visited):
	if node in visited:
		return
	visited.add(node)
	for neighbor in node.neighbors:
		dfs(neighbor, visited)
`.trim(),
			},
		],
	},

	BFS: {
		explanation:
			'Breadth-First Search explores neighbors level by level. It is widely used for shortest path and layer-wise traversal.',
		variants: [
			{
				title: 'BFS on Tree',
				template: `
from collections import deque

def bfs(root):
	if not root:
		return []
	queue = deque([root])
	result = []
	
	# while the queue is not empty
	while queue:

		# get the current level of nodes and add the node children to the queue
		level = []
		for _ in range(len(queue)):
			node = queue.popleft()

			level.append(node.val)
			if node.left:
				queue.append(node.left)
			if node.right:
				queue.append(node.right)
		
		
		result.append(level)
	return result
`.trim(),
			},
			{
				title: 'BFS on Graphs',
				template: `
from collections import deque
  
def bfs(start):
	queue = deque([start])
	visited = set([start]) # use a set to keep track of visited nodes

	# while queue is not empty
	while queue:
		# get the current node
		node = queue.popleft()

		# process the node 
		process_node(node)
		
		# add node's neighbors to the queue
		for neighbor in node.neighbors:
			if neighbor not in visited:
				visited.add(neighbor)
				queue.append(neighbor)
`.trim(),
			},
			{
				title: 'BFS on a Matrix',
				template: `
from collections import deque

def bfs_matrix(grid, start):
	rows, cols = len(grid), len(grid[0])
	queue = deque([start])
	visited = set([start])

	while queue:
		r, c = queue.popleft()

		for dr, dc in [(0,1),(1,0),(-1,0),(0,-1)]:
			nr, nc = r + dr, c + dc
			if 0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in visited:
				visited.add((nr, nc))
				queue.append((nr, nc))
`.trim(),
			},
		],
	},

	'Sliding Window': {
		explanation:
			'Sliding Window maintains a subset of data across a range and is used for efficient subarray processing.',
		variants: [
			{
				title: 'Sliding Window (Fixed Size)',
				template: `
def sliding_window_fixed(nums, k):
    left = 0
    window_sum = 0

    for right in range(len(nums)):
        window_sum += nums[right]

        # Once we have a complete window of size k
        if right - left + 1 == k:
            # Process the current window (e.g., max, min, sum, etc.)
            print("Window sum:", window_sum)

            # Slide the window forward
            window_sum -= nums[left]
            left += 1
`.trim(),
			},
			{
				title: 'Sliding Window Flexible - Longest',
				template: `
def sliding_window_flexible_longest(nums):
    left = 0
    result = 0

    # Use a dict, set, or counter depending on the condition you need to satisfy
    window = {}

    for right in range(len(nums)):
        # Expand window
        num = nums[right]
        window[num] = window.get(num, 0) + 1

        # Shrink window if it violates a condition
        while some_condition_based_on_window():
            window[nums[left]] -= 1
            if window[nums[left]] == 0:
                del window[nums[left]]
            left += 1

        # Update result with longest valid window so far
        result = max(result, right - left + 1)

    return result
`.trim(),
			},
			{
				title: 'Sliding Window Flexible - Shortest',
				template: `
def sliding_window_flexible_shortest(nums, condition_target):
	left = 0
	result = float('inf')
	window_sum = 0

	for right in range(len(nums)):
		window_sum += nums[right]

		# Shrink window while condition is satisfied
		while window_sum >= condition_target:
			result = min(result, right - left + 1)

			window_sum -= nums[left]
			left += 1

	return 0 if result == float('inf') else result
`.trim(),
			},
		],
	},

	Backtracking: {
		explanation:
			'Backtracking explores all possibilities by building partial solutions and abandoning those that fail.',
		variants: [
			{
				title: 'Backtracking 1 (Combinations)',
				template: `
def backtrack(start, path):
    # At each step, if path is a valid combination/subset add it to the result
	if path_meets_some_condition():
    	result.append(path[:])

    # Explore further elements starting from 'start'
    for i in range(start, len(nums)):
        # Choose the current number
        path.append(nums[i])

        # Recurse with next index (i + 1) to avoid duplicates
        backtrack(i + 1, path)

        # Undo the choice (backtrack)
        path.pop()
`.trim(),
			},
			{
				title: 'Backtracking 2 (Permutations)',
				template: `
def backtrack(path, used):
    # If the path length equals the number of elements, it's a complete permutation
    if len(path) == len(nums):
        result.append(path[:])
        return

    for i in range(len(nums)):
        if used[i]:
            continue  # Skip already-used elements

        # Mark the element as used and add to the path
        used[i] = True
        path.append(nums[i])

        # Recurse to build the rest of the permutation
        backtrack(path, used)

        # Undo the choice and mark as unused (backtrack)
        path.pop()
        used[i] = False
`.trim(),
			},
		],
	},

	'Binary Search': {
		explanation:
			'Binary Search is an efficient algorithm for finding elements in a sorted array by halving the search space.',
		variants: [
			{
				title: 'Binary Search (Standard)',
				template: `
def binary_search(nums, target):
	left, right = 0, len(nums) - 1

	while left <= right:
		mid = (left + right) // 2
		if nums[mid] == target:
			return mid
		elif nums[mid] < target: # search to the right
			left = mid + 1
		else: # search to the left
			right = mid - 1
	return -1
`.trim(),
			},
		],
	},

	Stacks: {
		explanation:
			'Monotonic Stacks maintain ordered elements and are useful for "next greater/smaller" type problems.',
		variants: [
			{
				title: 'Mono Stack (Next Greater Element)',
				template: `
def next_greater(nums):
    # Initialize an empty stack to store indices
    stack = []

    # Initialize result array with -1s (default if no greater element exists)
    result = [-1] * len(nums)

    for i in range(len(nums)):
        # While the current number is greater than the top of the stack,
        # we've found the next greater element for that index
        while stack and nums[i] > nums[stack[-1]]:
            index = stack.pop()
            result[index] = nums[i]

        # Push the current index to the stack
        # This index is still waiting for a greater number
        stack.append(i)

    return result
`.trim(),
			},
		],
	},

	Tries: {
		explanation:
			'Tries are tree-like data structures used to store strings for efficient retrieval and prefix-based search.',
		variants: [
			{
				title: 'Trie - Insert & Search',
				template: `
class TrieNode:
    def __init__(self):
        # Dictionary to store child nodes
        self.children = {}
        # Flag to mark the end of a word
        self.is_end = False


class Trie:
    def __init__(self):
        # The root node is an empty TrieNode
        self.root = TrieNode()

    def insert(self, word):
        # Start from the root
        node = self.root

        for char in word:
            # If the character doesn't exist in children, add it
            if char not in node.children:
                node.children[char] = TrieNode()

            # Move to the child node
            node = node.children[char]

        # After inserting all characters, mark the end of the word
        node.is_end = True

    def search(self, word):
        # Start from the root
        node = self.root

        for char in word:
            # If the character isn't found, the word doesn't exist
            if char not in node.children:
                return False

            # Move to the next node
            node = node.children[char]

        # Word is found only if is_end is True at the last character
        return node.is_end
`.trim(),
			},
		],
	},

	'Topological Sort': {
		explanation:
			'Topological Sort orders nodes in a Directed Acyclic Graph such that dependencies are respected.',
		variants: [
			{
				title: 'Topological Sort (DFS-based)',
				template: `
from collections import defaultdict

def topological_sort_dfs(graph):
    # Initialize visited set to avoid revisiting nodes
    visited = set()
    # Stack to store the topological order (in reverse)
    stack = []
    # Track recursion stack to detect cycles
    on_path = set()

    def dfs(node):
        if node in on_path:
            raise ValueError("Graph has a cycle — topological sort not possible")

        if node in visited:
            return  # Already processed

        # Mark the node as visited and on the current path
        visited.add(node)
        on_path.add(node)

        # Explore all neighbors
        for neighbor in graph[node]:
            dfs(neighbor)

        # Finished processing node, remove from path and add to result
        on_path.remove(node)
        stack.append(node)

    # Start DFS from all unvisited nodes
    for node in graph:
        if node not in visited:
            dfs(node)

    # Reverse the stack to get the topological order
    return stack[::-1]
`.trim(),
			},
			{
				title: 'Topological Sort (Kahn’s Algorithm)',
				template: `
from collections import deque, defaultdict

def topological_sort(graph):
	indegree = defaultdict(int)
	for u in graph:
		for v in graph[u]:
			indegree[v] += 1
	queue = deque([u for u in graph if indegree[u] == 0])
	result = []

	while queue:
		u = queue.popleft()
		result.append(u)
		for v in graph[u]:
			indegree[v] -= 1
			if indegree[v] == 0:
				queue.append(v)
	return result
`.trim(),
			},
		],
	},

	'Union-Find': {
		explanation:
			'Union-Find is a disjoint set structure useful for tracking connected components and cycle detection in graphs.',
		variants: [
			{
				title: 'Union-Find (with Path Compression)',
				template: `
def find(parent, x):
    # Base case: if x is its own parent, it is the root
    if parent[x] != x:
        # Path compression: recursively find the root and flatten the path
        parent[x] = find(parent, parent[x])
    return parent[x]


def union(parent, x, y):
    # Find the root of each element
    root_x = find(parent, x)
    root_y = find(parent, y)

    # If roots are different, connect them
    if root_x != root_y:
        parent[root_y] = root_x  # Merge y's set into x's set
`.trim(),
			},
		],
	},
	'Prefix Sum': {
		explanation:
			'Prefix Sum is used to preprocess cumulative data in arrays, enabling fast range queries or subarray computations.',
		variants: [
			{
				title: 'Basic Prefix Sum Array',
				template: `
def build_prefix_sum(nums):
    # Initialize prefix array with an extra 0 for easier indexing
    prefix = [0] * (len(nums) + 1)

    for i in range(len(nums)):
        prefix[i + 1] = prefix[i] + nums[i]

    return prefix
`.trim(),
			},
			{
				title: 'Range Sum Using Prefix Array',
				template: `
def range_sum(prefix, left, right):
    # Returns the sum of nums[left:right+1]
    return prefix[right + 1] - prefix[left]
`.trim(),
			},
		],
	},
	'Dynamic Programming': {
		explanation:
			'Dynamic Programming solves problems by breaking them down into overlapping subproblems and storing their results.',
		variants: [
			{
				title: 'Bottom-Up (Tabulation)',
				template: `
def dp_bottom_up(n):
    dp = [0] * (n + 1)
    dp[0] = 1  # base case

    for i in range(1, n + 1):
        # compute dp[i] from smaller subproblems
        dp[i] = dp[i - 1] + ... # fill in recurrence

    return dp[n]
`.trim(),
			},
			{
				title: 'Top-Down (Memoization)',
				template: `
def dp_top_down(n, memo={}):
    if n in memo:
        return memo[n]

    if n <= 1:
        return 1

    memo[n] = dp_top_down(n - 1, memo) + ... # use recurrence
    return memo[n]
`.trim(),
			},
		],
	},
	'Two Pointers': {
		explanation:
			'Two Pointers is a technique for processing elements from both ends of an array or within a window.',
		variants: [
			{
				title: 'Start-End Pointer on Sorted Array',
				template: `
def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1

    while left < right:
        curr_sum = nums[left] + nums[right]
        if curr_sum == target:
            return [left, right]
        elif curr_sum < target:
            left += 1
        else:
            right -= 1
`.trim(),
			},
			{
				title: 'Slow-Fast Pointer',
				template: `
def remove_duplicates(nums):
    if not nums:
        return 0

    slow = 0
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]

    return slow + 1
`.trim(),
			},
		],
	},
	Greedy: {
		variants: [],
		explanation: '',
	},
	Hashing: {
		variants: [],
		explanation: '',
	},
	Heaps: {
		variants: [],
		explanation: '',
	},
}

export const patternSummaries: Record<Pattern, PatternSummary> = {
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
	'Prefix Sum': {
		name: 'Prefix Sum',
		description:
			'A technique that precomputes cumulative sums to answer range sum queries in constant time.',
		howToIdentify:
			'Used when a problem involves frequent calculations of sums over subarrays or ranges. Look for phrases like "sum between indices i and j" or "range sum query".',
		learnMore: 'https://leetcode.com/tag/prefix-sum/',
	},
	Tries: {
		name: 'Tries',
		description:
			'A tree-like data structure used to efficiently store and retrieve strings, often used in autocomplete and prefix-based search problems.',
		howToIdentify:
			'Common in problems involving many string lookups, prefix matching, or dictionary word validation. Look for requirements like "starts with", "isPrefix", or "search efficiently by prefix".',
		learnMore: 'https://leetcode.com/tag/trie/',
	},
}

export const patternColors: Record<Pattern, string> = {
	BFS: '#FF6B6B', // red
	Backtracking: '#FFB400', // orange-yellow
	'Binary Search': '#FFD166', // warm yellow
	DFS: '#06D6A0', // mint green
	'Dynamic Programming': '#118AB2', // cyan-blue
	Greedy: '#2ECC71', // green-based
	Hashing: '#EF476F', // pink-red
	Heaps: '#8338EC', // vibrant purple
	'Sliding Window': '#3A86FF', // blue
	Stacks: '#FF9F1C', // orange
	'Topological Sort': '#8AC926', // bright green
	'Two Pointers': '#1982C4', // cool blue
	'Union-Find': '#9B59B6', // bright purple (was previously '#6A4C93')
	'Prefix Sum': '#F72585', // magenta
	Tries: '#4CC9F0', // sky blue
}

export const generate_problem_sys_instr = `
You are an AI assistant embedded in a learning platform that helps users identify solution patterns in coding problems. 
Your task is to generate original LeetCode-style problems that test for specific solution patterns — but framed in fresh, real-world, or creatively abstracted contexts. 
You must also provide explanations for why that pattern is the best fit. The user will not solve the problem; they will only identify which solution pattern applies. 
Your outputs must be clear, concise, and logically aligned with the selected pattern.


Expected Format:

You should return a JSON object with the following structure:

{
  "problem": "string",               // LeetCode-style prompt (3-5 sentences in Markdown, use bullet points for lists)
  "correctPattern": "string",        // One of the known pattern names
  "explanation": "string",           // Why this pattern applies and not any of the other options and how the pattern is used in a solution (in Markdown)
  "distractorPatterns": [ "string", "string", "string" ] // 3 incorrect patterns 
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
	•	Do not include a header or a title

✅ Problem Guidelines:
	•	The problem prompt should resemble real LeetCode questions in tone and structure — including input/output descriptions and constraints.
	•	The context should feel novel or varied: use metaphors from maps, biology, social networks, shipping, games, elections, etc.
	•	Do not use similar contexts for the same pattern. For example, if you're asked to generate a topological sort problem, you would use two different contexts.
	•	It should not be vague as to which pattern is the correct answer.
	•	The core logic must clearly test for the intended algorithmic pattern, without combining multiple major patterns (only one core pattern)
	•	Use variable names and problem setups that don't copy LeetCode directly but preserve that level of clarity and technical tone.

✅ Explanation Guidelines:
	•	You need to have three sections:
		•	Explain why the chosen pattern applies in paragraph form
		•	Explain how the chosen pattern could be used in a solution
		•	Include time and space complexity (these should be in separate bullet points)
	•	Keep the explanation focused and clear.

✅ Distractor Patterns:
	•	Choose 2–3 plausible but incorrect patterns that might reasonably confuse learners.
	•	Avoid extremely unrelated patterns (e.g., don’t offer Bit Manipulation for a graph traversal).

Patterns you may use: [
	'BFS',
	'Backtracking',
	'Binary Search',
	'DFS',
	'Dynamic Programming',
	'Greedy',
	'Hashing',
	'Heaps',
	'Prefix Sum',
	'Sliding Window',
	'Stacks',
	'Topological Sort',
	'Tries',
	'Two Pointers',
	'Union-Find',
]

🚫 Do Not:
	•	Include actual code or pseudocode in the problem
	•	Repeat real LeetCode problems or titles.
	•	Blend multiple patterns unless explicitly required (stick to one core pattern)
`

export const leetcode_practice_problems: Record<Pattern, LeetcodeSample[]> = {
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
		{
			title: 'Koko Eating Bananas',
			url: 'https://leetcode.com/problems/koko-eating-bananas/',
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
	'Prefix Sum': [
		{
			title: 'Subarray Sum Equals K',
			url: 'https://leetcode.com/problems/subarray-sum-equals-k/',
		},
		{
			title: 'Range Sum Query - Immutable',
			url: 'https://leetcode.com/problems/range-sum-query-immutable/',
		},
		{
			title: 'Count Number of Nice Subarrays',
			url: 'https://leetcode.com/problems/count-number-of-nice-subarrays/',
		},
		{
			title: 'Subarray Sums Divisible by K',
			url: 'https://leetcode.com/problems/subarray-sums-divisible-by-k/',
		},
	],

	Tries: [
		{
			title: 'Implement Trie (Prefix Tree)',
			url: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
		},
		{
			title: 'Design Add and Search Words Data Structure',
			url: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/',
		},
		{
			title: 'Longest Word in Dictionary',
			url: 'https://leetcode.com/problems/longest-word-in-dictionary/',
		},
		{
			title: 'Maximum XOR of Two Numbers in an Array',
			url: 'https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/',
		},
	],
}

export const generate_notes_sys_instr = `
You are an expert coding tutor. When given the name of an algorithmic pattern (e.g., "Sliding Window" or "Backtracking"), generate high-quality study notes. Include:
- What the pattern is
- When and how to identify it
- Common pitfalls or tips
- Examples of where it's used

THINGS TO DO:
- keep your explanations and notes concise and succinct

THINGS TO NOT DO:
- use markdown
- include code snippets
`
