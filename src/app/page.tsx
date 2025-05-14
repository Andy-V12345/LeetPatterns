'use client'

import { Marquee } from '@/components/magicui/marquee'
import { patterns } from '@/utils/Consts'
import Link from 'next/link'
import Image from 'next/image'
import { useIsMobile } from '@/hooks/use-mobile'
import { useAuth } from '@/components/AuthContext'
import SyncLoader from 'react-spinners/SyncLoader'
import ThemeSwitch from '@/components/ThemeSwitch'
import { useTheme } from '@/components/ThemeContext'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Home() {
	const isMobile = useIsMobile()

	const { user, isLoading } = useAuth()
	const { theme } = useTheme()

	const [videoLoaded, setVideoLoaded] = useState(false)

	return (
		<div
			className={`relative scrollbar-hide bg-background px-5 pb-5 overflow-x-hidden overflow-y-scroll h-[100svh] flex flex-col ${isMobile ? 'gap-14' : 'gap-20'} items-center`}
		>
			{isLoading ? (
				<SyncLoader
					loading={isLoading}
					color="var(--theme-orange)"
					size={10}
					className="my-auto"
				/>
			) : (
				<>
					{/* Navbar with logo */}
					<div
						className="flex mb-auto items-center md:px-10 lg:px-20 justify-between w-full"
						style={{
							paddingTop: isMobile ? '30px' : '40px',
						}}
					>
						<Link href="/" className="flex items-center gap-3">
							<Image
								src={'/leetpatterns_icon.png'}
								alt={'logo'}
								width={'25'}
								height={'25'}
							/>

							<span className="font-medium text-xl">
								<h1 className="inline">leetpatterns</h1>
								<h1 className="inline text-theme-orange">.</h1>
								<h1 className="inline text-theme-orange">ai</h1>
							</span>
						</Link>
					</div>

					{/* container for Welcome text and demo video */}
					<div
						className={`flex my-auto grow pb-10 flex-col justify-center items-center ${isMobile ? 'gap-16' : 'gap-24'}`}
					>
						{/* Welcome text with CTA */}
						<div className="flex gap-3 flex-col justify-center items-center">
							<div
								className={`text-center font-bold text-4xl ${theme == 'light' ? 'text-theme-orange' : ''}`}
							>
								<h1
									className="inline"
									style={{
										textShadow:
											theme == 'light'
												? '2px 2px 1px rgba(24, 24, 27, 0.7)'
												: '2px 2px 1px var(--theme-orange)',
									}}
								>
									Welcome to{' '}
								</h1>
								<h1
									className="inline"
									style={{
										textShadow:
											theme == 'light'
												? '2px 2px 1px rgba(24, 24, 27, 0.7)'
												: '2px 2px 1px var(--theme-orange)',
									}}
								>
									LeetPatterns.ai
								</h1>
							</div>

							<p
								className={`sm:max-w-full md:max-w-3/5 text-center ${isMobile ? 'text-sm' : 'text-base'}`}
							>
								Want to land your dream software engineering
								role? Learn how to identify common LeetCode
								patterns to ace your next interview!
							</p>

							<Link
								href={user == null ? '/signup' : '/dashboard'}
								className="button-82-pushable mt-5"
								role="button"
							>
								<span className="button-82-shadow"></span>
								<span className="button-82-edge"></span>
								<span className="button-82-front text-lg text-white font-bold">
									{user == null
										? `Get Started - It's All Free`
										: 'Go To Your Dashboard'}
								</span>
							</Link>
						</div>

						{/* demo video */}
						<motion.div
							className={`${isMobile ? 'p-2 w-full' : 'p-5 w-10/12'} bg-theme-orange h-fit rounded-xl`}
							style={{
								boxShadow:
									'0px 0px 10px 4px var(--theme-hover-orange)',
							}}
							initial={{ opacity: 0, y: 100 }}
							animate={videoLoaded ? { opacity: 1, y: 0 } : {}}
							transition={{ duration: 0.4, ease: 'easeOut' }}
						>
							<video
								autoPlay
								loop
								muted
								playsInline
								preload="auto"
								onCanPlay={() => setVideoLoaded(true)}
								className="rounded-lg"
								src="/leetpatterns-demo2-compressed.mp4"
							/>
						</motion.div>
					</div>

					<ThemeSwitch className="fixed bottom-12 right-5" />

					<Marquee className="fixed bg-background bottom-0">
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
