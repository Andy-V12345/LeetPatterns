'use client'

import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Note } from '@/interfaces/Note'
import { Pattern, UIState } from '@/utils/Types'
import { useEffect, useState } from 'react'
import SyncLoader from 'react-spinners/SyncLoader'
import NotesSheet from './NotesSheet'
import { useAuth, useProtectedRoute } from '@/components/AuthContext'
import NoteCard from './NoteCard'
import { patterns } from '@/utils/Consts'
import { useIsMobile } from '@/hooks/use-mobile'

function getPatternsFromNotes(notes: Note[]): Pattern[] {
	return notes.map((note) => note.pattern)
}

export default function NotesPage() {
	useProtectedRoute()

	const { user, isLoading } = useAuth()

	const [notes, setNotes] = useState<Note[]>([])
	const [uiState, setUiState] = useState<UIState>('loading')
	const [loadingText, setLoadingText] = useState('Getting your notes...')

	const fetchNotes = async () => {
		setUiState('loading')
		if (user && !isLoading) {
			setNotes(await user.getNotes())
			setUiState('default')
		}
	}

	const handleUpdateNotes = (newNote: Note) => {
		setNotes((prevNotes) => {
			// Check if a note with the same pattern already exists
			const noteExists = prevNotes.find(
				(note) => note.pattern === newNote.pattern
			)
			if (noteExists) {
				// Update the existing note
				return prevNotes.map((note) =>
					note.pattern === newNote.pattern ? newNote : note
				)
			} else {
				// Append the new note
				return [...prevNotes, newNote]
			}
		})
	}

	const handleDeleteNoteFromNotes = (noteToDelete: Note) => {
		setNotes((prevNotes) =>
			prevNotes.filter((note) => note.pattern !== noteToDelete.pattern)
		)
	}

	useEffect(() => {
		fetchNotes()
	}, [user, isLoading])

	const isMobile = useIsMobile()

	return (
		<Sheet>
			<div className="flex flex-col gap-7 bg-background h-[100svh] p-[30px] scrollbar-hide overflow-scroll">
				<div className="flex items-center gap-5">
					<SidebarTrigger className="" />

					<h1 className="text-3xl font-bold text-foreground">
						Notes
					</h1>

					{!isMobile &&
						notes.length > 0 &&
						notes.length < patterns.length && (
							<SheetTrigger asChild>
								<button
									className="ml-auto bg-theme-orange hover:bg-theme-hover-orange transition-all px-3 py-2 text-sm font-semibold rounded-md"
									style={{
										boxShadow:
											'0px 0px 12px 1px var(--theme-hover-orange)',
									}}
								>
									Add note
								</button>
							</SheetTrigger>
						)}
				</div>

				{isMobile &&
					notes.length > 0 &&
					notes.length < patterns.length && (
						<SheetTrigger asChild>
							<button
								className="bg-theme-orange hover:bg-theme-hover-orange transition-all px-3 py-2 text-lg font-semibold rounded-md"
								style={{
									boxShadow:
										'0px 0px 12px 1px var(--theme-hover-orange)',
								}}
							>
								Add note
							</button>
						</SheetTrigger>
					)}

				{uiState == 'loading' ? (
					<div className="mx-auto my-auto flex flex-col gap-6 justify-center items-center">
						<SyncLoader
							loading={uiState == 'loading'}
							color="var(--theme-orange)"
							size={11}
						/>

						<p className="text-foreground font-medium text-base">
							{loadingText}
						</p>
					</div>
				) : (
					<>
						{notes.length == 0 ? (
							<div className="flex flex-col justify-center h-full mb-15 items-center gap-5">
								<p className="">No notes created!</p>

								<SheetTrigger asChild>
									<button className="relative group px-5 py-3 bg-gradient-to-r from-theme-orange to-bright-theme-orange rounded-xl overflow-hidden transition-all duration-300 hover:scale-105">
										<div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
										<span className="relative text-lg font-bold text-white">
											Create one
										</span>
									</button>
								</SheetTrigger>
							</div>
						) : (
							<div className="grid grid-cols-8 gap-[10px] w-full">
								{notes.map((note) => (
									<NoteCard
										key={note.pattern}
										note={note}
										handleUpdateNotes={handleUpdateNotes}
										handleDeleteNoteFromNotes={
											handleDeleteNoteFromNotes
										}
									/>
								))}
							</div>
						)}
					</>
				)}
			</div>

			<NotesSheet
				setLoadingText={setLoadingText}
				setUiState={setUiState}
				handleUpdateNotes={handleUpdateNotes}
				alreadyCreated={getPatternsFromNotes(notes)}
			/>
		</Sheet>
	)
}
