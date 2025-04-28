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
import { House, User, Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'
import { DashboardTypes, UIState } from '@/utils/Types'
import { useAuth } from '@/components/AuthContext'
import BeatLoader from 'react-spinners/BeatLoader'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/components/ThemeContext'
import { setColorTheme } from '@/utils/UtilFunctions'

export default function DashboardSidebar() {
	const pathname = usePathname()
	const [selection, setSelection] = useState<DashboardTypes>(
		pathname.includes('/dashboard/profile') ? 'profile' : 'dashboard'
	)
	const [uiState, setUiState] = useState<UIState>('default')
	const { logout } = useAuth()
	const { theme, setTheme } = useTheme()

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

	const handleThemeToggle = () => {
		if (theme == 'dark') {
			setTheme('light')
			setColorTheme('light')
		} else {
			setTheme('dark')
			setColorTheme('dark')
		}
	}

	return (
		<Sidebar>
			<SidebarHeader>
				<Link href="/" className="flex items-center gap-3">
					<Image
						src={'/leetpatterns_icon.png'}
						alt={'logo'}
						width={'15'}
						height={'15'}
					/>

					<span className="font-medium text-lg">
						<h1 className="text-foreground inline">leetpatterns</h1>
						<h1 className="inline text-theme-orange">.</h1>
						<h1 className="inline text-theme-orange">ai</h1>
					</span>
				</Link>
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
									<House className="text-foreground" />
									<span className="font-semibold text-foreground">
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
									<User className="text-foreground" />
									<span className="font-semibold text-foreground">
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
						<div className="flex mb-1 justify-between gap-3 text-foreground items-center">
							<span className="font-semibold text-sm text-foreground">
								Color theme:
							</span>

							<div className="ml-auto flex items-center gap-3">
								{theme == 'dark' ? (
									<Moon className="size-5" />
								) : (
									<Sun className="size-5" />
								)}

								<Switch
									checked={theme == 'dark'}
									onCheckedChange={handleThemeToggle}
								/>
							</div>
						</div>
					</SidebarMenuItem>
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
