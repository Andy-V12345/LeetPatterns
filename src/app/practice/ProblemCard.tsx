import Problem from '@/interfaces/Problem'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pattern, ProblemCardState } from '@/utils/Types'
import ReactMarkdown from 'react-markdown'
import { Skeleton } from '../../components/ui/skeleton'
import { useIsMobile } from '@/hooks/use-mobile'

const drawSpeed = 0.15

interface ProblemCardProps {
	problem: Problem | null | undefined
	cardState: ProblemCardState
	setCardState: React.Dispatch<React.SetStateAction<ProblemCardState>>
	showAnswer: boolean
	setShowAnswer: React.Dispatch<React.SetStateAction<boolean>>
	updatePatternStats: (pattern: Pattern, isCorrect: boolean) => void
}

const overlayVariants = {
	initial: { opacity: 0, scale: 0.9 },
	animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
	exit: {
		opacity: 0,
		scale: 0.9,
		transition: {
			when: 'afterChildren',
			delay: drawSpeed * 2,
			duration: 0.3,
		},
	},
}

const xMarkLine1Variant = {
	initial: { pathLength: 0 },
	animate: {
		pathLength: 1,
		transition: { duration: drawSpeed, ease: 'easeInOut' },
	},
	exit: {
		pathLength: 0,
		transition: {
			duration: drawSpeed,
			delay: drawSpeed,
			ease: 'easeInOut',
		},
	},
}

const xMarkLine2Variant = {
	initial: { pathLength: 0 },
	animate: {
		pathLength: 1,
		transition: {
			duration: drawSpeed,
			delay: drawSpeed,
			ease: 'easeInOut',
		},
	},
	exit: {
		pathLength: 0,
		transition: { duration: drawSpeed, ease: 'easeInOut' },
	},
}

const checkmarkLine1Variant = {
	initial: { pathLength: 0 },
	animate: {
		pathLength: 1,
		transition: { duration: drawSpeed, ease: 'easeInOut' },
	},
	exit: {
		pathLength: 0,
		transition: {
			duration: drawSpeed,
			delay: drawSpeed,
			ease: 'easeInOut',
		},
	},
}

const checkmarkLine2Variant = {
	initial: { pathLength: 0 },
	animate: {
		pathLength: 1,
		transition: {
			duration: drawSpeed,
			delay: drawSpeed,
			ease: 'easeInOut',
		},
	},
	exit: {
		pathLength: 0,
		transition: { duration: drawSpeed, ease: 'easeInOut' },
	},
}

