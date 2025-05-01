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

interface NotesSheetProps {
	setUiState: React.Dispatch<React.SetStateAction<UIState>>
	setLoadingText: React.Dispatch<React.SetStateAction<string>>
	handleUpdateNotes: (note: Note) => void
	alreadyCreated: Pattern[]
}

export default function NotesSheet({
	setUiState,
	setLoadingText,
	handleUpdateNotes,
	alreadyCreated,
}: NotesSheetProps) {
	const { user } = useAuth()
	const [selectedPattern, setSelectedPattern] = useState<
		Pattern | undefined
	>()
	const [text, setText] = useState('')

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
			// setUiState('loading')
			// setLoadingText('Saving your note...')

			const newNote = {
				pattern: selectedPattern!,
				text: text,
			}

			user.saveNote(newNote)
			handleUpdateNotes(newNote)

			// await new Promise((resolve) => setTimeout(resolve, 1000))

			setText('')
			setSelectedPattern(undefined)

			// setUiState('default')
			// setLoadingText('Getting your notes...')
		}
	}

	return (
		<SheetContent>
			<SheetHeader>
				<SheetTitle>Create a note</SheetTitle>
				<SheetDescription>
					Take your own notes for a specific pattern.
				</SheetDescription>
			</SheetHeader>

			<div className="px-4 flex flex-col gap-5">
				<div className="flex flex-col gap-2">
					<p className="text-sm font-medium">Pattern</p>
					<Select
						value={selectedPattern}
						onValueChange={(selection) => {
							setSelectedPattern(selection as Pattern)
						}}
					>
						<SelectTrigger
							className="w-full"
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

				<div className="flex flex-col gap-2">
					<p className="text-sm font-medium">Note</p>
					<Textarea
						value={text}
						onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
							setText(event.target.value)
						}}
						placeholder="Write your note here..."
					/>
				</div>
			</div>

			<SheetFooter>
				<SheetClose disabled={!ready} asChild>
					<button
						onClick={handleCreateNote}
						disabled={!ready}
						className={`py-2 text-base font-semibold bg-theme-orange ${!ready ? 'opacity-75' : 'hover:bg-theme-hover-orange'} transition-all rounded-md`}
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
