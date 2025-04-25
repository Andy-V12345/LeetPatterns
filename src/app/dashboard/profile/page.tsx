'use client'

import { useAuth, useProtectedRoute } from '@/components/AuthContext'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ProfileInfo } from '@/interfaces/ProfileInfo'
import { UIState } from '@/utils/Types'
import { UserCircle } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import BeatLoader from 'react-spinners/BeatLoader'
import SyncLoader from 'react-spinners/SyncLoader'

export default function Profile() {
	useProtectedRoute()

	const { user, isLoading, logout } = useAuth()
	const [profile, setProfile] = useState<ProfileInfo | null>(null)
	const [uiState, setUiState] = useState<UIState>('loading')
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (user && !isLoading) {
			setUiState('loading')
			setProfile(user.getProfileInfo())
			setUiState('default')
		}
	}, [user, isLoading])

	const handleLogout = async () => {
		setLoading(true)
		await logout()
		setLoading(false)
	}

	return (
		<div className="flex flex-col gap-7 bg-background h-[100svh] p-[30px] overflow-scroll">
			<div className="flex items-center gap-5">
				<SidebarTrigger className="" />

				<h1 className="text-3xl font-bold text-foreground">Profile</h1>
			</div>

			<div className="flex flex-col w-fit h-full self-center gap-8">
				{uiState == 'loading' && (
					<div className="my-auto flex flex-col gap-6 justify-center items-center">
						<SyncLoader
							loading={uiState == 'loading'}
							color="var(--theme-orange)"
							size={11}
						/>

						<p className="text-foreground font-medium text-base">
							Loading your profile...
						</p>
					</div>
				)}
				{uiState != 'loading' && (
					<>
						{profile == null || profile!.photoUrl == null ? (
							<UserCircle
								size={150}
								color="var(--theme-orange)"
								className="self-center"
							/>
						) : (
							<Image
								className="rounded-full object-cover self-center"
								alt="profile_pic"
								src={profile!.photoUrl!}
								width={150}
								height={150}
							/>
						)}

						<div
							className={`bg-card-bg flex flex-col gap-7 rounded-md p-5`}
						>
							{profile == null ? (
								<div
									className="flex flex-col justify-center items-center gap-2"
									style={{
										padding: 50,
									}}
								>
									<p className="text-3xl font-bold">
										Signed In As Guest
									</p>
									<p className="text-theme-orange">
										No profile available
									</p>
								</div>
							) : (
								<>
									<div>
										<p className="text-xl font-bold">
											Name
										</p>
										<p className="text-lg text-theme-orange">
											{`${profile.firstName} ${profile.lastName}`}
										</p>
									</div>

									<div>
										<p className="text-xl font-bold">
											Email
										</p>
										<p className="text-lg text-theme-orange">
											{profile.email}
										</p>
									</div>
								</>
							)}

							<div
								className="flex items-center justify-between"
								style={{
									gap: 100,
								}}
							>
								<div className="">
									<p className="text-xl font-bold">
										Sign Out
									</p>
									<p className="font-medium text-theme-orange">
										Don't worry your stats will be saved.
									</p>
								</div>

								<button
									onClick={handleLogout}
									className={`w-40 bg-card-fg py-2 text-red-400 text-lg font-semibold rounded-md ${loading ? '' : 'hover:opacity-80'} transition-all`}
								>
									{loading ? (
										<BeatLoader
											loading={loading}
											color="var(--color-red-400)"
											size={6}
										/>
									) : (
										<span className="text-lg">
											Sign Out
										</span>
									)}
								</button>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	)
}
