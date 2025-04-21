'use server'

import { redirect } from 'next/navigation'
import { Pattern } from './Types'
import {
	getFocusedPatternsFirestore,
	saveFocusedPatternsFirestore,
} from './FirebaseFunctions'

const test_uid = process.env.TEST_USER_ID as string

export async function saveFocusedPatterns(focusedPatterns: {
	[k: string]: boolean
}): Promise<void> {
	await saveFocusedPatternsFirestore(test_uid, focusedPatterns)
	redirect('/practice')
}

export async function getFocusedPatterns(): Promise<Pattern[]> {
	const focusedPatterns = await getFocusedPatternsFirestore(test_uid)

	if (focusedPatterns != null) {
		return Object.keys(focusedPatterns).filter(
			(pattern) => focusedPatterns[pattern]
		) as Pattern[]
	}

	return []
}
