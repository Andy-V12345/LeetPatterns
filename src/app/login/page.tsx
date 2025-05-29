'use client'

import { Input } from '@/components/ui/input'
import Link from 'next/link'
import GoogleIcon from '@/components/GoogleSvg'
import { useAuth } from '@/components/AuthContext'
import { redirect, useRouter } from 'next/navigation'
import { useState } from 'react'
import { UIState } from '@/utils/Types'
import BeatLoader from 'react-spinners/BeatLoader'
import { useIsMobile } from '@/hooks/use-mobile'
import ThemeSwitch from '@/components/ThemeSwitch'

export default function LoginPage() {
	const { continueAsGuest, login, signInWithGoogle } = useAuth()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [uiState, setUiState] = useState<UIState>('default')
	const router = useRouter()

	const handleContinueGuest = () => {
		continueAsGuest()
		redirect('/onboarding')
	}

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setUiState('loading')
		setError(null)

		// Basic validation
		if (!email || !password) {
			setError('Email and password are required.')
			setUiState('default')
			return
		}

		try {
			const alreadyOnboarded = await login(email, password)

			if (!alreadyOnboarded) {
				router.push('/onboarding')
			} else {
				router.push('/dashboard')
			}
		} catch (err: any) {
			if (
				err.code == 'auth/wrong-password' ||
				err.code == 'auth/invalid-credential'
			) {
				setError('Incorrect email or password!')
			} else {
				console.log(err)
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
					<h1 className="font-bold text-2xl">Log in</h1>
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

				<form onSubmit={handleLogin} className="flex flex-col gap-4">
					<Input
						disabled={uiState == 'loading'}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						type="email"
						placeholder="Email"
					/>

					<Input
						disabled={uiState == 'loading'}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						type="password"
						placeholder="Password"
					/>

					<Link
						href="/forgotpassword"
						className={`text-sm hover:opacity-50 transition-all ${uiState == 'loading' ? 'pointer-events-none opacity-50' : ''}`}
					>
						Forgot password?
					</Link>

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
							<p>Log in</p>
						)}
					</button>
				</form>

				<div className="flex gap-2 self-center">
					<p>Don't have an account?</p>
					<Link
						href="/signup"
						className={`text-theme-orange hover:opacity-50 transition-all ${uiState == 'loading' ? 'pointer-events-none opacity-50' : ''}`}
					>
						Sign up
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

			<ThemeSwitch className="absolute bottom-5 right-5" />
		</div>
	)
}
