import { useTheme } from '@/components/ThemeContext'
import { TemplateVariant } from '@/utils/Types'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import {
	atomOneDark,
	atomOneLight,
} from 'react-syntax-highlighter/dist/esm/styles/hljs'

interface FlashcardProps {
	variant: TemplateVariant
	showTip: boolean
}

export default function Flashcard({ variant, showTip }: FlashcardProps) {
	const { theme } = useTheme()
	const [flipped, setFlipped] = useState(false)

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.code == 'Space') {
				event.preventDefault()
				setFlipped(!flipped)
			}
		}

		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [flipped])

	return (
		<div
			className="relative flex w-full h-full transition-all"
			style={{
				perspective: '1000px',
			}}
		>
			<motion.div
				className="w-full h-full rounded-lg"
				initial={false}
				animate={{
					rotateX: flipped ? 180 : 0,
				}}
				transition={{
					duration: 0.3,
				}}
				style={{
					position: 'relative',
					transformStyle: 'preserve-3d',
					boxShadow: '0 0 5px 1px var(--theme-orange)',
				}}
			>
				<motion.div
					onClick={() => {
						setFlipped(!flipped)
					}}
					className="w-full h-full absolute bg-card-bg shadow rounded-lg flex justify-center items-center"
				>
					<p className="text-2xl md:text-3xl font-bold text-center">
						{variant.title}
					</p>

					{showTip && (
						<p className="absolute text-theme-hover-orange bottom-0 py-2 bg-card-fg w-full font-medium rounded-b-md text-center">
							Click the card to flip
						</p>
					)}
				</motion.div>

				<motion.div
					className="w-full h-full p-5 absolute bg-card-bg rounded-lg shadow gap-4 flex flex-col"
					style={{
						transform: 'rotateX(180deg)',
						backfaceVisibility: 'hidden',
						pointerEvents: flipped ? 'auto' : 'none',
					}}
					onClick={() => {
						setFlipped(!flipped)
					}}
				>
					<h3 className="font-bold text-xl">Template</h3>

					<SyntaxHighlighter
						language="python"
						style={theme == 'dark' ? atomOneDark : atomOneLight}
						showLineNumbers
						customStyle={{
							borderRadius: 8,
							width: '100%',
							padding: '15px 15px',
						}}
					>
						{variant.template}
					</SyntaxHighlighter>
				</motion.div>
			</motion.div>
		</div>
	)
}
