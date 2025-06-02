import Problem from '@/interfaces/Problem'
import { motion, AnimatePresence } from 'framer-motion'
import { Pattern, ProblemCardState } from '@/utils/Types'
import ReactMarkdown from 'react-markdown'
import { Skeleton } from '../../components/ui/skeleton'
import { useIsMobile } from '@/hooks/use-mobile'
import { useTheme } from '@/components/ThemeContext'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import SyntaxHighlighter from 'react-syntax-highlighter'

const drawSpeed = 0.15

interface ProblemCardProps<T> {
	problem: Problem<T> | null | undefined
	cardState: ProblemCardState
	setCardState: React.Dispatch<React.SetStateAction<ProblemCardState>>
	showAnswer: boolean
	setShowAnswer: React.Dispatch<React.SetStateAction<boolean>>
	updatePatternStats: (pattern: T, isCorrect: boolean) => void
	selected: string | null
	setSelected: React.Dispatch<React.SetStateAction<string | null>>
	isPatternFromTemplate: boolean
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

export default function ProblemCard<T>({
	problem,
	cardState,
	setCardState,
	showAnswer,
	setShowAnswer,
	updatePatternStats,
	selected,
	setSelected,
	isPatternFromTemplate,
}: ProblemCardProps<T>) {
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
	const { theme } = useTheme()

	return (
		<div
			className={`relative flex flex-col bg-card-bg rounded-md self-stretch h-full overflow-x-hidden ${isMobile ? 'w-full' : 'w-[60%]'}`}
			style={{
				boxShadow: `${cardState != 'loading' ? `0px 0px 10px 3px var(${cardStateToColor[cardState]})` : ''}`,
			}}
		>
			<div className="bg-card-fg p-3 rounded-t-md">
				<p className="text-theme-orange font-bold text-sm">Problem</p>
			</div>

			<div
				className={`flex flex-col justify-between h-full max-h-full overflow-scroll px-4 pb-4 md:px-6 md:pb-6 ${isPatternFromTemplate && 'pt-4 md:pt-6'}`}
			>
				<div className="flex flex-col gap-2 md:gap-4 h-full">
					<div className="flex-1 scrollbar-hide overflow-y-auto overflow-x-hidden">
						{problem != null && cardState != 'loading' ? (
							<>
								{isPatternFromTemplate ? (
									<div className="max-h-full max-w-full scrollbar-hide">
										<SyntaxHighlighter
											language="python"
											style={
												theme == 'dark'
													? atomOneDark
													: atomOneLight
											}
											className="scrollbar-hide"
											showLineNumbers
											customStyle={{ borderRadius: 8 }}
										>
											{problem.prompt}
										</SyntaxHighlighter>
									</div>
								) : (
									<div className="prose prose-invert pr-1 max-h-full max-w-full markdown">
										<ReactMarkdown>
											{problem.prompt}
										</ReactMarkdown>
									</div>
								)}
							</>
						) : (
							<div className="max-h-full max-w-full">
								<Skeleton className="w-full mt-6 text-transparent rounded-sm">
									hello
								</Skeleton>
								<Skeleton className="w-full mt-4 text-transparent rounded-sm">
									hello
								</Skeleton>
								<Skeleton className="w-full mt-4 text-transparent rounded-sm">
									hello
								</Skeleton>
								<Skeleton className="w-full mt-4 text-transparent rounded-sm">
									hello
								</Skeleton>
								<Skeleton className="w-full mt-4 text-transparent rounded-sm">
									hello
								</Skeleton>
							</div>
						)}
					</div>

					<div
						className={`flex w-full flex-col ${isMobile ? 'gap-3' : 'gap-4'}`}
					>
						{problem != null && cardState != 'loading' ? (
							<p
								className={`text-theme-hover-orange font-bold text-base md:text-lg`}
							>
								Which approach should you use?
							</p>
						) : (
							<Skeleton className="text-base md:text-lg font-medium text-transparent w-full bg-[#3C3C3C] rounded-sm">
								Which approach should you use?
							</Skeleton>
						)}

						<div
							className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-2 gap-2'}`}
						>
							{problem != null && cardState != 'loading' ? (
								problem.options.map((option) => (
									<button
										key={option as string}
										disabled={cardState != 'default'}
										onClick={() =>
											handleSelect(option as string)
										}
										className={`${isPatternFromTemplate ? 'text-sm lg:text-base' : 'text-sm md:text-base'} py-2 px-4 rounded-md border border-theme-orange/30 bg-card-fg/80 text-foreground font-semibold shadow-sm transition-all duration-200
											${selected === option ? (cardState === 'correct' ? 'bg-correct-green/20 border-correct-green text-correct-green' : 'bg-wrong-red/20 border-wrong-red text-wrong-red') : 'hover:bg-theme-orange/10 hover:border-theme-orange/60 focus:bg-theme-orange/20 focus:border-theme-orange/80'}`}
										style={{
											boxShadow:
												selected === option
													? cardState == 'correct'
														? '0 0 0 2px var(--correct-green)'
														: '0 0 0 2px var(--wrong-red)'
													: '',
										}}
									>
										{option as string}
									</button>
								))
							) : (
								<>
									<Skeleton className="w-full text-transparent py-2 rounded">
										hello
									</Skeleton>
									<Skeleton className="w-full rounded" />
									<Skeleton className="w-full py-2 text-transparent rounded">
										hello
									</Skeleton>
									<Skeleton className="w-full rounded" />
								</>
							)}
						</div>
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
							className={`absolute inset-0 flex flex-col justify-center items-center opacity-40 rounded-md`}
							style={{
								backgroundColor:
									theme == 'light'
										? 'rgba(245, 247, 248, 0.8)'
										: 'var(--overlay-bg)',
							}}
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
