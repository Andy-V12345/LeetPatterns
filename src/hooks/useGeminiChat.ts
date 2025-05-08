import { Pattern, ChatMode, GeminiMessage } from '@/utils/Types'
import { useState } from 'react'

export function useGeminiChat() {
	const [prevSession, setPrevSession] = useState<GeminiMessage[]>([])
	const [liveResponse, setLiveResponse] = useState<string>('')

	const sendMessage = async ({
		problem,
		correctPattern,
		chatMode,
		message,
		token,
		options,
	}: {
		problem: string
		correctPattern: Pattern
		chatMode: ChatMode
		message: string
		token: string
		options: Pattern[]
	}) => {
		setLiveResponse('')

		const res = await fetch('/api/sendChat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				problem,
				correctPattern,
				chatMode,
				prevSession,
				message,
				options,
			}),
		})

		const reader = res.body?.getReader()
		const decoder = new TextDecoder()

		let fullReply = ''
		setPrevSession((prev) => [
			...prev,
			{ role: 'model', parts: [{ text: fullReply }] },
		])

		if (reader) {
			while (true) {
				const { value, done } = await reader.read()
				if (done) {
					break
				}

				const chunk = decoder.decode(value)
				fullReply += chunk
				setLiveResponse(fullReply)
			}
		}

		setPrevSession((prev) => {
			const old = prev[prev.length - 1] // get latest message
			old.parts[0].text = fullReply
			prev[prev.length - 1] = old

			return [...prev]
		})
	}

	return {
		prevSession,
		setPrevSession,
		sendMessage,
		liveResponse,
	}
}
