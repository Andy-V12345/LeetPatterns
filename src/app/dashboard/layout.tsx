import { SidebarProvider } from '@/components/ui/sidebar'
import DashboardSidebar from './DashboardSidebar'

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<SidebarProvider>
			<div className="flex h-screen w-screen">
				{/* Sidebar with a fixed width */}
				<DashboardSidebar />
				{/* Main content takes the remaining space */}
				<main className="flex-1">{children}</main>
			</div>
		</SidebarProvider>
	)
}
