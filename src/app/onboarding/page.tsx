'use client'

import { useAuth, useProtectedRoute } from '@/components/AuthContext'
import { useIsMobile } from '@/hooks/use-mobile'
import { patterns } from '@/utils/Consts'
import { UIState } from '@/utils/Types'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import BeatLoader from 'react-spinners/BeatLoader'

export default function OnboardingPage() {
	const { user } = useAuth()

	const [patternsSelected, setPatternsSelected] = useState(
		Object.fromEntries(patterns.map((pattern) => [pattern, false]))
	)

	const [uiState, setUiState] = useState<UIState>('default')

	useProtectedRoute()

	const handleContinue = async () => {
		setUiState('loading')
		if (user) {
			await user.saveFocusedPatterns(patternsSelected)
			redirect('/practice')
		}
	}

	const isMobile = useIsMobile()

	return (
		<div className="bg-background overflow-hidden h-[100vh] flex flex-col justify-center items-center px-5">
			<div
				className={`h-fit w-full sm:w-4/5 md:w-3/5 xl:w-2/5 overflow-y-scroll flex flex-col gap-20 rounded-xl ${isMobile ? '' : 'p-8 bg-card-bg'}`}
			>
				<div className="flex flex-col gap-5">
					<h1 className="font-bold text-2xl">
						Any patterns to focus on?
					</h1>

					<div className="flex flex-wrap gap-3 gap-y-3">
						{patterns.map((pattern) => (
							<button
								disabled={uiState == 'loading'}
								onClick={() => {
									const tmp = { ...patternsSelected }
									tmp[pattern] = !tmp[pattern]
									setPatternsSelected(tmp)
								}}
								key={pattern}
								className={`${patternsSelected[pattern] ? 'bg-theme-orange hover:bg-theme-hover-orange' : 'bg-transparent hover:opacity-75'} font-medium transition-all text-sm border-theme-orange border-1 py-2 px-4 rounded-full`}
							>
								{pattern}
							</button>
						))}
					</div>
				</div>

				<button
					disabled={uiState == 'loading'}
					onClick={handleContinue}
					className={`self-end font-medium bg-theme-orange ${uiState == 'loading' ? '' : 'hover:bg-theme-hover-orange'} transition-colors px-5 py-3 text-base rounded-4xl`}
				>
					{uiState == 'loading' ? (
						<BeatLoader
							className="mx-auto"
							loading={uiState == 'loading'}
							color="var(--foreground)"
							size={6}
						/>
					) : (
						<p>Continue</p>
					)}
				</button>
			</div>
		</div>
	)
}
