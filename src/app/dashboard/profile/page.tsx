import { SidebarTrigger } from '@/components/ui/sidebar'

export default function Profile() {
	return (
		<div className="flex flex-col gap-7 bg-background h-[100svh] p-[30px] overflow-scroll">
			<div className="flex items-center gap-5">
				<SidebarTrigger className="" />

				<h1 className="text-3xl font-bold text-foreground">Profile</h1>
			</div>
		</div>
	)
}
