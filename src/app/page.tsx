'use client'

import { Marquee } from '@/components/magicui/marquee'
import { patterns } from '@/utils/Consts'
import Link from 'next/link'
import Image from 'next/image'
import { useIsMobile } from '@/hooks/use-mobile'
import { useAuth } from '@/components/AuthContext'
import SyncLoader from 'react-spinners/SyncLoader'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
	BotMessageSquare,
	Boxes,
	ChartNoAxesCombined,
	CheckCircle,
	PiggyBank,
} from 'lucide-react'

const LinkedInIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="#0077B5"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
		<rect width="4" height="12" x="2" y="9" />
		<circle cx="4" cy="4" r="2" />
	</svg>
)

const InstagramIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="url(#instagram-gradient)"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<defs>
			<linearGradient
				id="instagram-gradient"
				x1="0%"
				y1="0%"
				x2="100%"
				y2="100%"
			>
				<stop offset="0%" stopColor="#E1306C" />
				<stop offset="100%" stopColor="#F77737" />
			</linearGradient>
		</defs>
		<rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
		<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
		<line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
	</svg>
)

const MailIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<rect width="20" height="16" x="2" y="4" rx="2" />
		<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
	</svg>
)

export default function Home() {
	const isMobile = useIsMobile()
	const { user, isLoading } = useAuth()
	const [videoLoaded, setVideoLoaded] = useState(false)

	const features = [
		{
			title: 'Pattern Recognition',
			description:
				'Practice with unique, AI-generated problems so you can develop real pattern recognition skills—without relying on memorization.',
		},
		{
			title: 'Interactive Learning',
			description:
				'Chat with Leet, your AI assistant, to get personalized hints, explanations, and real-time support as you work through each problem.',
		},
		{
			title: 'Progress Tracking',
			description:
				'Track your learning journey with detailed progress metrics and personalized recommendations.',
		},
	]

	return (
		<div
			className={`relative scrollbar-hide bg-background pb-5 overflow-x-hidden overflow-y-scroll h-[100svh] flex flex-col ${isMobile ? 'gap-14' : 'gap-20'} items-center`}
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
						className="flex mb-auto items-center px-6 md:px-10 lg:px-20 justify-between w-full"
						style={{
							paddingTop: isMobile ? '30px' : '40px',
						}}
					>
						<Link href="/" className="flex items-center gap-3">
							<Image
								src={'/leetpatterns_icon.svg'}
								alt={'logo'}
								width={'20'}
								height={'20'}
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
						className={`flex my-auto grow pb-10 flex-col justify-center items-center ${isMobile ? 'gap-16 px-6' : 'gap-24'}`}
					>
						{/* Welcome text with CTA */}
						<div className="flex gap-3 flex-col justify-center items-center">
							<div className={`text-center font-bold text-4xl `}>
								<h1
									style={{
										textShadow:
											'2px 2px 1px var(--theme-orange)',
									}}
								>
									Welcome to LeetPatterns.ai
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
							className={`${isMobile ? 'p-2 w-full' : 'p-3 w-9/12'} bg-theme-orange h-fit rounded-xl`}
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

					{/* Gradient Section */}
					<div
						className="w-full space-y-40 pt-20 pb-40 px-4 md:px-6 "
						style={{
							background: `linear-gradient(180deg,
								var(--background) 0%,
								color-mix(in srgb, var(--theme-orange) 20%, var(--background)) 20%,
								color-mix(in srgb, var(--theme-orange) 25%, var(--background)) 30%,
								color-mix(in srgb, var(--theme-orange) 20%, var(--background)) 35%,
								var(--background) 55%)`,
						}}
					>
						{/* Features Section */}
						<div className="max-w-6xl mx-auto">
							<h2
								className={`text-4xl font-bold text-center mb-4 text-theme-hover-orange`}
							>
								Why Choose LeetPatterns.ai?
							</h2>
							<p className="text-center text-foreground mb-16 max-w-2xl mx-auto">
								Master coding patterns with our AI-powered
								platform designed to help you excel in technical
								interviews
							</p>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-4 lg:gap-8">
								{features.map((feature, index) => (
									<motion.div
										key={feature.title}
										className="p-8 rounded-xl bg-background/80 backdrop-blur-sm border border-theme-orange/50 hover:border-theme-orange/40 hover:shadow-lg hover:shadow-theme-orange/30"
										initial={{ opacity: 0, y: 50 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true, amount: 0.3 }}
										transition={{
											duration: 0.6,
											ease: 'easeOut',
										}}
									>
										{feature.title ===
											'Pattern Recognition' && (
											<div className="w-14 h-14 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6">
												<Boxes
													size={35}
													className="text-blue-500 mb-0"
												/>
											</div>
										)}
										{feature.title ===
											'Interactive Learning' && (
											<div className="w-14 h-14 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6">
												<BotMessageSquare
													size={35}
													className="text-purple-500 mb-0"
												/>
											</div>
										)}
										{feature.title ===
											'Progress Tracking' && (
											<div className="w-14 h-14 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-6">
												<ChartNoAxesCombined
													size={35}
													className="text-emerald-500 mb-0"
												/>
											</div>
										)}
										<h3 className="text-xl font-semibold mb-4 text-theme-hover-orange">
											{feature.title}
										</h3>
										<p className="text-muted-foreground leading-relaxed">
											{feature.description}
										</p>
									</motion.div>
								))}
							</div>
						</div>

						{/* Pricing Section */}
						<div className="w-full flex flex-col items-center justify-center">
							<h2 className="text-4xl font-bold text-theme-hover-orange mb-4">
								Simple Pricing
							</h2>
							<p className="text-foreground mb-10 text-center max-w-xl">
								LeetPatterns.ai is{' '}
								<span className="font-semibold text-theme-orange">
									completely free
								</span>{' '}
								for all users. No hidden fees, no subscriptions,
								no card info.
							</p>
							<motion.div
								initial={{ opacity: 0, y: 50 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.3 }}
								transition={{
									duration: 0.6,
									ease: 'easeOut',
								}}
								className="relative flex flex-col md:flex-row bg-background border border-theme-orange/40 rounded-2xl p-6 md:p-8 gap-8 md:gap-12 shadow-lg items-center min-w-[320px] md:max-w-4xl w-full mx-auto"
							>
								{/* Left: Price and Info */}
								<div className="flex-1 self-stretch flex flex-col items-start w-full md:w-auto justify-between">
									<div className="space-y-0">
										<p className="text-4xl font-extrabold text-theme-orange">
											Free
										</p>
										<p className="text-base text-foreground">
											Create an account for unlimited
											access
										</p>
									</div>
									{!isMobile && (
										<div className="flex-1 flex items-center justify-center max-h-[200px] w-full">
											<svg width="0" height="0">
												<defs>
													<linearGradient
														id="piggy-gradient"
														x1="0"
														y1="0"
														x2="1"
														y2="1"
													>
														<stop
															offset="0%"
															stopColor="#34D399"
														/>
														<stop
															offset="100%"
															stopColor="#059669"
														/>
													</linearGradient>
												</defs>
											</svg>
											<PiggyBank
												strokeWidth={1}
												className="w-full h-full"
												stroke="url(#piggy-gradient)"
											/>
										</div>
									)}
								</div>
								{/* Right: Features and CTA */}
								<div className="flex-1 flex flex-col gap-6 self-stretch items-start w-full md:w-auto">
									<ul className="space-y-3 text-base w-full">
										<li className="flex items-start gap-3 leading-normal">
											<CheckCircle className="text-green-500 w-6 h-6 self-start" />
											<div className="flex-1">
												Unlimited access to all Leet
												patterns
											</div>
										</li>
										<li className="flex items-start gap-3 leading-normal">
											<CheckCircle className="text-green-500 w-6 h-6 self-start" />
											<div className="flex-1">
												AI-generated unique problems
											</div>
										</li>
										<li className="flex items-start gap-3 leading-normal">
											<CheckCircle className="text-green-500 w-6 h-6 self-start" />
											<div className="flex-1">
												Progress tracking & dashboard
											</div>
										</li>
										<li className="flex items-start gap-3 leading-normal">
											<CheckCircle className="text-green-500 w-6 h-6 self-start" />
											<div className="flex-1">
												Interactive learning tools
											</div>
										</li>
										<li className="flex items-start gap-3 leading-normal">
											<CheckCircle className="text-green-500 w-6 h-6 self-start" />
											<div className="flex-1">
												Leet Chatbot assistance
											</div>
										</li>
									</ul>
									<Link
										href={
											user == null
												? '/signup'
												: '/dashboard'
										}
										className="w-full"
										role="button"
									>
										<button className="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold py-3 rounded-xl text-lg transition-all hover:opacity-80">
											{user == null
												? 'Create Free Account'
												: 'Go To Dashboard'}
										</button>
									</Link>
								</div>
							</motion.div>
						</div>

						{/* Contact Us Section */}
						<div className="w-full flex flex-col items-center justify-center">
							<h2 className="text-4xl font-bold text-theme-hover-orange mb-4">
								Contact Us
							</h2>
							<p className="text-foreground mb-10 text-center max-w-xl">
								Have questions or feedback? We'd love to hear
								from you!
							</p>
							<motion.div
								initial={{ opacity: 0, y: 50 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.3 }}
								transition={{
									duration: 0.6,
									ease: 'easeOut',
								}}
								className="flex flex-col md:flex-row gap-8 items-center justify-center"
							>
								<a
									href="https://www.linkedin.com/company/leetpatterns-ai/"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-3 text-foreground hover:text-theme-orange transition-colors"
								>
									<LinkedInIcon />
									<span>LinkedIn</span>
								</a>
								<a
									href="https://instagram.com/leetpatterns.ai"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-3 text-foreground hover:text-theme-orange transition-colors"
								>
									<InstagramIcon />
									<span>@leetpatterns.ai</span>
								</a>
								<a
									href="mailto:leetpatterns.ai@gmail.com"
									className="flex items-center gap-3 text-foreground hover:text-theme-orange transition-colors"
								>
									<MailIcon />
									<span>leetpatterns.ai@gmail.com</span>
								</a>
							</motion.div>
						</div>
					</div>

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
