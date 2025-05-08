import { FirebaseUser } from '@/classes/FirebaseUser'
import AiTextBubble from '@/components/AITextBubble'
import { useAuth } from '@/components/AuthContext'
import { Input } from '@/components/ui/input'
import {
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import Problem from '@/interfaces/Problem'
import {
	ChatMode,
	GeminiMessage,
	Pattern,
	ProblemCardState,
	UIState,
} from '@/utils/Types'
import { ArrowUp } from 'lucide-react'
import { ChangeEvent, useMemo, useState } from 'react'
import SyncLoader from 'react-spinners/SyncLoader'
import PuffLoader from 'react-spinners/PuffLoader'

interface ChatSheetProps {
	messages: GeminiMessage[]
	setMessages: React.Dispatch<React.SetStateAction<GeminiMessage[]>>
	sendMessage: ({
		problem,
		correctPattern,
		chatMode,
		message,
		token,
		options,
	}: {
		problem: string
		correctPattern: Pattern
		chatMode: ChatMode
		message: string
		token: string
		options: Pattern[]
	}) => Promise<void>
	liveResponse: string
	cardState: ProblemCardState
	problem: Problem | null | undefined
}

export default function ChatSheet({
	messages,
	setMessages,
	sendMessage,
	liveResponse,
	cardState,
	problem,
}: ChatSheetProps) {
	const [msgText, setMsgText] = useState('')
	const [uiState, setUiState] = useState<UIState>('default')
	const { user } = useAuth()

	const suggestions = [
		'What is this problem really asking?',
		'What should I look for in this problem?',
	]

	const mode: ChatMode = useMemo(() => {
		if (cardState == 'correct' || cardState == 'wrong') {
			return 'explanation'
		} else {
			return 'guidance'
		}
	}, [cardState])

	const isEmptyText: boolean = useMemo(() => {
		return msgText.trim().length == 0
	}, [msgText])

	const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
		setMsgText(event.target.value)
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (user && user instanceof FirebaseUser) {
			if (!problem) {
				console.error('Problem is null or undefined')
				return
			}
			setUiState('loading')
			setMessages((prev) => [
				...prev,
				{
					role: 'user',
					parts: [
						{
							text: msgText,
						},
					],
				},
			])

			const firUser = user as FirebaseUser
			const token = await firUser.getTokenId()

			setMsgText('')

			await sendMessage({
				problem: problem.prompt,
				correctPattern: problem.answer.correct,
				chatMode: mode,
				message: msgText,
				token: token,
				options: problem.options,
			})

			setUiState('default')
		} else {
			console.error('User is guest')
		}
	}

	return (
		<SheetContent>
			<SheetHeader>
				<SheetTitle className="text-theme-orange text-xl font-bold">
					Chat w/ Leet
				</SheetTitle>
				<SheetDescription className="text-foreground">
					{mode == 'guidance'
						? "Ask any questions you have about the problem. Don't worry, Leet won't reveal the answer yet."
						: 'Ask any questions you have about the problem. Leet can help you understand the correct answer.'}
				</SheetDescription>
			</SheetHeader>
			{cardState == 'loading' ? (
				<div className="flex-1 flex flex-col justify-center items-center">
					<SyncLoader
						loading={cardState == 'loading'}
						color="var(--theme-orange)"
						size={11}
					/>
				</div>
			) : (
				<>
					{messages.length > 0 && (
						<div className="flex-1 scrollbar-hide flex flex-col overflow-y-auto gap-3 p-2">
							{messages.map((msg, idx) => (
								<div key={idx}>
									{msg.role == 'user' ? (
										<div
											className={`rounded-md p-2 ml-auto bg-theme-orange text-sm font-medium text-foreground w-fit max-w-4/5`}
										>
											{msg.parts[0].text}
										</div>
									) : (
										<AiTextBubble
											text={
												idx == messages.length - 1
													? liveResponse
													: msg.parts[0].text
											}
										/>
									)}
								</div>
							))}
						</div>
					)}

					<SheetFooter>
						{messages.length == 0 && (
							<div className="space-y-2 mb-2">
								{suggestions.map((suggestion) => (
									<button
										onClick={() => setMsgText(suggestion)}
										className="text-sm bg-card-fg p-3 rounded-md w-full hover:opacity-75 transition-all"
										key={suggestion}
									>
										{suggestion}
									</button>
								))}
							</div>
						)}
						<form onSubmit={handleSubmit}>
							<div className="flex items-center gap-3">
								<Input
									disabled={uiState == 'loading'}
									value={msgText}
									onChange={handleTextChange}
									placeholder="Ask Leet something..."
								/>
								<button
									disabled={
										uiState == 'loading' || isEmptyText
									}
									type="submit"
									className={`flex ${isEmptyText ? 'opacity-75' : 'hover:opacity-75'} transition-all justify-center items-center rounded-full bg-theme-orange p-[5px]`}
								>
									{uiState == 'loading' ? (
										<PuffLoader
											loading={uiState == 'loading'}
											size={20}
											color={'var(--foreground)'}
										/>
									) : (
										<ArrowUp
											size={20}
											color="var(--foreground)"
										/>
									)}
								</button>
							</div>
						</form>

						<SheetClose asChild>
							<button className="py-2 mt-2 text-base font-medium bg-card-fg hover:opacity-80 transition-all rounded-md">
								Cancel
							</button>
						</SheetClose>
					</SheetFooter>
				</>
			)}
		</SheetContent>
	)
}
