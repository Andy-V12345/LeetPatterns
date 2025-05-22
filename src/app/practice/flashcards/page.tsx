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
import { AnimatePresence, motion } from 'framer-motion'
import { Switch } from '@/components/ui/switch'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import FinishedContent from './FinishedContent'
import { FlashcardStatus, TemplateVariant } from '@/utils/Types'
import FlashcardData from '@/interfaces/FlashcardData'

function calcSeenCards(flashcards: FlashcardData[]): number {
	return flashcards.filter((flashcardData) => flashcardData.status == 'seen')
		.length
}

function calcLearnedCards(flashcards: FlashcardData[]): number {
	return flashcards.filter(
		(flashcardData) =>
			flashcardData.status == 'learned' || flashcardData.status == 'seen'
	).length
}

function getNeedToLearnCards(flashcards: FlashcardData[]): TemplateVariant[] {
	const filtered = flashcards.filter(
		(flashcardData) => flashcardData.status == 'need_to_learn'
	)

	return filtered.map((data) => data.templateVariant)
}

function calcLeftover(
	templateVariants: TemplateVariant[],
	flashcards: FlashcardData[]
): number {
	return Math.max(0, templateVariants.length - flashcards.length)
}

export default function FlashcardsPracticePage() {
	useProtectedRoute()

	const [isQuizMode, setIsQuizMode] = useState(false)
	const [variantIdx, setVariantIdx] = useState(0)
	const [dir, setDir] = useState(1)
	const [isAnimating, setIsAnimating] = useState(false)
	const [isAnswering, setIsAnswering] = useState(false)
	const [isUndoing, setIsUndoing] = useState(false)
	const [answerDirection, setAnswerDirection] = useState<
		null | 'left' | 'right'
	>(null) // left is wrong and right is correct
	const [isDone, setIsDone] = useState(false)
	const [starredTemplates, setStarredTemplates] = useState<TemplateVariant[]>(
		[]
	)
	const [starredTemplatesIdx, setStarredTemplatesIdx] = useState<number[]>([])
	const [flashcards, setFlashcards] = useState<FlashcardData[]>([])
	const [templateVariants, setTemplateVariants] = useState<TemplateVariant[]>(
		getTemplateVariants()
	)
	const isMobile = useIsMobile()

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
		initial: isUndoing
			? {
					opacity: 0,
					x: '-100%',
				}
			: {},
		animate: isUndoing
			? {
					x: 0,
					opacity: 1,
					transition: {
						type: 'spring',
						bounce: 0.2,
						duration: 0.5,
					},
				}
			: {},
		exit: isUndoing
			? {
					opacity: 0,
				}
			: {},
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

	const addToStarredList = (i: number, templateVariant: TemplateVariant) => {
		setStarredTemplates((prev) => {
			return [...prev, templateVariant]
		})

		setStarredTemplatesIdx((prev) => {
			return [...prev, i]
		})
	}

	const removeFromStarredList = (
		i: number,
		templateVariant: TemplateVariant
	) => {
		setStarredTemplates((prev) => {
			const filtered = prev.filter(
				(data) => data.title != templateVariant.title
			)
			return prev
		})

		setStarredTemplatesIdx((prev) => {
			const filtered = prev.filter((idx) => idx != i)

			return filtered
		})
	}

	const addToFlashcardList = useCallback(
		(templateVariant: TemplateVariant, status: FlashcardStatus) => {
			setFlashcards((prev) => {
				return [
					...prev,
					{
						templateVariant: templateVariant,
						status: status,
					},
				]
			})
		},
		[setFlashcards]
	)

	const removeFromFlashcardList = () => {
		setFlashcards((prev) => {
			if (prev.length == 0) {
				return prev
			}

			const tmp = [...prev]
			tmp.pop()

			return tmp
		})
	}

	const handleNextQuestion = useCallback(
		(addToList: boolean) => {
			if (addToList) {
				addToFlashcardList(templateVariants[variantIdx], 'seen')
			}

			setVariantIdx((prevIdx) => {
				if (prevIdx < templateVariants.length - 1) {
					setDir(1)
					return prevIdx + 1
				}

				setIsDone(true)
				return prevIdx
			})
		},
		[templateVariants.length]
	)

	const handlePrevQuestion = useCallback((removeFromList: boolean = true) => {
		if (removeFromList) {
			removeFromFlashcardList()
		}
		setVariantIdx((prevIdx) => {
			if (prevIdx > 0) {
				setDir(-1)
				return prevIdx - 1
			}

			return prevIdx
		})
	}, [])

	const handleUndo = async () => {
		if (variantIdx == 0) {
			return
		}

		setIsUndoing(true)
		handlePrevQuestion(true)

		await new Promise((resolve) => setTimeout(resolve, 550)) // wait for the undo animation to complete

		setIsUndoing(false)
	}

	const handleAnswer = async (isCorrect: boolean) => {
		if (isAnimating) {
			return
		}
		setIsAnimating(true)
		setAnswerDirection(isCorrect ? 'right' : 'left')
		setIsAnswering(true)
		handleNextQuestion(false)
		addToFlashcardList(
			templateVariants[variantIdx],
			isCorrect ? 'learned' : 'need_to_learn'
		)

		// Wait for animation to finish before moving to next card
		await new Promise((resolve) => setTimeout(resolve, 400)) // wait for the answer overlay to appear
		setIsAnswering(false)
		setAnswerDirection(null)

		await new Promise((resolve) => setTimeout(resolve, 325)) // wait for the exit animation to finish
		setIsAnimating(false)
	}

	const handleShuffle = () => {}

	const handleSwitchChange = useCallback(() => {
		setIsQuizMode(!isQuizMode)
	}, [isQuizMode])

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			event.preventDefault()
			switch (event.code) {
				case 'ArrowRight':
					if (isQuizMode) {
						handleAnswer(true)
					} else {
						handleNextQuestion(true)
					}
					break
				case 'ArrowLeft':
					if (isQuizMode) {
						handleAnswer(false)
					} else {
						handlePrevQuestion(true)
					}
					break
			}
		}
		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [handleNextQuestion, handlePrevQuestion, isQuizMode, handleAnswer])

	const handleStudyStarredItems = () => {
		setTemplateVariants(starredTemplates)
		setFlashcards([])
		setIsDone(false)
		setVariantIdx(0)
		setIsQuizMode(false)
	}

	const handleStudyUnlearnedCards = (unlearned: TemplateVariant[]) => {
		setTemplateVariants(unlearned)
		setFlashcards([])
		setStarredTemplates([])
		setStarredTemplatesIdx([])
		setIsDone(false)
		setVariantIdx(0)
		setIsQuizMode(true)
	}

	const handleRestart = () => {
		setTemplateVariants(getTemplateVariants())
		setFlashcards([])
		setIsDone(false)
		setVariantIdx(0)
	}

	return (
		<TooltipProvider>
			<div>
				<div className="mx-auto scrollbar-hide overflow-x-visible gap-6 p-6 w-full md:w-10/12 flex h-[100svh] flex-col items-center">
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

					{isDone ? (
						<FinishedContent
							handleStudyStarredItems={handleStudyStarredItems}
							handleRestart={handleRestart}
							seen={calcSeenCards(flashcards)}
							learned={calcLearnedCards(flashcards)}
							needToLearnCards={getNeedToLearnCards(flashcards)}
							leftover={calcLeftover(
								templateVariants,
								flashcards
							)}
							total={templateVariants.length}
							isQuizMode={isQuizMode}
							handleStudyUnlearnedCards={
								handleStudyUnlearnedCards
							}
							starredTemplateVariants={starredTemplates}
						/>
					) : (
						<>
							{/* card area */}
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
											variant={
												templateVariants[variantIdx]
											}
											showTip={variantIdx === 0}
											addToStarredList={addToStarredList}
											removedFromStarredList={
												removeFromStarredList
											}
											starredTemplatesIdx={
												starredTemplatesIdx
											}
											idx={variantIdx}
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
											<Tooltip>
												<TooltipTrigger asChild>
													<button
														onClick={() =>
															handleAnswer(false)
														}
														className={`hover:opacity-75 transition-all border border-wrong-red px-4 py-1 rounded-full`}
													>
														<X
															color="var(--wrong-red)"
															size={30}
														/>
													</button>
												</TooltipTrigger>
												<TooltipContent side="bottom">
													<p className="text-wrong-red">
														Didn't get it
													</p>
												</TooltipContent>
											</Tooltip>
											<Tooltip>
												<TooltipTrigger asChild>
													<button
														onClick={() =>
															handleAnswer(true)
														}
														className={`hover:opacity-75 transition-all border border-correct-green px-4 py-1 rounded-full`}
													>
														<Check
															color="var(--correct-green)"
															size={30}
														/>
													</button>
												</TooltipTrigger>
												<TooltipContent side="bottom">
													<p className="text-correct-green">
														Got it
													</p>
												</TooltipContent>
											</Tooltip>
										</>
									) : (
										/* normal mode buttons */
										<>
											<button
												disabled={variantIdx === 0}
												onClick={() =>
													handlePrevQuestion(true)
												}
												className={`${variantIdx === 0 ? 'opacity-50 pointer-events-none' : ''} hover:opacity-75 transition-all border border-theme-hover-orange px-4 py-1 rounded-full`}
											>
												<ChevronLeft
													color="var(--theme-hover-orange)"
													size={30}
												/>
											</button>
											<button
												onClick={() =>
													handleNextQuestion(true)
												}
												className={`hover:opacity-75 transition-all border border-theme-hover-orange px-4 py-1 rounded-full`}
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
										<button
											disabled={
												isQuizMode &&
												(variantIdx == 0 || isUndoing)
											}
											onClick={
												isQuizMode
													? handleUndo
													: handleShuffle
											}
											className={`absolute right-0 ${isQuizMode && variantIdx == 0 ? 'opacity-50' : 'hover:opacity-75'}`}
										>
											{isQuizMode ? (
												<Undo />
											) : (
												<Shuffle />
											)}
										</button>
									</TooltipTrigger>
									<TooltipContent side="bottom">
										<p>
											{isQuizMode
												? 'Undo'
												: 'Shuffle cards'}
										</p>
									</TooltipContent>
								</Tooltip>
							</div>
						</>
					)}
				</div>
			</div>
		</TooltipProvider>
	)
}
