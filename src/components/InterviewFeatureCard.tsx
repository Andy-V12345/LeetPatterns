import React from 'react'
import { Video, UserCircle, Mic, ClipboardCheck } from 'lucide-react'

interface InterviewFeatureCardProps {
	title: string
}

const interviewFeatureData: Record<
	string,
	{
		description: string
		icon: React.ElementType
		iconColor: string
		bgColor: string
	}
> = {
	'AI mock interviews': {
		description:
			"Jump into a mock interview with Leet. It'll throw real questions your way and actually reacts to your answers—no boring scripts.",
		icon: Video,
		iconColor: '#3B82F6',
		bgColor: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
	},
	'Customizable personalities': {
		description:
			"Pick your vibe: want a chill startup founder or a tough Amazon engineer grilling you? You choose your interviewer's style.",
		icon: UserCircle,
		iconColor: '#8B5CF6',
		bgColor: 'linear-gradient(135deg, #8B5CF6 0%, #C4B5FD 100%)',
	},
	'Voice-based practice': {
		description:
			'Talk it out! Explain your thinking out loud and get feedback on your communication—just like the real thing.',
		icon: Mic,
		iconColor: '#EC4899',
		bgColor: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
	},
	'Comprehensive analysis': {
		description:
			'Get the full breakdown: code, test cases, how you explain stuff, and how you handle curveballs. All the feedback, none of the stress.',
		icon: ClipboardCheck,
		iconColor: '#10B981',
		bgColor: 'linear-gradient(135deg, #10B981 0%, #6EE7B7 100%)',
	},
}

export const InterviewFeatureCard: React.FC<InterviewFeatureCardProps> = ({
	title,
}) => {
	const data = interviewFeatureData[title]
	if (!data) return null
	const Icon = data.icon
	return (
		<div className="group p-8 rounded-2xl bg-background/60 backdrop-blur-xl border-2 border-transparent bg-clip-padding transition-all duration-300 shadow-lg hover:scale-105 hover:border-gradient-to-r hover:from-leet-blue to-leet-purple hover:shadow-[0_4px_32px_0_rgba(59,130,246,0.15),0_1.5px_8px_0_rgba(59,130,246,0.10)] flex flex-col items-start">
			<div
				className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg"
				style={{
					background: data.bgColor,
					boxShadow: '0 4px 16px 0 rgba(229,46,113,0.10)',
				}}
			>
				<Icon size={38} style={{ color: 'white' }} />
			</div>
			<h3
				className="text-2xl font-extrabold mb-3 bg-gradient-to-r from-leet-blue to-leet-purple bg-clip-text text-transparent w-fit"
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
