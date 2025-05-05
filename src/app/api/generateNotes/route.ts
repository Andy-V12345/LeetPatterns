import { adminAuth } from '@/utils/FirebaseAdminConfig'
import { generateNotesStream } from '@/utils/GeminiFunctions'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
	const authHeader = req.headers.get('Authorization')
	const token = authHeader?.split('Bearer ')[1]

	if (!token) {
		return new Response('Unauthorized (no token)', { status: 401 })
	}

	const origin = req.headers.get('origin') || req.headers.get('referer')
	if (
		!origin?.includes('leetpatternsai.com') &&
		!origin?.includes('localhost:3000')
	) {
		return new Response('Unauthorized origin', { status: 403 })
	}

	try {
		await adminAuth.verifyIdToken(token)
		const { pattern } = await req.json()
		const stream = await generateNotesStream(pattern)

		return new Response(stream, {
			headers: {
				'Content-Type': 'text/plain',
				'Cache-Control': 'no-cache',
			},
		})
	} catch (err) {
		return new Response(`Server error: ${err}`, { status: 500 })
	}
}
