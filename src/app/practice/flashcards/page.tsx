'use client'

import { useProtectedRoute } from '@/components/AuthContext'
import { useIsMobile } from '@/hooks/use-mobile'
import Link from 'next/link'
import Flashcard from './Flashcard'
import { getTemplateVariants } from '@/utils/UtilFunctions'
import { useEffect, useState, useCallback } from 'react'
import {
	Check,
	ChevronLeft,
	ChevronRight,
	Shuffle,
	Undo,
	X,
} from 'lucide-react'
import { animate, AnimatePresence, motion } from 'framer-motion'
import { Switch } from '@/components/ui/switch'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'

const cardTransition = {
	type: 'spring',
	bounce: 0.2,
	visualDuration: 0.4,
}

export default function FlashcardsPracticePage() {
	useProtectedRoute()

	const [isQuizMode, setIsQuizMode] = useState(false)
	const [variantIdx, setVariantIdx] = useState(0)
	const [dir, setDir] = useState(1)
	const [isAnimating, setIsAnimating] = useState(false)
	const [isAnswering, setIsAnswering] = useState(false)
	const [answerDirection, setAnswerDirection] = useState<
		null | 'left' | 'right'
	>(null) // left is wrong and right is correct

	/* animation variants */
	const answeringOverlayVariants = {
		initial: {
			x: 0,
			rotate: 0,
		},
		animate: {
			rotate: answerDirection == 'left' ? 1 : -1,
			transition: {
				type: 'spring',
				bounce: 0.5,
			},
		},
		exit: {
			x: answerDirection == 'left' ? '-100%' : '100%',
			opacity: 0,
			rotate: answerDirection == 'left' ? -15 : 15,
			transition: {
				ease: 'easeIn',
				duration: 0.3,
			},
		},
	}
	const quizModeVariants = {
		initial: {},
		animate: {},
		exit: {},
	}

	const normalVariants = {
		initial: {
			x: dir > 0 ? '100%' : '-100%',
			opacity: 0,
		},
		animate: {
			x: 0,
			opacity: 1,
			transition: {
				type: 'spring',
				bounce: 0.2,
				duration: 0.4,
			},
		},
		exit: {
			opacity: 0,
			transition: { duration: 0.15 },
		},
	}

	const isMobile = useIsMobile()
	const templateVariants = getTemplateVariants()

	const handleNextQuestion = useCallback(() => {
		setVariantIdx((prevIdx) => {
			if (prevIdx < templateVariants.length - 1) {
				setDir(1)
				return prevIdx + 1
			}
			return prevIdx
		})
	}, [templateVariants.length])

	const handlePrevQuestion = useCallback(() => {
		setVariantIdx((prevIdx) => {
			if (prevIdx > 0) {
				setDir(-1)
				return prevIdx - 1
			}
			return prevIdx
		})
	}, [])

	const handleAnswer = async (isCorrect: boolean) => {
		if (isAnimating) {
			return
		}
		setIsAnimating(true)
		setAnswerDirection(isCorrect ? 'right' : 'left')
		setIsAnswering(true)
		handleNextQuestion()

		// Wait for animation to finish before moving to next card
		await new Promise((resolve) => setTimeout(resolve, 400))
		setIsAnswering(false)
		setAnswerDirection(null)

		await new Promise((resolve) => setTimeout(resolve, 325))
		setIsAnimating(false)
	}

	const handleSwitchChange = useCallback(() => {
		setIsQuizMode(!isQuizMode)
	}, [isQuizMode])

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			switch (event.code) {
				case 'ArrowRight':
					if (isQuizMode) {
						handleAnswer(true)
					} else {
						handleNextQuestion()
					}
					break
				case 'ArrowLeft':
					if (isQuizMode) {
						handleAnswer(false)
					} else {
						handlePrevQuestion()
					}
					break
			}
		}
		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [handleNextQuestion, handlePrevQuestion, isQuizMode, handleAnswer])

	return (
		<TooltipProvider>
			<div>
				<div className="mx-auto scrollbar-hide overflow-x-visible gap-6 p-6 w-full md:w-11/12 flex h-[100svh] flex-col items-center">
					<div
						className={`flex ${isMobile ? 'flex-col gap-4' : 'flex-row gap-10'} justify-between items-center w-full self-start`}
					>
						<h1 className="text-2xl w-full text-left font-bold text-theme-orange">
							Flashcard Template Practice
						</h1>

						{/* Dashboard Button */}
						<Link
							href={'/dashboard'}
							className={`bg-card-bg hover:opacity-65 transition-all ${isMobile ? 'self-stretch text-center' : 'ml-auto'} text-sm font-medium px-4 py-3 rounded-md`}
						>
							{isMobile ? 'Go to Dashboard' : 'Dashboard'}
						</Link>
					</div>

					<div className="relative flex w-full h-[450px]">
						<AnimatePresence mode="wait">
							<motion.div
								key={`${variantIdx}-${isAnswering}`} // so AnimatePresence resets on each animation
								className="flex w-full h-full"
								variants={
									isQuizMode
										? quizModeVariants
										: normalVariants
								}
								initial={'initial'}
								animate={'animate'}
								exit={'exit'}
							>
								<Flashcard
									variant={templateVariants[variantIdx]}
									showTip={variantIdx === 0}
								/>
							</motion.div>

							{/* correct / incorrect overlay for quiz mode */}
							{isQuizMode && isAnswering && (
								<motion.div
									variants={answeringOverlayVariants}
									initial="initial"
									animate="animate"
									exit="exit"
									className="h-full w-full absolute bg-card-bg rounded-lg flex justify-center items-center"
									style={{
										boxShadow: `0 0 10px 3px ${answerDirection == 'left' ? 'var(--wrong-red)' : 'var(--correct-green)'}`,
									}}
								>
									<p
										className={`font-bold text-4xl md:text-5xl ${answerDirection == 'left' ? 'text-wrong-red' : 'text-correct-green'}`}
									>
										{answerDirection == 'left'
											? "Didn't get it"
											: 'Got it'}
									</p>
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					{/* control bar */}
					<div className="flex relative items-center justify-center w-full">
						<div className="left-0 flex absolute items-center gap-3 font-semibold text-theme-orange">
							<p>Quiz mode</p>
							<Switch
								checked={isQuizMode}
								onCheckedChange={handleSwitchChange}
								isTheme={false}
							/>
						</div>

						<div className="flex mx-auto items-center gap-6">
							{isQuizMode ? (
								/* quiz mode button */
								<>
									<button
										onClick={() => handleAnswer(false)}
										className={`hover:opacity-75 transition-all border border-wrong-red px-4 py-1 rounded-full`}
									>
										<X color="var(--wrong-red)" size={30} />
									</button>
									<button
										onClick={() => handleAnswer(true)}
										className={`hover:opacity-75 transition-all border border-correct-green px-4 py-1 rounded-full`}
									>
										<Check
											color="var(--correct-green)"
											size={30}
										/>
									</button>
								</>
							) : (
								/* normal mode buttons */
								<>
									<button
										disabled={variantIdx === 0}
										onClick={handlePrevQuestion}
										className={`${variantIdx === 0 ? 'opacity-50 pointer-events-none' : ''} hover:opacity-75 transition-all border border-theme-hover-orange px-4 py-1 rounded-full`}
									>
										<ChevronLeft
											color="var(--theme-hover-orange)"
											size={30}
										/>
									</button>
									<button
										disabled={
											variantIdx ===
											templateVariants.length - 1
										}
										onClick={handleNextQuestion}
										className={`${variantIdx === templateVariants.length - 1 ? 'opacity-50 pointer-events-none' : ''} hover:opacity-75 transition-all border border-theme-hover-orange px-4 py-1 rounded-full`}
									>
										<ChevronRight
											color="var(--theme-hover-orange)"
											size={30}
										/>
									</button>
								</>
							)}
						</div>
						<Tooltip>
							<TooltipTrigger asChild>
								<button className="absolute right-0">
									{isQuizMode ? <Undo /> : <Shuffle />}
								</button>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>{isQuizMode ? 'Undo' : 'Shuffle cards'}</p>
							</TooltipContent>
						</Tooltip>
					</div>
				</div>
			</div>
		</TooltipProvider>
	)
}
