import Problem from '@/interfaces/Problem'
import ProblemCard from './ProblemCard'
import { useCallback, useEffect, useState } from 'react'
import { Pattern, ProblemCardState } from '@/utils/Types'
import ProblemAnswer from './ProblemAnswer'
import { generateProblem } from '@/utils/GeminiFunctions'
import RecapCard from './RecapCard'
import { motion, AnimatePresence } from 'framer-motion'
import { PatternStat } from '@/interfaces/PatternStat'

interface ProblemAreaProps {
	focusedPatterns: Pattern[] | undefined | null
}

const cardTransition = {
	type: 'spring',
	bounce: 0.2,
	visualDuration: 0.4,
}

export default function ProblemArea({ focusedPatterns }: ProblemAreaProps) {
	const [cardState, setCardState] = useState<ProblemCardState>('default')
	const [showAnswer, setShowAnswer] = useState(false)
	const [problem, setProblem] = useState<Problem | null>()
	const [questionCount, setQuestionCount] = useState(0)
	const [showRecap, setShowRecap] = useState(false)
	const [patternStats, setPatternStats] = useState<PatternStat[]>([])
	const [problemQ, setProblemQ] = useState<Problem[]>([])

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
		(pattern: Pattern, isCorrect: boolean) => {
			setPatternStats((prevStats) => {
				const existingIndex = prevStats.findIndex(
					(stat) => stat.pattern === pattern
				)

				if (existingIndex !== -1) {
					const updated = [...prevStats]
					const stat = updated[existingIndex]
					updated[existingIndex] = {
						...stat,
						correct: stat.correct + (isCorrect ? 1 : 0),
						attempts: stat.attempts + 1,
					}

					return updated
				} else {
					return [
						...prevStats,
						{
							pattern,
							correct: isCorrect ? 1 : 0,
							attempts: 1,
						},
					]
				}
			})
		},
		[]
	)

	useEffect(() => {
		if (focusedPatterns != null) {
			preloadProblems()
			createNewProblem()
		}
	}, [focusedPatterns])

	useEffect(() => {
		if (problem) {
			setCardState('default')
		}
	}, [problem])

	return (
		<div className="flex gap-5 self-stretch h-4/5 max-h-[600px] relative">
			<AnimatePresence mode="wait">
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

				{!showRecap && (
					// <AnimatePresence mode="wait">
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
					// </AnimatePresence>
				)}
			</AnimatePresence>
		</div>
	)
}
