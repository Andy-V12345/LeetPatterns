import ReactMarkdown from 'react-markdown'

interface AiTextBubbleInterface {
	text: string
}

export default function AiTextBubble({ text }: AiTextBubbleInterface) {
	return (
		<div
			className={`prose prose-invert rounded-md px-1 text-sm text-foreground markdown`}
		>
			<ReactMarkdown>{text}</ReactMarkdown>
		</div>
	)
}
