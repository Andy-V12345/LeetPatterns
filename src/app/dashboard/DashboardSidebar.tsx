'use client'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { House, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import { DashboardTypes, UIState } from '@/utils/Types'
import { useAuth } from '@/components/AuthContext'
import BeatLoader from 'react-spinners/BeatLoader'
import { usePathname } from 'next/navigation'

export default function DashboardSidebar() {
	const pathname = usePathname()
	const [selection, setSelection] = useState<DashboardTypes>(
		pathname.includes('/dashboard/profile') ? 'profile' : 'dashboard'
	)
	const [uiState, setUiState] = useState<UIState>('default')
	const { logout } = useAuth()

	useEffect(() => {
		if (pathname.includes('/dashboard/profile')) {
			setSelection('profile')
		} else {
			setSelection('dashboard')
		}
	}, [pathname])

	const handleLogOut = async () => {
		setUiState('loading')
		await logout()
		setUiState('default')
	}

	return (
		<Sidebar>
			<SidebarHeader>
				<h1
					className="text-theme-orange font-bold text-xl"
					style={{
						textShadow: '0px 2px 2px var(--theme-orange)',
					}}
				>
					LeetPatterns.ai
				</h1>
			</SidebarHeader>
			<SidebarContent className="px-3">
				<SidebarGroupContent>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								asChild
								isActive={selection == 'dashboard'}
								className="py-5 px-3"
								onClick={() => setSelection('dashboard')}
							>
								<Link
									href="/dashboard"
									className="flex items-center gap-3"
								>
									<House />
									<span className="font-semibold">
										Dashboard
									</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton
								asChild
								isActive={selection == 'profile'}
								className="py-5 px-3"
								onClick={() => setSelection('profile')}
							>
								<Link
									href="/dashboard/profile"
									className="flex items-center gap-3"
								>
									<User />
									<span className="font-semibold">
										Profile
									</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarContent>
			<SidebarFooter className="p-3">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							onClick={handleLogOut}
							className={`py-5 px-3 flex justify-center items-center gap-3 bg-card-fg ${uiState == 'loading' ? '' : 'hover:opacity-80'} transition-all`}
						>
							{uiState == 'loading' ? (
								<BeatLoader
									loading={uiState == 'loading'}
									size={5}
									color="var(--color-red-400)"
								/>
							) : (
								<span className="text-red-400 font-bold">
									Sign Out
								</span>
							)}
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	)
}
