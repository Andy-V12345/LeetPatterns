export function shuffle<T>(array: T[]): T[] {
	const result = [...array] // optional: copy if you don't want to mutate
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[result[i], result[j]] = [result[j], result[i]]
	}
	return result
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
