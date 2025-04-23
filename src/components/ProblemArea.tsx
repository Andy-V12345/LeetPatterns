import Problem from '@/interfaces/Problem'
import ProblemCard from './ProblemCard'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Pattern, ProblemCardState } from '@/utils/Types'
import ProblemAnswer from './ProblemAnswer'
import { generateProblem } from '@/utils/GeminiFunctions'
import RecapCard from './RecapCard'
import { motion, AnimatePresence } from 'framer-motion'
import { PatternStat } from '@/interfaces/PatternStat'
import SyncLoader from 'react-spinners/SyncLoader'
import { useAuth } from './AuthContext'

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

	const { user } = useAuth()

	const preloadProblems = useCallback(async () => {
		if (focusedPatterns && problemQ.length < 2) {
			console.log('focused:', focusedPatterns)
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

				if (nextProblem) {
					setProblem(nextProblem)
					setProblemQ((prev) => prev.slice(1))
				} else {
					nextProblem = await generateProblem(
						focusedPatterns as Pattern[],
						patternStats
					)
					setProblem(nextProblem)
				}

				setShowAnswer(false)
				setQuestionCount((prev) => {
					return prev + 1
				})
				preloadProblems()
			}
		} else if (focusedPatterns == null) {
			console.error('focusedPatterns undefined')
		} else if (showRecap) {
			setShowRecap(false)
			setCardState('loading')

			let nextProblem = problemQ[0]

			if (nextProblem) {
				setProblem(nextProblem)
				setProblemQ((prev) => prev.slice(1))
			} else {
				nextProblem = await generateProblem(
					focusedPatterns as Pattern[],
					patternStats
				)
				setProblem(nextProblem)
			}

			setShowAnswer(false)
			setQuestionCount((prev) => {
				return prev + 1
			})
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
				saveSession()
			}
		}
	}, [user, focusedPatterns])

	useEffect(() => {
		if (problem) {
			setCardState('default')
			setFirstLoad(false)
		}
	}, [problem])

	return (
		<div className={`self-stretch h-full relative`}>
			<AnimatePresence mode="wait">
				{/* Initial Loading */}
				{firstLoad && (
					<div
						key="load-div"
						className={`flex gap-5 self-stretch h-full relative`}
					>
						<motion.div
							className="w-full h-full flex flex-col items-center justify-center gap-6"
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
								Generating problems...
							</p>
						</motion.div>
					</div>
				)}

				<div
					key="problem-div"
					className={`flex gap-5 self-stretch h-4/5 max-h-[600px] relative`}
				>
					{/* Problem Card */}
					{!showRecap && !firstLoad && (
						<motion.div
							key={`problem-${questionCount}`}
							initial={{ x: '100%', opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: '-100%', opacity: 0 }}
							transition={cardTransition}
							className="flex max-h-full self-stretch w-full gap-5"
						>
							{(problem != null || cardState === 'loading') && (
								<>
									<ProblemCard
										problem={problem}
										cardState={cardState}
										setCardState={setCardState}
										showAnswer={showAnswer}
										setShowAnswer={setShowAnswer}
										updatePatternStats={updatePatternStats}
									/>
									<ProblemAnswer
										showAnswer={showAnswer}
										cardState={cardState}
										answer={problem?.answer ?? null}
										createNewProblem={createNewProblem}
									/>
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
				</div>
			</AnimatePresence>
		</div>
	)
}
