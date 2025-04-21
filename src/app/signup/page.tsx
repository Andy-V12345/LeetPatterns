'use client'

import { useAuth } from '@/components/AuthContext'
import { Input } from '@/components/ui/input'
import { UIState } from '@/utils/Types'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import BeatLoader from 'react-spinners/BeatLoader'

export const GoogleIcon = (_: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		x="0px"
		y="0px"
		width="25"
		height="25"
		viewBox="0 0 48 48"
	>
		<path
			fill="#fbc02d"
			d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
		></path>
		<path
			fill="#e53935"
			d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
		></path>
		<path
			fill="#4caf50"
			d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
		></path>
		<path
			fill="#1565c0"
			d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
		></path>
	</svg>
)

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

	return (
		<div className="bg-background overflow-hidden h-[100vh] flex flex-col justify-center items-center p-8">
			<div className="h-fit w-[450px] bg-card-bg overflow-y-scroll flex flex-col gap-5 rounded-xl p-8">
				<div className="flex flex-col gap-1">
					<h1 className="font-bold text-2xl">Sign up</h1>
					<p className="text-sm">
						Start practicing for free. No credit card required.
					</p>
				</div>

				<button
					onClick={() => signInWithGoogle(setUiState)}
					disabled={uiState == 'loading'}
					className={`flex justify-center items-center bg-card-fg gap-5 py-3 rounded-lg ${uiState == 'loading' ? 'opacity-50' : 'hover:opacity-50'} transition-all`}
				>
					<GoogleIcon />
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
		</div>
	)
}
