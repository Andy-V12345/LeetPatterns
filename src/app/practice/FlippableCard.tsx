import Problem from '@/interfaces/Problem'
import { ProblemCardState, Pattern } from '@/utils/Types'
import ProblemCard from './ProblemCard'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import ProblemAnswer from './ProblemAnswer'

interface FlippableCardProps {
	problem: Problem | null | undefined
	cardState: ProblemCardState
	setCardState: React.Dispatch<React.SetStateAction<ProblemCardState>>
	showAnswer: boolean
	setShowAnswer: React.Dispatch<React.SetStateAction<boolean>>
	updatePatternStats: (pattern: Pattern, isCorrect: boolean) => void
	createNewProblem: () => Promise<void>
	selected: string | null
	setSelected: React.Dispatch<React.SetStateAction<string | null>>
}

export default function FlippableCard({
	problem,
	cardState,
	setCardState,
	showAnswer,
	setShowAnswer,
	updatePatternStats,
	createNewProblem,
	selected,
	setSelected,
}: FlippableCardProps) {
	const [flipped, setFlipped] = useState(false)

	useEffect(() => {
		if (cardState == 'correct' || cardState == 'wrong') {
			const timeout = setTimeout(() => {
				setFlipped(true)
			}, 1300)

			return () => clearTimeout(timeout)
		}
	}, [cardState])

	return (
		<div
			className="relative flex w-full h-full transition-all"
			onClick={() => {
				if (cardState == 'wrong' || cardState == 'correct') {
					setFlipped(!flipped)
				}
			}}
			style={{
				perspective: '1000px',
			}}
		>
			<motion.div
				className="w-full h-full"
				initial={false}
				animate={{
					rotateX: flipped ? 180 : 0,
				}}
				transition={{
					duration: 0.3,
				}}
				style={{
					position: 'relative',
					transformStyle: 'preserve-3d',
				}}
			>
				<motion.div
					className="w-full h-full absolute bg-card-bg rounded-md flex justify-center items-center"
					style={{}}
				>
					<ProblemCard
						problem={problem}
						cardState={cardState}
						setCardState={setCardState}
						showAnswer={showAnswer}
						setShowAnswer={setShowAnswer}
						updatePatternStats={updatePatternStats}
						selected={selected}
						setSelected={setSelected}
					/>
				</motion.div>

				<motion.div
					className="w-full h-full absolute bg-card-bg rounded-md flex justify-center items-center"
					style={{
						transform: 'rotateX(180deg)',
						backfaceVisibility: 'hidden',
						pointerEvents: flipped ? 'auto' : 'none',
					}}
				>
					<ProblemAnswer
						showAnswer={showAnswer}
						cardState={cardState}
						answer={problem?.answer ?? null}
						createNewProblem={createNewProblem}
					/>
				</motion.div>
			</motion.div>
		</div>
	)
}
