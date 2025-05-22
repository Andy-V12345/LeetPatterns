import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import {
	Check,
	ChevronLeft,
	ChevronRight,
	Shuffle,
	Undo,
	X,
} from 'lucide-react'
import CardCounter from './CardCounter'
import { Switch } from '@/components/ui/switch'
import { TemplateVariant } from '@/utils/Types'
import { useIsMobile } from '@/hooks/use-mobile'

interface ControlBarProps {
	isQuizMode: boolean
	handleSwitchChange: () => void
	handleAnswer: (isCorrect: boolean) => void
	variantIdx: number
	templateVariants: TemplateVariant[]
	handlePrevQuestion: (removeFromList: boolean) => void
	handleNextQuestion: (addToList: boolean) => void
	isUndoing: boolean
	handleUndo: () => void
	handleShuffle: () => void
}

export default function ControlBar({
	isQuizMode,
	handleSwitchChange,
	handleAnswer,
	variantIdx,
	templateVariants,
	isUndoing,
	handleNextQuestion,
	handlePrevQuestion,
	handleShuffle,
	handleUndo,
}: ControlBarProps) {
	const isMobile = useIsMobile()

	return (
		<div
			className={`flex ${isMobile && 'flex-col gap-5'} relative items-center justify-center w-full`}
		>
			{isMobile ? (
				<>
					<div className="flex mx-auto items-center gap-8">
						{isQuizMode ? (
							/* quiz mode button */
							<>
								<Tooltip>
									<TooltipTrigger asChild>
										<button
											onClick={() => handleAnswer(false)}
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

								<CardCounter
									current={variantIdx + 1}
									total={templateVariants.length}
								/>

								<Tooltip>
									<TooltipTrigger asChild>
										<button
											onClick={() => handleAnswer(true)}
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
									onClick={() => handlePrevQuestion(true)}
									className={`${variantIdx === 0 ? 'opacity-50 pointer-events-none' : ''} hover:opacity-75 transition-all border border-theme-hover-orange px-4 py-1 rounded-full`}
								>
									<ChevronLeft
										color="var(--theme-hover-orange)"
										size={30}
									/>
								</button>

								<CardCounter
									current={variantIdx + 1}
									total={templateVariants.length}
								/>

								<button
									onClick={() => handleNextQuestion(true)}
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

					<div className="flex justify-between w-full items-center">
						<div className="flex items-center gap-3 font-semibold text-theme-orange">
							<p>Quiz mode</p>
							<Switch
								checked={isQuizMode}
								onCheckedChange={handleSwitchChange}
								isTheme={false}
							/>
						</div>
						<Tooltip>
							<TooltipTrigger asChild>
								<button
									disabled={
										isQuizMode &&
										(variantIdx == 0 || isUndoing)
									}
									onClick={
										isQuizMode ? handleUndo : handleShuffle
									}
									className={`${isQuizMode && variantIdx == 0 ? 'opacity-50' : 'hover:opacity-75'}`}
								>
									{isQuizMode ? <Undo /> : <Shuffle />}
								</button>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>{isQuizMode ? 'Undo' : 'Shuffle cards'}</p>
							</TooltipContent>
						</Tooltip>
					</div>
				</>
			) : (
				<>
					<div className="left-0 flex absolute items-center gap-3 font-semibold text-theme-orange">
						<p>Quiz mode</p>
						<Switch
							checked={isQuizMode}
							onCheckedChange={handleSwitchChange}
							isTheme={false}
						/>
					</div>

					<div className="flex mx-auto items-center gap-8">
						{isQuizMode ? (
							/* quiz mode button */
							<>
								<Tooltip>
									<TooltipTrigger asChild>
										<button
											onClick={() => handleAnswer(false)}
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

								<CardCounter
									current={variantIdx + 1}
									total={templateVariants.length}
								/>

								<Tooltip>
									<TooltipTrigger asChild>
										<button
											onClick={() => handleAnswer(true)}
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
									onClick={() => handlePrevQuestion(true)}
									className={`${variantIdx === 0 ? 'opacity-50 pointer-events-none' : ''} hover:opacity-75 transition-all border border-theme-hover-orange px-4 py-1 rounded-full`}
								>
									<ChevronLeft
										color="var(--theme-hover-orange)"
										size={30}
									/>
								</button>

								<CardCounter
									current={variantIdx + 1}
									total={templateVariants.length}
								/>

								<button
									onClick={() => handleNextQuestion(true)}
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
									isQuizMode && (variantIdx == 0 || isUndoing)
								}
								onClick={
									isQuizMode ? handleUndo : handleShuffle
								}
								className={`absolute right-0 ${isQuizMode && variantIdx == 0 ? 'opacity-50' : 'hover:opacity-75'}`}
							>
								{isQuizMode ? <Undo /> : <Shuffle />}
							</button>
						</TooltipTrigger>
						<TooltipContent side="bottom">
							<p>{isQuizMode ? 'Undo' : 'Shuffle cards'}</p>
						</TooltipContent>
					</Tooltip>
				</>
			)}
		</div>
	)
}
