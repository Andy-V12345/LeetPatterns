import { useEffect, useState } from 'react'

export function useIsChrome(): boolean {
	const [isChrome, setIsChrome] = useState(false)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const isChromeBrowser =
				/Chrome/.test(navigator.userAgent) &&
				!/Edge|Edg|OPR/.test(navigator.userAgent)
			setIsChrome(isChromeBrowser)
		}
	}, [])

	return isChrome
}
