interface CardCounterProps {
	current: number
	total: number
}

export default function CardCounter({ current, total }: CardCounterProps) {
	return (
		<span className="text-lg font-medium">{`${current} / ${total}`}</span>
	)
}
