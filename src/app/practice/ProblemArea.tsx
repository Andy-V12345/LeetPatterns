import Problem from '@/interfaces/Problem'
import ProblemCard from './ProblemCard'
import { SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { Pattern, ProblemCardState } from '@/utils/Types'
import ProblemAnswer from './ProblemAnswer'
import { generateProblem } from '@/utils/GeminiFunctions'
import RecapCard from './RecapCard'
import { motion, AnimatePresence } from 'framer-motion'
import { PatternStat } from '@/interfaces/PatternStat'
import SyncLoader from 'react-spinners/SyncLoader'
import { useAuth } from '../../components/AuthContext'
import { calculateTotalAttempts } from '@/utils/UtilFunctions'
import { useIsMobile } from '@/hooks/use-mobile'
import FlippableCard from './FlippableCard'

interface ProblemAreaProps {
	focusedPatterns: Pattern[] | undefined | null
}

const cardTransition = {
	type: 'spring',
	bounce: 0.2,
	visualDuration: 0.4,
}

export default function ProblemArea({ focusedPatterns }: ProblemAreaProps) {
	const hasCreatedInitialProblem = useRef(false)
	const [cardState, setCardState] = useState<ProblemCardState>('default')
	const [showAnswer, setShowAnswer] = useState(false)
	const [problem, setProblem] = useState<Problem | null>()
	const [questionCount, setQuestionCount] = useState(0)
	const [showRecap, setShowRecap] = useState(false)
	const [patternStats, setPatternStats] = useState<PatternStat[]>([])
	const [problemQ, setProblemQ] = useState<Problem[]>([])
	const [firstLoad, setFirstLoad] = useState(true)
	const [selected, setSelected] = useState<string | null>(null)

	const { user } = useAuth()

	const isMobile = useIsMobile()

	const preloadProblems = useCallback(async () => {
		if (focusedPatterns && problemQ.length < 2) {
			const next = await generateProblem(focusedPatterns, patternStats)
			setProblemQ((prev) => [...prev, next])
		}
	}, [focusedPatterns, problemQ, patternStats])

	const createNewProblem = useCallback(async () => {
		if (focusedPatterns != null && !showRecap) {
			if (questionCount > 0 && questionCount % 5 == 0) {
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
				} else {
					setQuestionCount((prev) => {
						return prev + 1
					})
					nextProblem = await generateProblem(
						focusedPatterns as Pattern[],
						patternStats
					)
					setProblem(nextProblem)
				}

				preloadProblems()
			}
		} else if (focusedPatterns == null) {
			console.error('focusedPatterns undefined')
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
			} else {
				setQuestionCount((prev) => {
					return prev + 1
				})
				nextProblem = await generateProblem(
					focusedPatterns as Pattern[],
					patternStats
				)
				setProblem(nextProblem)
			}

			preloadProblems()
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
		async (pattern: Pattern, isCorrect: boolean) => {
			const updatedStats = patternStats

			const existingIndex = updatedStats.findIndex(
				(stat) => stat.pattern === pattern
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
					pattern,
					correct: isCorrect ? 1 : 0,
					attempts: 1,
				})
			}

			if (user) {
				await user!.updatePatternStats(pattern, isCorrect)
			}

			setPatternStats(updatedStats)
		},
		[user]
	)

	useEffect(() => {
		if (
			focusedPatterns != null &&
			!problem &&
			!hasCreatedInitialProblem.current
		) {
			hasCreatedInitialProblem.current = true
			preloadProblems()
			createNewProblem()
		}
	}, [focusedPatterns, problem])

	const saveSession = useCallback(async () => {
		if (user && focusedPatterns) {
			await user.savePrevSession(focusedPatterns, patternStats)
		}
	}, [focusedPatterns, user, patternStats])

	useEffect(() => {
		return () => {
			if (user) {
				if (calculateTotalAttempts(patternStats) > 0) {
					saveSession()
				}
			}
		}
	}, [user, focusedPatterns, patternStats])

	useEffect(() => {
		if (problem) {
			setCardState('default')
			setFirstLoad(false)
		}
	}, [problem])

	return (
		<div
			className={`self-stretch h-full relative ${isMobile ? 'overflow-y-scroll' : ''}`}
		>
			<AnimatePresence mode="wait">
				{/* Initial Loading */}
				{firstLoad && (
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

				{/* Problem Card */}
				{!firstLoad && !showRecap && (
					<motion.div
						key={`problem-${questionCount}`}
						initial={{ x: '100%', opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{
							x: '-100%',
							opacity: 0,
						}}
						transition={cardTransition}
						className={`flex self-stretch w-full ${isMobile ? `flex-col p-2 h-full` : 'h-4/5 max-h-[600px]'} gap-5 relative`}
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
										/>
										<ProblemAnswer
											showAnswer={showAnswer}
											cardState={cardState}
											answer={problem?.answer ?? null}
											createNewProblem={createNewProblem}
										/>
									</>
								)}
							</>
						)}
					</motion.div>
				)}

				{/* Recap Card */}
				{showRecap && (
					<motion.div
						key="recap"
						initial={{ x: '100%', opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: '-100%', opacity: 0 }}
						transition={cardTransition}
						className="w-full h-full"
					>
						<RecapCard
							patternStats={patternStats}
							createNewProblem={createNewProblem}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
