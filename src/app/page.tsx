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
import { addToInterviewWaitlist } from '@/utils/FirebaseFunctions'
import { CheckCircle, PiggyBank } from 'lucide-react'
import { FeatureCard } from '@/components/FeatureCard'
import { InterviewFeatureCard } from '@/components/InterviewFeatureCard'

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
	const [email, setEmail] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitStatus, setSubmitStatus] = useState<
		'idle' | 'success' | 'error'
	>('idle')

	const handleWaitlistSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!email) return

		setIsSubmitting(true)
		setSubmitStatus('idle')

		const success = await addToInterviewWaitlist(email)

		if (success) {
			setSubmitStatus('success')
			setEmail('')
		} else {
			setSubmitStatus('error')
		}

		setIsSubmitting(false)
	}

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
							<div>
								<h3 className="mb-5 text-center bg-gradient-to-r from-theme-orange to-[#e52e71] bg-clip-text text-transparent font-bold text-2xl lg:text-3xl">
									No more memorizing LeetCode,
								</h3>

								<h1
									className="text-center font-bold text-4xl lg:text-5xl"
									style={{
										textShadow:
											'2px 2px 1px var(--theme-hover-orange)',
									}}
								>
									Welcome to LeetPatterns.ai
								</h1>
							</div>

							<p
								className={`sm:max-w-full md:max-w-3/5 text-gray-400 text-center text-sm md:text-base lg:text-lg`}
							>
								Learn how to identify common coding patterns to
								ace your next interview and land your dream SWE
								job!
							</p>

							<Link
								href={user == null ? '/signup' : '/dashboard'}
								className="relative mt-5 group px-8 py-4 bg-gradient-to-r from-theme-orange to-bright-theme-orange rounded-xl overflow-hidden transition-all duration-300 hover:scale-105"
								role="button"
							>
								<div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
								<span className="relative text-lg font-bold text-white">
									{user == null
										? `Get Started - It's All Free`
										: 'Go To Your Dashboard'}
								</span>
							</Link>
						</div>

						{/* demo video */}
						<motion.div
							className={`${isMobile ? 'w-full' : 'w-9/12'} h-fit rounded-xl`}
							style={{
								boxShadow: `
									0 10px 30px -5px rgba(255, 165, 0, 0.25),
									0 0 20px -5px rgba(255, 165, 0, 0.2),
									0 0 0 1px rgba(255, 165, 0, 0.15)
								`,
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
								color-mix(in srgb, var(--leet-purple) 20%, var(--background)) 20%,
								color-mix(in srgb, var(--leet-purple) 25%, var(--background)) 30%,
								color-mix(in srgb, var(--leet-purple) 20%, var(--background)) 40%,
								var(--background) 65%)`,
						}}
					>
						{/* Features Section */}
						<div className="max-w-6xl mx-auto flex gap-20 flex-col items-center">
							<h2
								className={`text-4xl font-bold text-center bg-gradient-to-r from-theme-orange to-[#e52e71] bg-clip-text text-transparent w-fit leading-[1.5]`}
							>
								All the good stuff
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-4 lg:gap-8">
								<FeatureCard title="Recogition, not memorization" />
								<FeatureCard title="Your own AI assistant" />
								<FeatureCard title="Progress tracking" />
							</div>
						</div>

						{/* Interview Features Section */}
						<div className="max-w-6xl mx-auto">
							<div className="flex flex-col items-center">
								<h2
									className={`text-4xl font-bold text-center mb-4 bg-clip-text bg-gradient-to-r from-leet-blue to-leet-purple text-transparent w-fit leading-[1.5]`}
								>
									Coming soon: Leet Interview
								</h2>
								<p className="text-center text-foreground text-base md:text-lg max-w-2xl mx-auto">
									Ready to see how you'd do in a real
									interview? Go head-to-head with Leet and get
									instant feedback, not just a "thanks for
									applying."
								</p>
							</div>

							<div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
								{[
									'AI mock interviews',
									'Customizable personalities',
									'Voice-based practice',
									'Comprehensive analysis',
								].map((title) => (
									<InterviewFeatureCard
										key={title}
										title={title}
									/>
								))}
							</div>
						</div>

						{/* Waitlist Form */}
						<div className="flex flex-col items-center justify-center gap-10 w-full max-w-4xl mx-auto text-center">
							<div className="space-y-4">
								<h3 className="text-4xl font-bold bg-gradient-to-r from-leet-blue to-leet-purple bg-clip-text text-transparent">
									Join the waitlist
								</h3>
								<p className="text-foreground text-base md:text-lg">
									Be the first to know when Leet Interview
									launches
								</p>
							</div>
							<form
								onSubmit={handleWaitlistSubmit}
								className="flex flex-col gap-6 justify-center items-center w-full"
							>
								<div
									className={`flex w-full justify-center items-center ${isMobile ? 'flex-col gap-5' : 'flex-row gap-5'}`}
								>
									<input
										type="email"
										placeholder="Enter your email"
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										className="w-full px-4 py-3 rounded-xl bg-background/80 backdrop-blur-sm border border-blue-400 focus:outline-none focus:ring-2 [&:-webkit-autofill]:!bg-background/80"
										required
									/>
									<button
										type="submit"
										disabled={
											isSubmitting ||
											email.trim().length == 0
										}
										className={`disabled:opacity-70 flex justify-center items-center relative group px-6 py-3 bg-gradient-to-r from-leet-blue to-leet-purple rounded-xl overflow-hidden transition-all duration-300 ${isMobile ? 'w-full' : ''}`}
									>
										<div
											className={`absolute inset-0 ${
												isSubmitting
													? 'bg-white/20'
													: 'bg-white/50'
											} ${
												isSubmitting ||
												email.trim().length == 0
													? ''
													: 'translate-y-full group-hover:translate-y-0 transition-transform duration-300'
											}`}
										/>
										<span className="relative font-semibold text-white">
											{isSubmitting
												? 'Joining...'
												: 'Join'}
										</span>
									</button>
								</div>

								{submitStatus === 'success' && (
									<motion.p
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.3 }}
										className="text-correct-green text-sm mt-2 w-full"
									>
										Successfully joined the waitlist!
									</motion.p>
								)}
								{submitStatus === 'error' && (
									<motion.p
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.3 }}
										className="text-wrong-red text-sm mt-2 w-full"
									>
										Failed to join waitlist. Please try
										again.
									</motion.p>
								)}
							</form>
						</div>

						{/* Pricing Section */}
						<div className="w-full flex flex-col items-center justify-center">
							<h2 className="text-4xl font-bold mb-4 bg-clip-text bg-gradient-to-r from-theme-orange to-[#e52e71] text-transparent w-fit leading-[1.5]">
								Simple pricing
							</h2>
							<p className="text-foreground mb-20 text-center text-base md:text-lg max-w-xl">
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
								transition={{ duration: 0.6, ease: 'easeOut' }}
								className="relative flex flex-col bg-background/60 backdrop-blur-xl rounded-2xl p-8 gap-6 mx-auto"
								style={{
									boxShadow: `
										0 10px 30px -5px rgba(255, 165, 0, 0.25),
										0 0 20px -5px rgba(255, 165, 0, 0.2),
										0 0 0 1px rgba(255, 165, 0, 0.15)
									`,
								}}
							>
								<div>
									<p className="text-4xl font-extrabold bg-gradient-to-r w-fit from-green-400 to-emerald-600 bg-clip-text text-transparent">
										Free
									</p>
									<p className="text-base text-gray-400 md:text-lg">
										Create an account for unlimited access
									</p>
								</div>

								<ul className="space-y-3 text-lg w-full">
									<li className="flex items-start gap-3 leading-normal">
										<CheckCircle className="text-green-500 w-6 h-6 self-start" />
										<p className="flex-1">
											AI-generated unique problems
										</p>
									</li>
									<li className="flex items-start gap-3 leading-normal">
										<CheckCircle className="text-green-500 w-6 h-6 self-start" />
										<p className="flex-1">
											Progress tracking & dashboard
										</p>
									</li>
									<li className="flex items-start gap-3 leading-normal">
										<CheckCircle className="text-green-500 w-6 h-6 self-start" />
										<p className="flex-1">
											Interactive learning tools
										</p>
									</li>
									<li className="flex items-start gap-3 leading-normal">
										<CheckCircle className="text-green-500 w-6 h-6 self-start" />
										<p className="flex-1">
											Leet assistance
										</p>
									</li>
								</ul>

								<Link
									href={
										user == null ? '/signup' : '/dashboard'
									}
									className="relative mt-10 group px-8 py-4 bg-gradient-to-r from-theme-orange to-bright-theme-orange rounded-xl overflow-hidden transition-all duration-300 w-full text-center"
									role="button"
								>
									<div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
									<span className="relative text-lg font-bold text-white">
										{user == null
											? `Create Free Account`
											: 'Go To Your Dashboard'}
									</span>
								</Link>
							</motion.div>
						</div>

						{/* Contact Us Section */}
						<div className="w-full flex flex-col items-center justify-center">
							<h2 className="text-4xl mb-10 font-bold bg-clip-text bg-gradient-to-r from-theme-orange to-[#e52e71] text-transparent w-fit leading-[1.5]">
								Contact us
							</h2>

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