export default function ProblemCard({
	problem,
	cardState,
	setCardState,
	showAnswer,
	setShowAnswer,
	updatePatternStats,
}: ProblemCardProps) {
	const [selected, setSelected] = useState<string | null>(null)

	const handleSelect = (option: string) => {
		if (problem == null) {
			return
		}

		setSelected(option)

		if (option === problem.answer.correct) {
			setCardState('correct')
			updatePatternStats(problem.answer.correct, true)
		} else {
			setCardState('wrong')
			updatePatternStats(problem.answer.correct, false)
		}

		setTimeout(() => {
			setShowAnswer(true)
		}, 1000)
	}

	const cardStateToColor: { [k: string]: string } = {
		default: '',
		correct: '--correct-green',
		wrong: '--wrong-red',
		loading: '',
	}

	const isMobile = useIsMobile()

	return (
		<div
			className={`relative z-20 flex flex-col bg-card-bg rounded-md ${isMobile ? 'z-20 w-full' : 'w-[60%] self-stretch overflow-x-hidden'} `}
			style={{
				boxShadow: `${cardState != 'loading' ? `0px 0px 10px 3px var(${cardStateToColor[cardState]})` : ''}`,
			}}
		>
			<div className="bg-[#363535] p-3 rounded-t-md">
				<p className="text-theme-orange font-bold text-sm">Problem</p>
			</div>

			<div className="flex flex-col h-full max-h-full overflow-scroll gap-6 px-6 pb-6">
				<div className="w-full flex-1 overflow-y-scroll overflow-x-hidden">
					{problem != null && cardState != 'loading' ? (
						<div className="prose prose-invert pr-5 max-h-full max-w-full markdown">
							<ReactMarkdown>{problem.prompt}</ReactMarkdown>
						</div>
					) : (
						<div className="max-h-full max-w-full">
							<Skeleton className="w-full mt-6 bg-[#3C3C3C] text-transparent rounded-sm">
								hello
							</Skeleton>
							<Skeleton className="w-full mt-4 bg-[#3C3C3C] text-transparent rounded-sm">
								hello
							</Skeleton>
							<Skeleton className="w-full mt-4 bg-[#3C3C3C] text-transparent rounded-sm">
								hello
							</Skeleton>
							<Skeleton className="w-full mt-4 bg-[#3C3C3C] text-transparent rounded-sm">
								hello
							</Skeleton>
							<Skeleton className="w-full mt-4 bg-[#3C3C3C] text-transparent rounded-sm">
								hello
							</Skeleton>
						</div>
					)}
				</div>

				<div className="flex flex-col gap-4">
					{problem != null && cardState != 'loading' ? (
						<p className="text-theme-orange font-medium text-lg">
							Which approach should you use?
						</p>
					) : (
						<Skeleton className="text-lg font-medium text-transparent w-full bg-[#3C3C3C] rounded-sm">
							Which approach should you use?
						</Skeleton>
					)}

					<div className="grid grid-cols-2 gap-4">
						{problem != null && cardState != 'loading' ? (
							problem.options.map((option) => (
								<button
									key={option}
									disabled={cardState != 'default'}
									onClick={() => handleSelect(option)}
									className={`py-2 px-4 rounded border hover:opacity-65 transition-all`}
									style={{
										color: `${selected === option ? `var(${cardStateToColor[cardState]})` : ''}`,
										borderColor: `${selected === option ? `var(${cardStateToColor[cardState]})` : ''}`,
									}}
								>
									{option}
								</button>
							))
						) : (
							<>
								<Skeleton className="w-full text-transparent py-2 bg-[#3C3C3C] rounded">
									hello
								</Skeleton>
								<Skeleton className="w-full bg-[#3C3C3C] rounded" />
								<Skeleton className="w-full py-2 text-transparent bg-[#3C3C3C] rounded">
									hello
								</Skeleton>
								<Skeleton className="w-full bg-[#3C3C3C] rounded" />
							</>
						)}
					</div>
				</div>
			</div>

			<AnimatePresence>
				{cardState !== 'default' &&
					cardState !== 'loading' &&
					!showAnswer && (
						<motion.div
							key="overlay"
							variants={overlayVariants}
							initial="initial"
							animate="animate"
							exit="exit"
							className="absolute inset-0 flex flex-col justify-center items-center opacity-40 rounded-md"
							style={{ backgroundColor: 'rgba(33, 37, 41, 0.8)' }}
						>
							<motion.svg
								width="100"
								height="100"
								viewBox="0 0 100 100"
							>
								{cardState === 'wrong' && !showAnswer ? (
									<>
										<motion.line
											x1="20"
											y1="20"
											x2="80"
											y2="80"
											variants={xMarkLine1Variant}
											stroke="var(--wrong-red)"
											strokeWidth="8"
											initial="initial"
											animate="animate"
											exit="exit"
										/>
										<motion.line
											x1="80"
											y1="20"
											x2="20"
											y2="80"
											variants={xMarkLine2Variant}
											stroke="var(--wrong-red)"
											strokeWidth="8"
											initial="initial"
											animate="animate"
											exit="exit"
										/>
									</>
								) : (
									<>
										<motion.line
											x1="22"
											y1="52"
											x2="49"
											y2="77"
											stroke="var(--correct-green)"
											strokeWidth="8"
											variants={checkmarkLine1Variant}
											initial="initial"
											animate="animate"
											exit="exit"
										/>
										<motion.line
											x1="45.5"
											y1="79"
											x2="82"
											y2="32"
											stroke="var(--correct-green)"
											strokeWidth="8"
											variants={checkmarkLine2Variant}
											initial="initial"
											animate="animate"
											exit="exit"
										/>
									</>
								)}
							</motion.svg>

							<p
								className={`${cardState === 'wrong' ? 'text-wrong-red' : 'text-correct-green'} text-lg font-semibold`}
							>
								{cardState === 'correct'
									? 'Correct Answer'
									: 'Incorrect Answer'}
							</p>
						</motion.div>
					)}
			</AnimatePresence>
		</div>
	)
}
