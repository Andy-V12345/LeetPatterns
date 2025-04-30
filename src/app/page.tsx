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

export default function Home() {
	const isMobile = useIsMobile()

	const { user, isLoading } = useAuth()
	const { theme } = useTheme()

	return (
		<div
			className={`relative bg-background px-5 overflow-hidden h-[100svh] flex flex-col justify-between items-center`}
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
					<div
						className="flex items-center md:px-10 lg:px-20 justify-between w-full"
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

					<div className="bg-background mb-10 flex gap-3 flex-col justify-center items-center">
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
							Want to land your dream software engineering role?
							Learn how to identify common LeetCode patterns to
							ace your next interview!
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

					<ThemeSwitch className="absolute bottom-12 right-5" />

					<Marquee className="relative">
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
