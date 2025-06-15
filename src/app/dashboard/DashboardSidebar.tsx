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
import {
	House,
	User,
	NotebookPen,
	Code,
	MessageSquareText,
	Video,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { DashboardTypes, UIState } from '@/utils/Types'
import { useAuth } from '@/components/AuthContext'
import BeatLoader from 'react-spinners/BeatLoader'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import ThemeSwitch from '@/components/ThemeSwitch'
import { useIsChrome } from '@/hooks/useIsChrome'

export default function DashboardSidebar() {
	const pathname = usePathname()
	const [selection, setSelection] = useState<DashboardTypes>(() => {
		if (pathname.includes('/dashboard/profile')) return 'profile'
		if (pathname.includes('/dashboard/notes')) return 'notes'
		if (pathname.includes('/dashboard/templates')) return 'templates'
		if (pathname.includes('/dashboard/interview')) return 'interview'
		return 'dashboard'
	})
	const [uiState, setUiState] = useState<UIState>('default')
	const { logout } = useAuth()
	const isChrome = useIsChrome()

	useEffect(() => {
		if (pathname.includes('/dashboard/profile')) {
			setSelection('profile')
		} else if (pathname.includes('/dashboard/notes')) {
			setSelection('notes')
		} else if (pathname.includes('/dashboard/templates')) {
			setSelection('templates')
		} else if (pathname.includes('/dashboard/interview')) {
			setSelection('interview')
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
				<Link href="/" className="flex items-center gap-3">
					<Image
						src={'/leetpatterns_icon.svg'}
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
								isActive={selection == 'templates'}
								className="py-5 px-3"
								onClick={() => setSelection('templates')}
							>
								<Link
									href="/dashboard/templates"
									className="flex items-center gap-3"
								>
									<Code className="text-foreground" />
									<span className="font-semibold text-foreground">
										Templates
									</span>
									<span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-leet-blue to-leet-purple text-white">
										New
									</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton
								asChild
								isActive={selection == 'notes'}
								className="py-5 px-3"
								onClick={() => setSelection('notes')}
							>
								<Link
									href="/dashboard/notes"
									className="flex items-center gap-3"
								>
									<NotebookPen className="text-foreground" />
									<span className="font-semibold text-foreground">
										Notes
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
						<SidebarMenuItem>
							<SidebarMenuButton asChild className="py-5 px-3">
								<Link
									target="_blank"
									className="flex items-center gap-3 text-theme-hover-orange"
									href="https://mail.google.com/mail/?view=cm&fs=1&to=leetpatterns.ai@gmail.com&su=LeetPatterns%20Feedback&body=Hi%20LeetPatterns%20Team,%0D%0A%0D%0AI%20wanted%20to%20share%20some%20feedback:"
								>
									<MessageSquareText />
									<span className="font-semibold">
										Send feedback
									</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarContent>
			<SidebarFooter className="p-3">
				<SidebarMenu>
					{/* {!isChrome && (
						<SidebarMenuItem>
							<div className="flex mb-1 justify-between gap-3 text-foreground items-center">
								<span className="font-semibold text-sm text-foreground">
									Color theme:
								</span>

								<ThemeSwitch className="ml-auto" />
							</div>
						</SidebarMenuItem>
					)} */}
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
