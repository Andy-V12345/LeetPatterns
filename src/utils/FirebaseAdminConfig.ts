import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const serviceAccount = JSON.parse(
	Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!, 'base64').toString(
		'utf8'
	)
)

const adminApp = getApps().length
	? getApps()[0]
	: initializeApp({ credential: cert(serviceAccount) })

export const adminAuth = getAuth(adminApp)
