import { Marquee } from "@/components/magicui/marquee";

export default function Home() {

	const patterns = [
		"Arrays / Strings",
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

	return (
		<div className="bg-background overflow-hidden h-[100vh] flex flex-col justify-between items-center px-3">
			<Marquee>
				{
					patterns.map((pattern) => (
						<p key={pattern}>{pattern}</p>
					))
				}
			</Marquee>

			<div className="bg-background overflow-hidden flex gap-3 flex-col justify-center items-center">
				<div className="text-center font-bold text-4xl">
					<h1 className="inline"> Welcome to </h1>
					<h1 className="text-theme-orange inline">LeetPatterns.ai</h1>
				</div>

				<p
					className="sm:max-w-full md:max-w-1/2 text-center"
				>
					Want to land your dream software engineering role? Learn how to identify common LeetCode patterns to ace your next interview!
				</p>
			</div>

			<Marquee>
				{
					patterns.map((pattern) => (
						<p>{pattern}</p>
					))
				}
			</Marquee>
		</div>
	);
}
