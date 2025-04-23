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
import { useState } from 'react'
import { DashboardTypes } from '@/utils/Types'

export default function DashboardSidebar() {
	const [selection, setSelection] = useState<DashboardTypes>('dashboard')

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
			<SidebarFooter />
		</Sidebar>
	)
}
