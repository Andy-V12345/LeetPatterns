import { SidebarTrigger } from '@/components/ui/sidebar'
import { codeTemplates } from '@/utils/Consts'
import { Pattern, TemplateMode } from '@/utils/Types'
import TemplateBox from './TemplateBox'
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import { useIsMobile } from '@/hooks/use-mobile'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'

export default function TemplatePageContent() {
	const isMobile = useIsMobile()

	const [selectedMode, setSelectedMode] = useState<TemplateMode | null>(null)

	const modeUrl: Record<TemplateMode, string> = {
		flashcards: '/practice/flashcards',
		pattern_from_template: '/practice/pattern-from-template',
		template_face_off: '/practice/template-face-off',
	}

	return (
		<Drawer>
			<div className="flex flex-col gap-7 bg-background p-[30px] h-[100svh] overflow-scroll">
				<div className="flex items-center gap-5">
					<SidebarTrigger />

					<h1 className="text-3xl font-bold text-foreground">
						Templates
					</h1>

					{!isMobile && (
						<DrawerTrigger asChild>
							<button
								className="ml-auto text-foreground bg-theme-orange hover:bg-theme-hover-orange transition-all px-3 py-2 text-sm font-semibold rounded-md"
								style={{
									boxShadow:
										'0px 0px 12px 1px var(--theme-hover-orange)',
								}}
							>
								Practice templates
							</button>
						</DrawerTrigger>
					)}
				</div>

				{isMobile && (
					<DrawerTrigger asChild>
						<button
							className="bg-theme-orange hover:bg-theme-hover-orange transition-all px-3 py-2 font-semibold rounded-md"
							style={{
								boxShadow:
									'0px 0px 12px 1px var(--theme-hover-orange)',
							}}
						>
							Practice templates
						</button>
					</DrawerTrigger>
				)}

				<div className="grid grid-cols-8 gap-[10px] w-full">
					{Object.entries(codeTemplates).map(([pattern, data]) => {
						if (data.variants.length > 0) {
							return (
								<TemplateBox
									key={pattern}
									pattern={pattern as Pattern}
									codeTemplate={data}
								/>
							)
						}
					})}
				</div>
			</div>

			<DrawerContent>
				<div
					className="flex flex-col items-center gap-[25px]"
					style={{
						padding: '0 20px 20px 20px',
					}}
				>
					<DrawerHeader
						style={{
							padding: '25px 0 0 0',
						}}
					>
						<DrawerTitle className="mx-auto text-xl font-bold">
							Choose a practice mode
						</DrawerTitle>
					</DrawerHeader>
					<div
						className="w-full gap-4"
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(3, 1fr)', // 3 equal-width columns
						}}
					>
						<motion.div
							whileHover={{ y: isMobile ? -5 : -15 }}
							whileTap={{
								y: 0,
								transition: {
									type: 'spring',
									bounce: 0.5,
								},
							}}
							onClick={() => setSelectedMode('flashcards')}
							style={{
								gridColumn: isMobile ? 'span 3' : 'span 1',
								boxShadow:
									selectedMode == 'flashcards'
										? '0 0 5px 3px var(--theme-orange)'
										: '',
							}}
							className={`bg-card-bg p-4 rounded-md`}
						>
							<span className="flex items-center gap-2">
								<h1 className="text-xl">🗒️</h1>

								<h1 className="text-theme-orange text-xl font-bold">
									Flashcards
								</h1>
							</span>
							<p>Quickly flip through patterns and templates.</p>
						</motion.div>

						<motion.div
							whileHover={{ y: isMobile ? -5 : -15 }}
							whileTap={{
								y: 0,
								transition: {
									type: 'spring',
									bounce: 0.5,
								},
							}}
							onClick={() =>
								setSelectedMode('pattern_from_template')
							}
							style={{
								boxShadow:
									selectedMode == 'pattern_from_template'
										? '0 0 5px 3px var(--theme-orange)'
										: '',
								gridColumn: isMobile ? 'span 3' : 'span 1',
							}}
							className={`bg-card-bg p-4 rounded-md`}
						>
							<span className="flex items-center gap-2">
								<h1 className="text-xl">🤖</h1>

								<h1 className="text-theme-orange text-xl font-bold">
									Pattern From Code
								</h1>
							</span>
							<p>
								Look at an adapted template — can you recognize
								the underlying pattern?
							</p>
						</motion.div>

						<motion.div
							whileHover={{ y: isMobile ? -5 : -15 }}
							whileTap={{
								y: 0,
								transition: {
									type: 'spring',
									bounce: 0.5,
								},
							}}
							onClick={() => setSelectedMode('template_face_off')}
							style={{
								boxShadow:
									selectedMode == 'template_face_off'
										? '0 0 5px 3px var(--theme-orange)'
										: '',
								gridColumn: isMobile ? 'span 3' : 'span 1',
							}}
							className={`bg-card-bg p-4 rounded-md`}
						>
							<span className="flex items-center gap-2">
								<h1 className="text-xl">⚔️</h1>

								<h1 className="text-theme-orange text-xl font-bold">
									Template Face-Off
								</h1>
							</span>
							<p>
								Which of these templates would solve the problem
								best?
							</p>
						</motion.div>
					</div>

					<DrawerFooter className="p-0" style={{ width: '100%' }}>
						<Link
							href={
								selectedMode != null
									? modeUrl[selectedMode as TemplateMode]
									: '/'
							}
							className={`bg-theme-orange text-center py-3 rounded-md font-bold transition-all ${selectedMode == null ? 'opacity-75 pointer-events-none' : 'hover:opacity-75'}`}
							style={{ width: '100%' }}
						>
							Start Practicing
						</Link>

						<DrawerClose asChild>
							<button
								className={`bg-card-fg text-center py-3 rounded-md font-medium transition-all hover:opacity-75`}
								style={{ width: '100%' }}
							>
								Cancel
							</button>
						</DrawerClose>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	)
}
