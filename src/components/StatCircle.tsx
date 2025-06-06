import { AnimatedCircularProgressBar } from './magicui/animated-circular-progress-bar'
import { useEffect, useState } from 'react'
import { patternColors } from '@/utils/Consts'
import Stat from '@/interfaces/Stat'
import { Pattern } from '@/utils/Types'

interface StatCircleProps {
	stat: Stat<Pattern>
	size: string
	strokeWidth: number
	textSize: number
}

export default function StatCircle({
	stat,
	size = 'size-30',
	strokeWidth = 6,
	textSize = 16,
}: StatCircleProps) {
	const [value, setValue] = useState(0)

	useEffect(() => {
		if (stat.attempts > 0) {
			setValue((stat.correct / stat.attempts) * 100)
		} else {
			setValue(0)
		}
	}, [])

	return (
		<div className="flex gap-3 flex-col items-center">
			<AnimatedCircularProgressBar
				max={100}
				min={0}
				value={value}
				correct={stat.correct}
				attempts={stat.attempts}
				gaugePrimaryColor={patternColors[stat.name]}
				gaugeSecondaryColor="var(--card-fg)"
				strokeWidth={strokeWidth}
				size={size}
			/>

			<p
				className="font-medium text-center"
				style={{
					fontSize: textSize,
				}}
			>
				{stat.name}
			</p>
		</div>
	)
}
