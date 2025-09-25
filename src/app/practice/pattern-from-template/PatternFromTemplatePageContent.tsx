import { useAuth } from '@/components/AuthContext'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import { templateVariantTitles } from '@/utils/Consts'
import { UIState } from '@/utils/Types'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'
import { SyncLoader } from 'react-spinners'
import { useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import ProblemArea from '../ProblemArea'
import Link from 'next/link'
import { BotMessageSquare } from 'lucide-react'

export default function PatternFromTemplatePageContent() {
	const { user, isLoading } = useAuth()
	const [uiState, setUiState] = useState<UIState>('default')
	const focusedTemplates = templateVariantTitles

	const isMobile = useIsMobile()

	return (
		<Sheet>
			<div className="relative scrollbar-hide overflow-x-hidden overflow-y-scroll">
				<AnimatePresence mode="wait">
					{uiState == 'loading' ? (
						<motion.div
							className="w-full h-[100svh] flex flex-col items-center justify-center gap-6"
							initial={{ opacity: 1 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.4 }}
						>
							<SyncLoader
								loading={uiState == 'loading'}
								color="var(--theme-orange)"
								size={11}
							/>

							<p className="text-foreground font-medium text-base">
								Getting things ready...
							</p>
						</motion.div>
					) : (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.4 }}
							className="mx-auto scrollbar-hide overflow-x-hidden gap-6 p-6 w-full md:w-11/12 flex h-[100svh] flex-col items-center"
						>
							<div
								className={`flex ${isMobile ? 'flex-col gap-4' : 'flex-row gap-10'} justify-between items-center w-full self-start`}
							>
								<h1
									className={`text-2xl text-left font-bold text-theme-orange ${isMobile ? 'w-full' : ''}`}
								>
									Pattern From Code Practice
								</h1>

								<Link
									href={'/dashboard/templates'}
									className={`bg-card-bg hover:opacity-65 transition-all ${isMobile ? 'self-stretch text-center' : ''} text-sm font-medium px-4 py-3 rounded-md`}
								>
									Back to Templates
								</Link>
							</div>

							{/* Problem Area */}
							<ProblemArea
								focusedPatterns={focusedTemplates}
								isPatternFromTemplate={true}
							/>
						</motion.div>
					)}
				</AnimatePresence>

				{uiState != 'loading' && (
					<SheetTrigger asChild>
						<motion.div
							initial={{ right: -40 }}
							whileHover={{ right: -30 }}
							transition={{
								duration: 0.4,
								type: 'spring',
								bounce: 0.5,
							}}
							className="absolute top-1/2"
							style={{
								transform: 'translate(0, -50%)',
							}}
						>
							<button
								className="flex rounded-full bg-gradient-to-r from-blue-500 to-purple-500 pl-3 md:pl-4 pr-12 py-2 md:py-3"
								style={{
									boxShadow:
										'0px 0px 8px 2px var(--theme-orange)',
								}}
							>
								<BotMessageSquare
									color="white"
									size={isMobile ? 24 : 34}
								/>
							</button>
						</motion.div>
					</SheetTrigger>
				)}
			</div>
		</Sheet>
	)
}
