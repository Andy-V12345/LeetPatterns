'use client'

import {
	useState,
	createContext,
	useContext,
	useEffect,
	ReactNode,
} from 'react'
import { signInAnonymously, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/utils/FirebaseConfig'
import { FirebaseUser } from '@/classes/FirebaseUser'
import { LocalUser } from '@/classes/LocalUser'
import { AppUser } from '@/interfaces/AppUser'

type AuthContextType = {
	user: AppUser | null
	login: () => Promise<void>
	continueAsGuest: () => Promise<void>
	logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<AppUser | null>(null)

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
			if (firebaseUser) {
				// Wrap Firebase user in your FirebaseUser class
				setUser(new FirebaseUser(firebaseUser.uid))
			} else {
				setUser(null)
			}
		})
		return unsubscribe
	}, [])

	// Implement your login mechanism (e.g., with GoogleAuthProvider)
	const login = async () => {
		// Your Firebase sign-in logic here
	}

	// Continue as guest using Firebase anonymous auth or your own guest user logic
	const continueAsGuest = async () => {
		// Option 1: Use Firebase anonymous auth
		await signInAnonymously(auth)
		// Option 2: Create a local guest user instance
		// setUser(new LocalUser())
	}

	const logout = async () => {
		await signOut(auth)
		setUser(null)
	}

	return (
		<AuthContext.Provider value={{ user, login, continueAsGuest, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
