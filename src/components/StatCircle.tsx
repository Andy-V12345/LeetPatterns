import { PatternStat } from '@/interfaces/PatternStat'
import { AnimatedCircularProgressBar } from './magicui/animated-circular-progress-bar'
import { useEffect, useState } from 'react'
import { patternColors } from '@/utils/Consts'

interface StatCircleProps {
	stat: PatternStat
}

export default function StatCircle({ stat }: StatCircleProps) {
	const [value, setValue] = useState(0)

	useEffect(() => {
		setValue((stat.correct / stat.attempts) * 100)
	}, [])

	return (
		<div className="flex gap-3 flex-col items-center">
			<AnimatedCircularProgressBar
				max={100}
				min={0}
				value={value}
				correct={stat.correct}
				attempts={stat.attempts}
				gaugePrimaryColor={patternColors[stat.pattern]}
				gaugeSecondaryColor="#363535"
				strokeWidth={6}
				size={'size-30'}
			/>

			<p className="font-medium">{stat.pattern}</p>
		</div>
	)
}
