import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { patternColors } from '@/utils/Consts'
import { CodeTemplate, Pattern } from '@/utils/Types'
import SyntaxHighlighter from 'react-syntax-highlighter'
import {
	atomOneDark,
	atomOneLight,
} from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { useTheme } from '@/components/ThemeContext'

interface TemplateBoxProps {
	pattern: Pattern
	codeTemplate: CodeTemplate
}

export default function TemplateBox({
	pattern,
	codeTemplate,
}: TemplateBoxProps) {
	const [open, setOpen] = useState(pattern == 'DFS' ? true : false)
	const { theme } = useTheme()

	return (
		<div className="col-span-full rounded-lg bg-card-bg shadow transition-all p-4">
			<button
				onClick={() => setOpen(!open)}
				className="w-full flex justify-between items-center text-left hover:opacity-75 rounded-t-lg"
			>
				<h1
					className="text-lg font-bold"
					style={{ color: patternColors[pattern] }}
				>
					{pattern}
				</h1>
				<span className="text-xl">{open ? '−' : '+'}</span>
			</button>

			{/* only open the first card in the list */}
			<AnimatePresence initial={pattern == 'DFS' ? true : false}>
				{open && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{
							opacity: 0,
							height: 0,
							transition: {
								ease: 'easeInOut',
								duration: 0.3,
							},
						}}
						transition={{
							type: 'spring',
							duration: 0.6,
						}}
						className="space-y-5"
					>
						<p className="text-sm text-foreground">
							{codeTemplate.explanation}
						</p>

						{codeTemplate.variants.map((variant) => (
							<div key={variant.title} className="space-y-2">
								{codeTemplate.variants.length > 1 && (
									<p className="text-theme-orange font-semibold">
										{variant.title}
									</p>
								)}
								<SyntaxHighlighter
									language="python"
									style={
										theme == 'dark'
											? atomOneDark
											: atomOneLight
									}
									showLineNumbers
									customStyle={{ borderRadius: 8 }}
								>
									{variant.template}
								</SyntaxHighlighter>
							</div>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
