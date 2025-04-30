'use client'

import { Input } from '@/components/ui/input'
import { useIsMobile } from '@/hooks/use-mobile'
import { UIState } from '@/utils/Types'
import { useState } from 'react'
import BeatLoader from 'react-spinners/BeatLoader'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from '@/components/ThemeContext'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/utils/FirebaseConfig'
import { redirect } from 'next/navigation'

const drawSpeed = 0.15

const overlayVariants = {
	initial: { opacity: 0, scale: 0.9 },
	animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
	exit: {
		opacity: 0,
		scale: 0.9,
		transition: {
			when: 'afterChildren',
			delay: drawSpeed * 2,
			duration: 0.3,
		},
	},
}

const checkmarkLine1Variant = {
	initial: { pathLength: 0 },
	animate: {
		pathLength: 1,
		transition: { duration: drawSpeed, ease: 'easeInOut' },
	},
	exit: {
		pathLength: 0,
		transition: {
			duration: drawSpeed,
			delay: drawSpeed,
			ease: 'easeInOut',
		},
	},
}

const checkmarkLine2Variant = {
	initial: { pathLength: 0 },
	animate: {
		pathLength: 1,
		transition: {
			duration: drawSpeed,
			delay: drawSpeed,
			ease: 'easeInOut',
		},
	},
	exit: {
		pathLength: 0,
		transition: { duration: drawSpeed, ease: 'easeInOut' },
	},
}

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState('')
	const [uiState, setUiState] = useState<UIState>('default')
	const [error, setError] = useState('')

	const isMobile = useIsMobile()
	const { theme } = useTheme()

	const handleSendLink = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setUiState('loading')

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			setError('Please enter a valid email address.')
			setUiState('error')
			return
		}

		try {
			await sendPasswordResetEmail(auth, email)
			setUiState('success')
			await new Promise((resolve) =>
				setTimeout(resolve, drawSpeed * 5 * 1000)
			)
		} catch (error: any) {
			console.error('error sending reset password link:', error)
			setUiState('error')
			setError(error.message)
			return
		}

		redirect('/login')
	}

	return (
		<div
			className={`bg-background overflow-hidden h-[100svh] ${isMobile ? 'relative p-6' : 'p-8'} flex flex-col justify-center items-center`}
		>
			<div
				className={`h-fit ${isMobile ? 'w-full' : 'relative bg-card-bg w-[450px] p-8 rounded-xl'} overflow-y-scroll flex flex-col gap-5`}
			>
				<div className="flex flex-col gap-1">
					<h1 className="font-bold text-2xl">Forgot password</h1>
					<p className="text-sm">
						Enter your email, and we'll send you a link to reset
						your password
					</p>
				</div>

				{error && uiState == 'error' && (
					<p
						className="text-wrong-red p-3 rounded-lg"
						style={{
							backgroundColor: 'rgba(255, 0, 84, 0.2)',
						}}
					>
						{error}
					</p>
				)}

				<form onSubmit={handleSendLink} className="flex flex-col gap-4">
					<Input
						disabled={uiState == 'loading'}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						type="email"
						placeholder="Email"
					/>

					<button
						disabled={uiState == 'loading'}
						type="submit"
						className={`py-3 ${uiState != 'loading' ? 'hover:bg-theme-hover-orange' : ''} transition-all rounded-lg bg-theme-orange mt-5 font-semibold`}
					>
						{uiState == 'loading' ? (
							<BeatLoader
								loading={uiState == 'loading'}
								color="var(--foreground)"
								size={6}
							/>
						) : (
							<p>Send link</p>
						)}
					</button>
				</form>

				<AnimatePresence>
					{uiState == 'success' && (
						<motion.div
							key="overlay"
							variants={overlayVariants}
							initial="initial"
							animate="animate"
							exit="exit"
							className={`absolute inset-0 flex flex-col justify-center items-center opacity-40 rounded-md ${isMobile ? 'w-full h-[100svh]' : ''}`}
							style={{
								backgroundColor:
									theme == 'light'
										? 'rgba(245, 247, 248, 0.8)'
										: 'var(--overlay-bg)',
							}}
						>
							<motion.svg
								width="100"
								height="100"
								viewBox="0 0 100 100"
							>
								<motion.line
									x1="22"
									y1="52"
									x2="49"
									y2="77"
									stroke="var(--correct-green)"
									strokeWidth="8"
									variants={checkmarkLine1Variant}
									initial="initial"
									animate="animate"
									exit="exit"
								/>
								<motion.line
									x1="45.5"
									y1="79"
									x2="82"
									y2="32"
									stroke="var(--correct-green)"
									strokeWidth="8"
									variants={checkmarkLine2Variant}
									initial="initial"
									animate="animate"
									exit="exit"
								/>
							</motion.svg>

							<p
								className={`text-correct-green text-lg font-semibold`}
							>
								Link Sent
							</p>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	)
}
