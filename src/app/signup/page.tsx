'use client'

import { useAuth } from '@/components/AuthContext'
import GoogleIcon from '@/components/GoogleSvg'
import ThemeSwitch from '@/components/ThemeSwitch'
import { Input } from '@/components/ui/input'
import { useIsMobile } from '@/hooks/use-mobile'
import { UIState } from '@/utils/Types'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import BeatLoader from 'react-spinners/BeatLoader'

export default function SignupPage() {
	const { continueAsGuest, signup, signInWithGoogle } = useAuth()

	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [uiState, setUiState] = useState<UIState>('default')
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()

	const handleContinueGuest = () => {
		continueAsGuest()
		redirect('/onboarding')
	}

	const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setUiState('loading')
		setError(null)

		// Basic validation
		if (!email || !password) {
			setError('Email and password are required.')
			setUiState('default')
			return
		}

		if (!firstName || !lastName) {
			setError('Your first and last names are required.')
			setUiState('default')
			return
		}

		const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ'-]{2,}$/
		if (!nameRegex.test(firstName)) {
			setError(
				'Your name can only contain letters, hyphens, and apostrophes'
			)
			setUiState('default')
			return
		}

		if (!nameRegex.test(lastName)) {
			setError(
				'Your name can only contain letters, hyphens, and apostrophes'
			)
			setUiState('default')
			return
		}

		// Simple email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			setError('Please enter a valid email address.')
			setUiState('default')
			return
		}

		if (password.length < 6) {
			setError('Password must be at least 6 characters long.')
			setUiState('default')
			return
		}

		try {
			await signup(firstName, lastName, email, password)
			router.push('/onboarding')
			setUiState('default')
		} catch (err: any) {
			if (err.code == 'auth/email-already-in-use') {
				setError('This email is already taken!')
			} else {
				setError('Something went wrong. Please try again!')
			}

			setUiState('default')
		}
	}

	const isMobile = useIsMobile()

	return (
		<div
			className={`relative bg-background overflow-hidden h-[100svh] ${isMobile ? 'p-6' : 'p-8'} flex flex-col justify-center items-center`}
		>
			<div
				className={`scrollbar-hide h-fit ${isMobile ? 'w-full' : 'bg-card-bg w-[450px] p-8 rounded-xl'} overflow-y-scroll flex flex-col gap-5`}
			>
				<div className="flex flex-col gap-1">
					<h1 className="font-bold text-2xl">Sign up</h1>
					<p className="text-sm">
						Start practicing for free. No credit card required.
					</p>
				</div>

				<button
					onClick={() => signInWithGoogle(setUiState)}
					disabled={uiState == 'loading'}
					className={`flex justify-center items-center bg-card-fg gap-3 py-3 rounded-lg ${uiState == 'loading' ? 'opacity-50' : 'hover:opacity-50'} transition-all`}
				>
					<GoogleIcon className="mb-2" />
					<p className="text-foreground font-semibold">
						Continue with Google
					</p>
				</button>

				<div className="flex gap-5 justify-center items-center">
					<div className="h-[1px] w-full bg-foreground" />

					<p className="text-lg">OR</p>

					<div className="h-[1px] w-full bg-foreground" />
				</div>

				{error && (
					<p
						className="text-wrong-red p-3 rounded-lg"
						style={{
							backgroundColor: 'rgba(255, 0, 84, 0.2)',
						}}
					>
						{error}
					</p>
				)}

				<form onSubmit={handleSignup} className="flex flex-col gap-4">
					<div className="flex gap-4">
						<Input
							disabled={uiState == 'loading'}
							required
							minLength={2}
							type="text"
							placeholder="First Name"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
						/>
						<Input
							disabled={uiState == 'loading'}
							required
							minLength={2}
							type="text"
							placeholder="Last Name"
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
						/>
					</div>

					<Input
						disabled={uiState == 'loading'}
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>

					<Input
						disabled={uiState == 'loading'}
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						minLength={6}
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
							<p>Create account</p>
						)}
					</button>
				</form>

				<div className="flex gap-2 self-center">
					<p>Already have an account?</p>
					<Link
						href="/login"
						className={`text-theme-orange hover:opacity-50 transition-all ${uiState == 'loading' ? 'pointer-events-none opacity-50' : ''}`}
					>
						Log in
					</Link>
				</div>

				<div className="flex gap-5 justify-center items-center">
					<div className="h-[1px] w-full bg-foreground" />

					<p className="text-lg">OR</p>

					<div className="h-[1px] w-full bg-foreground" />
				</div>

				<button
					disabled={uiState == 'loading'}
					onClick={handleContinueGuest}
					className={`text-theme-orange hover:opacity-50 transition-all ${uiState == 'loading' ? 'opacity-50' : ''}`}
				>
					<i>Continue as guest</i>
				</button>
			</div>

			{/* <ThemeSwitch className="absolute bottom-5 right-5" /> */}
		</div>
	)
}
