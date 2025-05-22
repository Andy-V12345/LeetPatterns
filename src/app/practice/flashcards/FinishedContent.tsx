import { AnimatedCircularProgressBar } from '@/components/magicui/animated-circular-progress-bar'
import { TemplateVariant } from '@/utils/Types'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useIsMobile } from '@/hooks/use-mobile'
import confetti from 'canvas-confetti'
import { useEffect } from 'react'

interface FinishedContentProps {
	handleStudyStarredItems: () => void
	handleRestart: () => void
	handleStudyUnlearnedCards: (unlearned: TemplateVariant[]) => void
	seen: number
	learned: number
	needToLearnCards: TemplateVariant[]
	leftover: number
	total: number
	isQuizMode: boolean
	starredTemplateVariants: TemplateVariant[]
}

export default function FinishedContent({
	handleStudyStarredItems,
	handleRestart,
	handleStudyUnlearnedCards,
	seen,
	learned,
	needToLearnCards,
	leftover,
	isQuizMode,
	total,
	starredTemplateVariants,
}: FinishedContentProps) {
	const isMobile = useIsMobile()

	const handleConfetti = () => {
		const end = Date.now() + 1 * 1000 // 1 sec
		const colors = ['#f89f1b', '#2bc4ad', '#9e6dfc']

		const frame = () => {
			if (Date.now() > end) return

			confetti({
				particleCount: 2,
				angle: 70,
				spread: 65,
				startVelocity: 60,
				origin: { x: 0, y: 1 },
				colors: colors,
				gravity: 1,
			})
			confetti({
				particleCount: 2,
				angle: 110,
				spread: 65,
				startVelocity: 60,
				origin: { x: 1, y: 1 },
				colors: colors,
				gravity: 1,
			})

			requestAnimationFrame(frame)
		}

		frame()
	}

	useEffect(() => {
		handleConfetti()
	}, [])

	return (
		<motion.div
			className="w-full rounded-lg bg-card-bg p-4 md:p-5 space-y-5"
			initial={{
				x: '100%',
				opacity: 0,
			}}
			animate={{
				x: 0,
				opacity: 1,
				transition: {
					type: 'spring',
					bounce: 0.2,
					duration: 0.4,
				},
			}}
		>
			<h1 className="text-xl md:text-2xl font-bold">
				Nice job! You've reviewed all the templates.
			</h1>

			<div className="grid grid-cols-2 gap-5 md:gap-8">
				{/* how you're doing container */}
				<div
					className={`space-y-4 ${isMobile ? 'col-span-full' : 'col-span-1'}`}
				>
					<h3 className="text-base md:text-lg font-bold text-theme-hover-orange">
						How you're doing
					</h3>

					<div className="flex gap-3 md:gap-5">
						<div>
							<AnimatedCircularProgressBar
								max={100}
								min={0}
								value={
									isQuizMode
										? (learned / total) * 100
										: (seen / total) * 100
								}
								correct={isQuizMode ? learned : seen}
								attempts={total}
								gaugePrimaryColor="var(--correct-green)"
								gaugeSecondaryColor="var(--card-fg)"
								strokeWidth={isMobile ? 6 : 8}
								size={isMobile ? 'size-28' : 'size-40'}
							/>
						</div>

						<div className="w-full text-xs md:text-sm space-y-3">
							<span className="flex bg-[#163B45] items-center px-4 py-2 rounded-full text-[#5AE8B5] font-semibold justify-between">
								<p>{isQuizMode ? 'Learned' : 'Seen'}</p>
								<p>{isQuizMode ? learned : seen}</p>
							</span>

							{isQuizMode && (
								<span className="flex bg-[#451E28] items-center px-4 py-2 rounded-full text-[#FF983A] font-semibold justify-between">
									<p>Need to learn</p>
									<p>{needToLearnCards.length}</p>
								</span>
							)}

							<span className="flex items-center bg-card-fg px-4 py-2 rounded-full text-foreground font-semibold justify-between">
								<p>Templates left</p>
								<p>{leftover}</p>
							</span>
						</div>
					</div>
				</div>

				{/* next steps container */}
				<div
					className={`space-y-4 ${isMobile ? 'col-span-full' : 'col-span-1'}`}
				>
					<h3 className="text-base md:text-lg font-bold text-theme-hover-orange">
						Next steps
					</h3>

					<div className="w-full text-xs md:text-sm space-y-3">
						{starredTemplateVariants.length > 0 && (
							<button
								onClick={handleStudyStarredItems}
								className="flex w-full gap-5 hover:opacity-80 transition-all items-center bg-card-fg rounded-lg p-3 md:p-5"
							>
								<Image
									src="/starred_cards.svg"
									alt={'starred_cards'}
									width={isMobile ? 60 : 80}
									height={isMobile ? 60 : 80}
								/>

								<div className="text-left">
									<p className="font-semibold text-sm md:text-lg">
										Study starred templates
									</p>
									<p>Focus on the templates you starred</p>
								</div>

								<ChevronRight className="ml-auto" />
							</button>
						)}

						{isQuizMode && needToLearnCards.length > 0 && (
							<button
								onClick={() =>
									handleStudyUnlearnedCards(needToLearnCards)
								}
								className="flex w-full gap-5 hover:opacity-80 transition-all items-center bg-card-fg rounded-lg p-3 md:p-5"
							>
								<Image
									src="/unlearned_cards.svg"
									alt={'unlearned_cards'}
									width={isMobile ? 60 : 80}
									height={isMobile ? 60 : 80}
								/>

								<div className="text-left">
									<p className="font-semibold text-sm md:text-lg">
										Study unlearned cards
									</p>
									<p>Focus on the cards you didn't get</p>
								</div>

								<ChevronRight className="ml-auto" />
							</button>
						)}

						<button
							onClick={handleRestart}
							className="flex w-full gap-5 hover:opacity-80 transition-all items-center bg-card-fg rounded-lg p-3 md:p-5"
						>
							<Image
								src="/cards.svg"
								alt={'cards'}
								width={isMobile ? 60 : 80}
								height={isMobile ? 60 : 80}
							/>

							<div className="text-left">
								<p className="font-semibold text-sm md:text-lg">
									Restart
								</p>
								<p>Work on all templates all over again</p>
							</div>

							<ChevronRight className="ml-auto" />
						</button>
					</div>
				</div>
			</div>
		</motion.div>
	)
}
