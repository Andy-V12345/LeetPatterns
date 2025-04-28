import { Answer } from '@/interfaces/Answer'
import { ProblemCardState } from '@/utils/Types'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { Skeleton } from '../../components/ui/skeleton'
import { useIsMobile } from '@/hooks/use-mobile'

interface ProblemAnswerProps {
	answer: Answer | null | undefined
	createNewProblem: () => Promise<void>
	showAnswer: boolean
	cardState: ProblemCardState
}

export const LeetcodeIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width={24}
		height={24}
		color={'#ffa115'}
		fill={'none'}
		{...props}
	>
		<path
			d="M13.8514 3L4.62921 12C3.79026 12.8187 3.79026 14.1462 4.62921 14.9649L10.1841 20.386C11.0231 21.2047 12.3833 21.2047 13.2222 20.386L15.9997 17.6754"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M6.33203 10.3377L10.1836 6.57889C11.0226 5.76016 12.3828 5.76016 13.2217 6.57889L15.9992 9.28943"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M11 13H20"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
)

export default function ProblemAnswer({
	answer,
	createNewProblem,
	showAnswer,
	cardState,
}: ProblemAnswerProps) {
	const handleNextQuestion = () => {
		createNewProblem()
	}

	const isMobile = useIsMobile()

	return (
		<div
			className={`relative flex flex-col bg-card-bg rounded-md self-stretch h-full overflow-x-hidden ${isMobile ? 'w-full' : 'w-[40%]'}`}
		>
			<div className="bg-card-fg p-3 rounded-t-md">
				<p className="text-theme-orange font-bold text-sm">
					Explanation
				</p>
			</div>

			<div
				className={`flex flex-col justify-between h-full max-h-full overflow-scroll p-4 md:p-6`}
			>
				{!showAnswer && cardState != 'loading' ? (
					<i className="text-sm self-center my-auto text-center">
						Answer the question before seeing the explanation!
					</i>
				) : (
					<div className="flex flex-col gap-4 md:gap-6 h-full">
						{/* Explanation text takes up available space */}
						<div className="flex-1 overflow-y-auto overflow-x-hidden">
							{answer != null && cardState != 'loading' ? (
								<div className="prose prose-invert pr-5 max-h-full max-w-full markdown">
									<span className="space-x-1">
										<strong className="inline">
											Answer:{' '}
										</strong>
										<p className="inline">
											{answer?.correct ?? ''}
										</p>
									</span>
									<ReactMarkdown>
										{answer.explanation}
									</ReactMarkdown>
								</div>
							) : (
								<div className="max-h-full max-w-full">
									<Skeleton className="w-full bg-[#3C3C3C] text-transparent rounded-sm">
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

						{/* Leetcode Problem Link and Next Question Button (does not grow) */}
						{answer != null && cardState != 'loading' && (
							<div className="flex flex-col gap-4">
								<Link
									href={answer.leetcodeUrl}
									target="_blank"
									className="flex flex-col gap-0 hover:opacity-50 transition-all w-fit"
								>
									<p className="text-foreground-fg text-sm">{`Practice ${answer.correct}:`}</p>
									<div className="flex gap-1 items-center">
										<LeetcodeIcon />
										<p className="text-sm font-semibold">
											{answer.leetcodeTitle}
										</p>
									</div>
								</Link>
								<button
									onClick={handleNextQuestion}
									className="bg-theme-orange hover:bg-theme-hover-orange transition-all px-4 py-2 rounded-lg"
								>
									Next Question
								</button>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}
