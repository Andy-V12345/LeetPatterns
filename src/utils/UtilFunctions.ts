import { PatternStat } from '@/interfaces/PatternStat'
import { ColorTheme, Pattern, TemplateVariant } from './Types'
import { codeTemplates } from './Consts'

export function shuffle<T>(array: T[]): T[] {
	const result = [...array] // optional: copy if you don't want to mutate
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[result[i], result[j]] = [result[j], result[i]]
	}
	return result
}

export function areConsecutiveDays(date1: Date, date2: Date): number {
	// Normalize to midnight (ignore time-of-day differences)
	const normalize = (d: Date) =>
		new Date(d.getFullYear(), d.getMonth(), d.getDate())
	const d1 = normalize(date1)
	const d2 = normalize(date2)

	// Calculate the absolute difference in milliseconds
	const msPerDay = 1000 * 60 * 60 * 24
	const diffInMs = Math.abs(d2.getTime() - d1.getTime())

	if (diffInMs === 0) {
		return 0
	} else if (diffInMs === msPerDay) {
		return 1
	} else {
		return -1
	}
}

export function getWeakPatterns(patternStats: PatternStat[]): Pattern[] {
	const weakPatterns: Pattern[] = patternStats
		.filter(
			(stat) => stat.attempts > 1 && stat.correct / stat.attempts < 0.5
		)
		.map((stat) => stat.pattern)

	return weakPatterns
}

export function checkIsGuest(): boolean {
	if (typeof window !== 'undefined') {
		const storedIsGuest = localStorage.getItem('isGuest')

		if (storedIsGuest) {
			const isGuest = storedIsGuest === 'true'
			return isGuest
		}
	}

	return false
}

export function setIsGuest(isGuest: boolean) {
	if (typeof window !== 'undefined') {
		localStorage.setItem('isGuest', JSON.stringify(isGuest))
	}
}

export function calculateTotalCorrect(patternStats: PatternStat[]): number {
	return patternStats.reduce((total, stat) => total + stat.correct, 0)
}

export function calculateTotalAttempts(patternStats: PatternStat[]): number {
	return patternStats.reduce((total, stat) => total + stat.attempts, 0)
}

export function setColorTheme(theme: ColorTheme) {
	if (typeof window !== 'undefined') {
		localStorage.setItem('theme', JSON.stringify(theme))
	}
}

export function getColorTheme(): ColorTheme {
	if (typeof window !== 'undefined') {
		const data = localStorage.getItem('theme')

		if (data) {
			return JSON.parse(data)
		}
	}

	return 'dark'
}

export function getTemplateVariants(): TemplateVariant[] {
	const variants: TemplateVariant[] = []

	for (const [_, data] of Object.entries(codeTemplates)) {
		for (const variant of data.variants) {
			variants.push({
				template: variant.template,
				title: variant.title,
			})
		}
	}

	return variants
}
