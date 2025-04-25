'use client'

import { Marquee } from '@/components/magicui/marquee'
import { patterns } from '@/utils/Consts'
import Link from 'next/link'
import Image from 'next/image'
import { useIsMobile } from '@/hooks/use-mobile'
import { useAuth } from '@/components/AuthContext'
import SyncLoader from 'react-spinners/SyncLoader'

export default function Home() {
	const isMobile = useIsMobile()

	const { user, isLoading } = useAuth()

	return (
		<div className="bg-background overflow-hidden h-[100vh] flex flex-col justify-between items-center">
			{isLoading ? (
				<SyncLoader
					loading={isLoading}
					color="var(--theme-orange)"
					size={10}
					className="my-auto"
				/>
			) : (
				<>
					<div className="flex items-center pt-8 px-5 md:px-10 lg:px-20 justify-between w-full">
						<Link href="/" className="flex items-center gap-3">
							<Image
								src={'/leetpatterns_icon.png'}
								alt={'logo'}
								width={'25'}
								height={'25'}
							/>

							<span className="font-medium text-lg">
								<h1 className="text-white inline">
									leetpatterns
								</h1>
								<h1 className="inline text-theme-orange">.</h1>
								<h1 className="inline text-theme-orange">ai</h1>
							</span>
						</Link>

						{!isMobile && (
							<Link
								href={user != null ? '/dashboard' : '/signup'}
								className="py-3 px-6 text-sm font-semibold bg-theme-orange hover:bg-theme-hover-orange transition-all rounded-xl"
							>
								{user != null ? 'Dashboard' : 'Get Started'}
							</Link>
						)}
					</div>

					<div className="bg-background mb-10 flex gap-3 flex-col justify-center items-center">
						<div className="text-center font-bold text-4xl">
							<h1
								className="inline"
								style={{
									textShadow:
										'3px 3px 1px var(--theme-orange)',
								}}
							>
								Welcome to{' '}
							</h1>
							<h1
								className="inline"
								style={{
									textShadow:
										'3px 3px 1px var(--theme-orange)',
								}}
							>
								LeetPatterns.ai
							</h1>
						</div>

						<p className="sm:max-w-full md:max-w-3/5 text-center">
							Want to land your dream software engineering role?
							Learn how to identify common LeetCode patterns to
							ace your next interview!
						</p>

						{/* <Link
					href="/signup"
					className="home-button mt-4 font-bold text-xl"
				>
					Get Started - It's All Free
				</Link> */}

						<Link
							href={user == null ? '/signup' : '/dashboard'}
							className="button-82-pushable mt-5"
							role="button"
						>
							<span className="button-82-shadow"></span>
							<span className="button-82-edge"></span>
							<span className="button-82-front text-lg font-bold">
								{user == null
									? `Get Started - It's All Free`
									: 'Go To Your Dashboard'}
							</span>
						</Link>
					</div>

					<Marquee>
						{patterns.map((pattern) => (
							<p key={pattern} className="text-shadow-orange">
								{pattern}
							</p>
						))}
					</Marquee>
				</>
			)}
		</div>
	)
}
