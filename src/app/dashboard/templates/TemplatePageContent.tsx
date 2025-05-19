import { SidebarTrigger } from '@/components/ui/sidebar'
import { codeTemplates } from '@/utils/Consts'
import { Pattern } from '@/utils/Types'
import TemplateBox from './TemplateBox'

export default function TemplatePageContent() {
	return (
		<div className="flex flex-col gap-7 bg-background p-[30px] h-[100svh] overflow-scroll">
			<div className="flex items-center gap-5">
				<SidebarTrigger />

				<h1 className="text-3xl font-bold text-foreground">
					Templates
				</h1>
			</div>

			<div className="grid grid-cols-8 gap-[10px] w-full">
				{Object.entries(codeTemplates).map(([pattern, data]) => (
					<TemplateBox
						key={pattern}
						pattern={pattern as Pattern}
						codeTemplate={data}
					/>
				))}
			</div>
		</div>
	)
}
