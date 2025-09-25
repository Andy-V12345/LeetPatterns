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
import Image from 'next/image'

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
			<div className="flex flex-col gap-7 bg-background p-[30px] h-[100svh] scrollbar-hide overflow-scroll">
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
					className="flex flex-col items-center gap-[25px] scrollbar-hide overflow-y-scroll"
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
							className={`flex flex-col items-center bg-card-bg px-5 pb-5 rounded-lg`}
						>
							<div
								className="w-1/2 md:w-4/5 lg:w-1/2"
								style={{
									position: 'relative',
									height: 'auto',
									aspectRatio: '1 / 1',
								}}
							>
								<Image
									src="/flashcard_img.svg"
									alt="flashcard_img"
									fill
								/>
							</div>
							<h1 className="self-start text-left text-theme-hover-orange text-xl font-bold">
								Flashcards
							</h1>
							<p className="self-start text-left">
								Quickly flip through patterns and templates.
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
							onClick={() =>
								setSelectedMode('pattern_from_template')
							}
							style={{
								gridColumn: isMobile ? 'span 3' : 'span 1',
								boxShadow:
									selectedMode == 'pattern_from_template'
										? '0 0 5px 3px var(--theme-orange)'
										: '',
							}}
							className={`flex flex-col relative items-center bg-card-bg px-5 pb-5 rounded-lg`}
						>
							<div
								className="w-1/2 md:w-4/5 lg:w-1/2"
								style={{
									position: 'relative',
									height: 'auto',
									aspectRatio: '1 / 1',
								}}
							>
								<Image
									src="/pattern_from_code_img.svg"
									alt="pattern_from_code"
									fill
								/>
							</div>
							<h1 className="self-start text-left text-theme-hover-orange text-xl font-bold">
								Pattern From Code
							</h1>
							<p className="self-start text-left">
								Look at an adapted template — can you recognize
								the underlying pattern?
							</p>
						</motion.div>

						<motion.div
							whileHover={{ y: isMobile ? -5 : -15 }}
							// whileTap={{
							// 	y: 0,
							// 	transition: {
							// 		type: 'spring',
							// 		bounce: 0.5,
							// 	},
							// }} TODO: COMING SOON
							// onClick={() => setSelectedMode('template_face_off')} TODO: COMING SOON
							style={{
								gridColumn: isMobile ? 'span 3' : 'span 1',
								boxShadow:
									selectedMode == 'template_face_off'
										? '0 0 5px 3px var(--theme-orange)'
										: '',
							}}
							className={`flex relative flex-col items-center bg-card-bg px-5 pb-5 rounded-lg`}
						>
							<div
								className="w-1/2 md:w-4/5 lg:w-1/2"
								style={{
									position: 'relative',
									height: 'auto',
									aspectRatio: '1 / 1',
								}}
							>
								<Image
									src="/face_off_img.svg"
									alt="face_off_img"
									fill
								/>
							</div>
							<h1 className="self-start text-left text-theme-hover-orange text-xl font-bold">
								Template Face-Off
							</h1>
							<p className="self-start text-left">
								Which one of these templates would solve the
								problem best?
							</p>

							<div className="absolute flex justify-center items-center w-full h-full">
								<div className="w-full h-full bg-card-bg opacity-70 rounded-lg" />
								<p
									className="absolute text-sm right-4 top-4 py-1 px-2 bg-theme-hover-orange rounded-md font-semibold text-foreground"
									style={{
										boxShadow:
											'0 0 3px 2px var(--theme-orange)',
									}}
								>
									Coming soon!
								</p>
							</div>
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
