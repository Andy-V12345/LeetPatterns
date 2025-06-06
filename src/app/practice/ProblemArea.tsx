import Problem from '@/interfaces/Problem'
import ProblemCard from './ProblemCard'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
	Pattern,
	ProblemCardState,
	TemplateVariantTitle,
	UIState,
} from '@/utils/Types'
import ProblemAnswer from './ProblemAnswer'
import {
	generatePatternFromCodeProblem,
	generateProblem,
} from '@/utils/GeminiFunctions'
import RecapCard from './RecapCard'
import { motion, AnimatePresence } from 'framer-motion'
import SyncLoader from 'react-spinners/SyncLoader'
import { useAuth } from '../../components/AuthContext'
import { calculateTotalAttempts } from '@/utils/UtilFunctions'
import { useIsMobile } from '@/hooks/use-mobile'
import FlippableCard from './FlippableCard'
import ChatSheet from './ChatSheet'
import { useGeminiChat } from '@/hooks/useGeminiChat'
import Stat from '@/interfaces/Stat'

interface ProblemAreaProps<T> {
	focusedPatterns: T[] | undefined | null
	isPatternFromTemplate: boolean
}

const cardTransition = {
	type: 'spring',
	bounce: 0.2,
	visualDuration: 0.4,
}

export default function ProblemArea<T>({
	focusedPatterns,
	isPatternFromTemplate,
}: ProblemAreaProps<T>) {
	const hasCreatedInitialProblem = useRef(false)
	const [cardState, setCardState] = useState<ProblemCardState>('default')
	const [showAnswer, setShowAnswer] = useState(false)
	const [problem, setProblem] = useState<Problem<T> | null>()
	const [questionCount, setQuestionCount] = useState(0)
	const [showRecap, setShowRecap] = useState(false)
	const [patternStats, setPatternStats] = useState<Stat<T>[]>([])
	const [problemQ, setProblemQ] = useState<Problem<T>[]>([])
	const [firstLoad, setFirstLoad] = useState(true)
	const [selected, setSelected] = useState<string | null>(null)
	const [uiState, setUiState] = useState<UIState>('default')
	const [error, setError] = useState('')

	const { user } = useAuth()
	const { prevSession, setPrevSession, sendMessage, liveResponse } =
		useGeminiChat<T>()

	const isMobile = useIsMobile()

	const preloadProblems = useCallback(async () => {
		if (problemQ.length < 2) {
			try {
				if (isPatternFromTemplate) {
					const next = await generatePatternFromCodeProblem(
						focusedPatterns as TemplateVariantTitle[],
						patternStats as Stat<TemplateVariantTitle>[]
					)

					setProblemQ((prev) => [...prev, next as Problem<T>])
				} else {
					const next = await generateProblem(
						focusedPatterns as Pattern[],
						patternStats as Stat<Pattern>[]
					)

					setProblemQ((prev) => [...prev, next as Problem<T>])
				}
			} catch (error) {
				console.error('Error in preloadProblems():', error)
				setCardState('default')
				setUiState('error')
				setError('Connection lost')
			}
		}
	}, [focusedPatterns, problemQ, patternStats])

	const createNewProblem = useCallback(async () => {
		setPrevSession([]) // clears the chat history
		setSelected(null)
		if (!showRecap) {
			if (
				!isPatternFromTemplate &&
				questionCount > 0 &&
				questionCount % 5 == 0
			) {
				setShowRecap(true)
			} else {
				setCardState('loading')
				let nextProblem = problemQ[0]
				setShowAnswer(false)

				if (nextProblem) {
					setProblem(nextProblem)
					setProblemQ((prev) => prev.slice(1))
					setQuestionCount((prev) => {
						return prev + 1
					})
					preloadProblems()
				} else {
					setQuestionCount((prev) => {
						return prev + 1
					})
					preloadProblems()
					try {
						if (isPatternFromTemplate) {
							nextProblem = (await generatePatternFromCodeProblem(
								focusedPatterns as TemplateVariantTitle[],
								patternStats as Stat<TemplateVariantTitle>[]
							)) as Problem<T>
						} else {
							nextProblem = (await generateProblem(
								focusedPatterns as Pattern[],
								patternStats as Stat<Pattern>[]
							)) as Problem<T>
						}
						setProblem(nextProblem)
					} catch (error) {
						console.error('Error in createNewProblem():', error)
						setCardState('default')
						setUiState('error')
						setError('Connection lost')
					}
				}
			}
		} else if (showRecap) {
			setCardState('loading')
			setShowRecap(false)

			let nextProblem = problemQ[0]
			setShowAnswer(false)

			if (nextProblem) {
				setProblem(nextProblem)
				setProblemQ((prev) => prev.slice(1))
				setQuestionCount((prev) => {
					return prev + 1
				})
				preloadProblems()
			} else {
				setQuestionCount((prev) => {
					return prev + 1
				})
				preloadProblems()
				try {
					if (isPatternFromTemplate) {
						nextProblem = (await generatePatternFromCodeProblem(
							focusedPatterns as TemplateVariantTitle[],
							patternStats as Stat<TemplateVariantTitle>[]
						)) as Problem<T>
					} else {
						nextProblem = (await generateProblem(
							focusedPatterns as Pattern[],
							patternStats as Stat<Pattern>[]
						)) as Problem<T>
					}
					setProblem(nextProblem)
				} catch (error) {
					console.error('Error in createNewProblem():', error)
					setCardState('default')
					setUiState('error')
					setError('Connection lost')
				}
			}
		}
	}, [
		focusedPatterns,
		showRecap,
		questionCount,
		problemQ,
		patternStats,
		preloadProblems,
	])

	const updatePatternStats = useCallback(
		async (pattern: T, isCorrect: boolean) => {
			const updatedStats = patternStats

			const existingIndex = updatedStats.findIndex(
				(stat) => stat.name === pattern
			)

			if (existingIndex !== -1) {
				const stat = updatedStats[existingIndex]
				updatedStats[existingIndex] = {
					...stat,
					correct: stat.correct + (isCorrect ? 1 : 0),
					attempts: stat.attempts + 1,
				}
			} else {
				updatedStats.push({
					name: pattern,
					correct: isCorrect ? 1 : 0,
					attempts: 1,
				})
			}

			if (!isPatternFromTemplate && user) {
				await user!.updatePatternStats(pattern as Pattern, isCorrect)
			}

			setPatternStats(updatedStats)
		},
		[user]
	)

	const handleRetry = () => {
		setUiState('default')
		setFirstLoad(true)
		createNewProblem()
	}

	useEffect(() => {
		if (problem) {
			setCardState('default')
			setFirstLoad(false)
		} else if (!problem && !hasCreatedInitialProblem.current) {
			hasCreatedInitialProblem.current = true
			createNewProblem()
		}
	}, [problem])

	const saveSession = useCallback(async () => {
		if (!isPatternFromTemplate && user) {
			await user.savePrevSession(
				focusedPatterns as Pattern[],
				patternStats as Stat<Pattern>[]
			)
		}
	}, [focusedPatterns, user, patternStats, isPatternFromTemplate])

	useEffect(() => {
		return () => {
			if (user) {
				if (calculateTotalAttempts(patternStats) > 0) {
					saveSession()
				}
			}
		}
	}, [user, focusedPatterns, patternStats])

	return (
		<div
			className={`self-stretch h-full relative ${isMobile ? 'overflow-y-scroll' : ''}`}
		>
			<AnimatePresence mode="wait">
				{/* Initial Loading */}
				{firstLoad && uiState == 'default' && (
					<motion.div
						key="load-div"
						className="flex flex-col justify-center items-center gap-5 h-full relative"
						initial={{ opacity: 1 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.4 }}
					>
						<SyncLoader
							loading={firstLoad}
							color="var(--theme-orange)"
							size={11}
						/>
						<p className="text-foreground font-medium text-base">
							Generating some questions...
						</p>
					</motion.div>
				)}

				{uiState == 'error' && (
					<motion.div
						key="error-div"
						className="flex flex-col justify-center items-center gap-5 h-full relative"
						initial={{ opacity: 1 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
					>
						<div className="flex flex-col justify-center gap-2">
							<p className="font-medium text-base text-wrong-red">
								{error}
							</p>

							<button
								onClick={handleRetry}
								className="px-3 py-2 text-sm text-wrong-red rounded-lg hover:opacity-75 transition-all"
								style={{
									backgroundColor: 'rgba(255, 0, 84, 0.2)',
								}}
							>
								Retry
							</button>
						</div>
					</motion.div>
				)}

				{/* Problem Card */}
				{!firstLoad && uiState != 'error' && !showRecap && (
					<motion.div
						key={`problem-${questionCount}`}
						initial={{ x: '100%', opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{
							x: '-100%',
							opacity: 0,
						}}
						transition={cardTransition}
						className={`flex self-stretch w-full ${isMobile ? `flex-col p-2 h-full` : 'h-10/12 max-h-[600px]'} gap-5 relative`}
						style={{
							perspective: '1000px',
						}}
					>
						{isMobile ? (
							<FlippableCard
								problem={problem}
								cardState={cardState}
								setCardState={setCardState}
								showAnswer={showAnswer}
								setShowAnswer={setShowAnswer}
								updatePatternStats={updatePatternStats}
								createNewProblem={createNewProblem}
								selected={selected}
								setSelected={setSelected}
								isPatternFromTemplate={isPatternFromTemplate}
							/>
						) : (
							<>
								{(problem != null ||
									cardState === 'loading') && (
									<>
										<ProblemCard
											problem={problem}
											cardState={cardState}
											setCardState={setCardState}
											showAnswer={showAnswer}
											setShowAnswer={setShowAnswer}
											updatePatternStats={
												updatePatternStats
											}
											selected={selected}
											setSelected={setSelected}
											isPatternFromTemplate={
												isPatternFromTemplate
											}
										/>
										<ProblemAnswer
											showAnswer={showAnswer}
											cardState={cardState}
											answer={problem?.answer ?? null}
											createNewProblem={createNewProblem}
											isPatternFromTemplate={
												isPatternFromTemplate
											}
										/>
									</>
								)}
							</>
						)}
					</motion.div>
				)}

				{/* Recap Card */}
				{!isPatternFromTemplate && showRecap && (
					<motion.div
						key="recap"
						initial={{ x: '100%', opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: '-100%', opacity: 0 }}
						transition={cardTransition}
						className="w-full h-full"
					>
						<RecapCard
							patternStats={patternStats as Stat<Pattern>[]}
							createNewProblem={createNewProblem}
						/>
					</motion.div>
				)}
			</AnimatePresence>

			<ChatSheet
				messages={prevSession}
				setMessages={setPrevSession}
				liveResponse={liveResponse}
				sendMessage={sendMessage}
				cardState={cardState}
				showRecap={showRecap}
				problem={problem as Problem<T>}
			/>
		</div>
	)
}
