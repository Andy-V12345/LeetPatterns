import { FirebaseUser } from '@/classes/FirebaseUser'
import { useAuth } from '@/components/AuthContext'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { Note } from '@/interfaces/Note'
import { patternColors, patterns } from '@/utils/Consts'
import { Pattern, UIState } from '@/utils/Types'
import { ChangeEvent, useEffect, useState } from 'react'
import BeatLoader from 'react-spinners/BeatLoader'

interface NotesSheetProps {
	setUiState: React.Dispatch<React.SetStateAction<UIState>>
	setLoadingText: React.Dispatch<React.SetStateAction<string>>
	handleUpdateNotes: (note: Note) => void
	alreadyCreated: Pattern[]
}

export default function NotesSheet({
	handleUpdateNotes,
	alreadyCreated,
}: NotesSheetProps) {
	const { user } = useAuth()
	const [selectedPattern, setSelectedPattern] = useState<
		Pattern | undefined
	>()
	const [text, setText] = useState('')
	const [loading, setLoading] = useState(false)
	const [ready, setReady] = useState(false)

	useEffect(() => {
		if (text.length > 0 && selectedPattern) {
			setReady(true)
		} else {
			setReady(false)
		}
	}, [text, selectedPattern])

	const handleCreateNote = async () => {
		if (user) {
			const newNote = {
				pattern: selectedPattern!,
				text: text,
			}

			user.saveNote(newNote)
			handleUpdateNotes(newNote)

			setText('')
			setSelectedPattern(undefined)
		}
	}

	const handleStreamNotes = async (
		pattern: string,
		onChunk: (text: string) => void
	) => {
		setLoading(true)
		const firUser = user as FirebaseUser
		const token = await firUser.getTokenId()
		const response = await fetch('/api/generateNotes', {
			method: 'POST',
			body: JSON.stringify({ pattern }),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})

		const reader = response.body?.getReader()
		const decoder = new TextDecoder()
		let result = ''

		while (reader) {
			const { value, done } = await reader.read()
			if (done) break

			const chunk = decoder.decode(value, { stream: true })
			result += chunk
			onChunk(result) // Update state to display as it's streamed
		}

		setLoading(false)
	}

	return (
		<SheetContent>
			<SheetHeader>
				<SheetTitle>Create a note</SheetTitle>
				<SheetDescription>
					Take your own notes for a specific pattern.
				</SheetDescription>
			</SheetHeader>

			<div className="px-4 h-full flex flex-col gap-5">
				<div className="flex flex-col gap-2">
					<p className="text-sm font-medium">Pattern</p>
					<Select
						value={selectedPattern}
						onValueChange={(selection) => {
							setSelectedPattern(selection as Pattern)
						}}
					>
						<SelectTrigger
							disabled={loading}
							className="w-full font-medium"
							style={{
								color: selectedPattern
									? patternColors[selectedPattern]
									: '',
							}}
						>
							<SelectValue placeholder="Select a pattern" />
						</SelectTrigger>
						<SelectContent>
							{patterns.map(
								(pattern) =>
									!alreadyCreated.includes(pattern) && (
										<SelectItem
											value={pattern}
											key={pattern}
											className="font-medium"
											style={{
												color: patternColors[pattern],
											}}
										>
											{pattern}
										</SelectItem>
									)
							)}
						</SelectContent>
					</Select>
				</div>

				<div className="flex flex-col gap-2 h-full">
					<p className="text-sm font-medium">Note</p>
					<Textarea
						disabled={loading}
						className="h-full resize-none"
						value={text}
						onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
							setText(event.target.value)
						}}
						placeholder="Write your notes here..."
					/>

					{user && user instanceof FirebaseUser && (
						<button
							disabled={!selectedPattern || loading}
							className={`mt-1 bg-card-fg text-theme-orange font-medium py-3 rounded-md ${selectedPattern ? 'hover:opacity-75' : 'opacity-75'} transition-all`}
							onClick={() =>
								handleStreamNotes(selectedPattern!, setText)
							}
						>
							{loading ? (
								<BeatLoader
									loading={loading}
									color="var(--theme-orange)"
									size={6}
								/>
							) : (
								<p>Generate Notes with AI ✨</p>
							)}
						</button>
					)}
				</div>
			</div>

			<SheetFooter>
				<SheetClose disabled={!ready || loading} asChild>
					<button
						onClick={handleCreateNote}
						disabled={!ready || loading}
						className={`py-2 text-base font-semibold bg-theme-orange ${!ready || loading ? 'opacity-75' : 'hover:bg-theme-hover-orange'} transition-all rounded-md`}
					>
						Save Note
					</button>
				</SheetClose>

				<SheetClose asChild>
					<button className="py-2 text-base font-medium bg-card-fg hover:opacity-80 transition-all rounded-md">
						Cancel
					</button>
				</SheetClose>
			</SheetFooter>
		</SheetContent>
	)
}
