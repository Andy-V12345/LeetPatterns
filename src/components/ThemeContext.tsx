'use client'

import { ColorTheme } from '@/utils/Types'
import { getColorTheme } from '@/utils/UtilFunctions'
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'

type ThemeContextType = {
	theme: ColorTheme
	setTheme: React.Dispatch<React.SetStateAction<ColorTheme>>
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setTheme] = useState<ColorTheme>('dark')

	useEffect(() => {
		setTheme(getColorTheme())
	}, [])

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

export const useTheme = () => {
	const context = useContext(ThemeContext)
	if (context === undefined) {
		throw new Error('useTheme must be used within an ThemeProvider')
	}
	return context
}
