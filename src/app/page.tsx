import { Marquee } from '@/components/magicui/marquee'
import { patterns } from '@/utils/Consts'
import Link from 'next/link'

export default function Home() {
	return (
		<div className="bg-background overflow-hidden h-[100vh] flex flex-col justify-between items-center px-3">
			<Marquee>
				{patterns.map((pattern) => (
					<p className="text-shadow-orange" key={pattern}>
						{pattern}
					</p>
				))}
			</Marquee>

			<div className="bg-background flex gap-3 flex-col justify-center items-center">
				<div className="text-center text-shadow-orange font-bold text-4xl">
					<h1 className="inline">Welcome to </h1>
					<h1 className="text-theme-orange inline">
						LeetPatterns.ai
					</h1>
				</div>

				<p className="sm:max-w-full md:max-w-3/5 text-center">
					Want to land your dream software engineering role? Learn how
					to identify common LeetCode patterns to ace your next
					interview!
				</p>

				<Link
					href="/login"
					className="hover:bg-theme-hover-orange transition-colors py-7 px-9 mt-7 font-bold text-2xl bg-theme-orange rounded-lg"
				>
					Get Started - It's All Free
				</Link>
			</div>

			<Marquee>
				{patterns.map((pattern) => (
					<p className="text-shadow-orange">{pattern}</p>
				))}
			</Marquee>
		</div>
	)
}
