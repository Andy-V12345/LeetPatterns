import { Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeContext'
import { Switch } from './ui/switch'
import { setColorTheme } from '@/utils/UtilFunctions'
import { useIsChrome } from '@/hooks/useIsChrome'

interface ThemeSwitchProps {
	className: string
}

export default function ThemeSwitch({ className = '' }: ThemeSwitchProps) {
	const { theme, setTheme } = useTheme()
	const isChrome = useIsChrome()

	const handleThemeToggle = () => {
		if (theme == 'dark') {
			setTheme('light')
			setColorTheme('light')
		} else {
			setTheme('dark')
			setColorTheme('dark')
		}
	}

	if (isChrome) {
		// if chrome don't display switch
		return <></>
	}

	return (
		<div className={`flex items-center gap-3 ${className}`}>
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
	)
}
