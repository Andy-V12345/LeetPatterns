import { Boxes, BotMessageSquare, ChartNoAxesCombined } from 'lucide-react'
import React from 'react'

interface FeatureCardProps {
	title: string
}

const featureData: Record<
	string,
	{
		description: string
		icon: 'boxes' | 'bot' | 'chart'
		gradientClass: string
	}
> = {
	'Recogition, not memorization': {
		description:
			'Tackle fresh, AI-made problems that actually teach you how to spot patterns.',
		icon: 'boxes',
		gradientClass:
			'bg-gradient-to-r from-theme-orange to-bright-theme-orange',
	},
	'Your own AI assistant': {
		description:
			'Stuck? Just ask Leet! Get hints, code breakdowns, and real help whenever you need it.',
		icon: 'bot',
		gradientClass: 'bg-gradient-to-r from-leet-blue to-leet-purple',
	},
	'Progress tracking': {
		description:
			"See exactly how you're improving, what you've mastered, and what to work on next.",
		icon: 'chart',
		gradientClass: 'bg-gradient-to-r from-green-400 to-emerald-600',
	},
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title }) => {
	const data = featureData[title]
	if (!data) return null

	let IconComponent = null
	if (data.icon === 'boxes')
		IconComponent = <Boxes size={38} className="text-white" />
	else if (data.icon === 'bot')
		IconComponent = <BotMessageSquare size={38} className="text-white" />
	else if (data.icon === 'chart')
		IconComponent = <ChartNoAxesCombined size={38} className="text-white" />

	return (
		<div
			className={
				`group p-8 rounded-2xl bg-background/60 backdrop-blur-xl border-2 border-transparent bg-clip-padding transition-all duration-300 shadow-lg hover:scale-105 ` +
				`hover:border-gradient-to-r hover:from-theme-orange hover:to-[#e52e71] ` +
				`hover:shadow-[0_4px_32px_0_rgba(255,165,0,0.15),0_1.5px_8px_0_rgba(229,46,113,0.10)] flex flex-col items-start`
			}
		>
			<div
				className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg ${data.gradientClass}`}
				style={{ boxShadow: '0 4px 16px 0 rgba(229,46,113,0.10)' }}
			>
				{IconComponent}
			</div>
			<h3
				className={`text-2xl font-extrabold mb-3 ${data.gradientClass} bg-clip-text text-transparent w-fit`}
				style={{ textAlign: 'left' }}
			>
				{title}
			</h3>
			<p className="text-gray-400 leading-relaxed text-left text-base lg:text-lg">
				{data.description}
			</p>
		</div>
	)
}
