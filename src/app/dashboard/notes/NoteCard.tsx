import { useAuth } from '@/components/AuthContext'
import { Textarea } from '@/components/ui/textarea'
import { Note } from '@/interfaces/Note'
import { patternColors } from '@/utils/Consts'
import { TrashIcon, RotateCcw } from 'lucide-react'
import { ChangeEvent, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'

interface NoteCardProps {
	note: Note
	handleUpdateNotes: (note: Note) => void
	handleDeleteNoteFromNotes: (note: Note) => void
}

export default function NoteCard({
	note,
	handleUpdateNotes,
	handleDeleteNoteFromNotes,
}: NoteCardProps) {
	const { user } = useAuth()

	const [text, setText] = useState(note.text)
	const [ready, setReady] = useState(false)

	// Saved state to trigger the animation
	const [saved, setSaved] = useState(false)

	const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setText(event.target.value)
	}

	const handleResetText = () => {
		setText(note.text)
	}

	const handleSaveChanges = async () => {
		if (user) {
			const updatedNote: Note = {
				pattern: note.pattern,
				text: text,
			}
			user.saveNote(updatedNote)
			handleUpdateNotes(updatedNote)
			setReady(false)
			// Trigger the save animation.
			setSaved(true)
		}
	}

	const handleDeleteNote = async () => {
		if (user) {
			user.deleteNote(note)
			handleDeleteNoteFromNotes(note)
		}
	}

	useEffect(() => {
		if (text == note.text) {
			setReady(false)
		} else {
			setReady(text.length > 0)
		}
	}, [text])

	return (
		<TooltipProvider>
			<motion.div
				className="flex flex-col h-[375px] bg-card-bg p-5 col-span-full lg:col-span-4 rounded-md gap-5"
				animate={saved ? { scale: [1, 0.95, 1] } : {}}
				transition={{ duration: 0.3, times: [0, 0.5, 1] }}
				onAnimationComplete={() => setSaved(false)}
			>
				<div className="flex flex-col gap-3 h-full">
					<h3
						className="text-lg font-bold text-wrap break-words"
						style={{ color: patternColors[note.pattern] }}
					>
						{note.pattern}
					</h3>

					<Textarea
						value={text}
						onChange={handleTextChange}
						className="resize-none text-lg rounded-none focus-visible:ring-0 border-transparent p-0 focus:border-0 h-full scrollbar-hide overflow-y-scroll"
					/>
				</div>

				<div className="flex items-stretch gap-2">
					<button
						disabled={!ready}
						onClick={handleSaveChanges}
						className={`font-medium w-full text-sm bg-card-fg text-theme-orange ${
							ready ? 'hover:opacity-75' : 'opacity-50'
						} transition-all rounded-md py-3`}
					>
						Save Changes
					</button>

					<Tooltip>
						<TooltipTrigger asChild>
							<button
								onClick={handleResetText}
								className="rounded-md px-3 bg-card-fg font-bold hover:opacity-75 transition-all"
							>
								<RotateCcw size={15} />
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p className="font-semibold">
								Restore original text
							</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<button
								onClick={handleDeleteNote}
								className="rounded-md px-3 bg-card-fg font-bold hover:opacity-75 transition-all"
							>
								<TrashIcon
									size={15}
									color="rgba(255, 0, 84, 0.8)"
								/>
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p
								className="font-semibold"
								style={{
									color: 'rgba(255, 0, 84, 0.8)',
								}}
							>
								This cannot be undone
							</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</motion.div>
		</TooltipProvider>
	)
}
