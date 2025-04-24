'use client'

import {
	useState,
	createContext,
	useContext,
	useEffect,
	ReactNode,
} from 'react'
import {
	signOut,
	onAuthStateChanged,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	GoogleAuthProvider,
	getAdditionalUserInfo,
	signInWithPopup,
} from 'firebase/auth'
import { auth } from '@/utils/FirebaseConfig'
import { LocalUser } from '@/classes/LocalUser'
import { AppUser } from '@/interfaces/AppUser'
import { checkIsGuest, setIsGuest } from '@/utils/UtilFunctions'
import { getUserInfo, saveUserInfo } from '@/utils/FirebaseFunctions'
import { redirect, useRouter } from 'next/navigation'
import { UIState } from '@/utils/Types'
import { error } from 'console'

type AuthContextType = {
	user: AppUser | null
	login: (email: string, password: string) => Promise<boolean>
	signup: (
		firstName: string,
		lastName: string,
		email: string,
		password: string
	) => Promise<void>
	continueAsGuest: () => void
	logout: () => void
	signInWithGoogle: (
		setUiState: React.Dispatch<React.SetStateAction<UIState>>
	) => Promise<void>
	isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<AppUser | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(true)

	const router = useRouter()

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			setIsLoading(true)
			if (firebaseUser) {
				const appUser = await getUserInfo(firebaseUser.uid)
				appUser!.setFirebaseUser(firebaseUser)
				console.log('user', appUser)
				setUser(appUser)
			} else {
				if (checkIsGuest()) {
					const localUser = new LocalUser()
					setUser(localUser)
				} else {
					setUser(null)
				}
			}
			setIsLoading(false)
		})

		return unsubscribe
	}, [])

	const signup = async (
		firstName: string,
		lastName: string,
		email: string,
		password: string
	): Promise<void> => {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			)
			const user = userCredential.user
			await saveUserInfo(user.uid, firstName, lastName)
		} catch (error: any) {
			console.log('error auth:', error.message)
			throw error
		}
	}

	const login = async (email: string, password: string): Promise<boolean> => {
		try {
			const userDetails = await signInWithEmailAndPassword(
				auth,
				email,
				password
			)
			const firebaseUser = await getUserInfo(userDetails.user.uid)
			const focusedPatterns = await firebaseUser!.getFocusedPatterns()

			if (focusedPatterns != null) {
				return true
			}

			return false
		} catch (error: any) {
			console.log('error auth:', error)
			throw error
		}
	}

	const continueAsGuest = () => {
		setIsGuest(true)
		setUser(new LocalUser())
	}

	const logout = async () => {
		await signOut(auth)
		setIsGuest(false)
		setUser(null)
		redirect('/')
	}

	const signInWithGoogle = async (
		setUiState: React.Dispatch<React.SetStateAction<UIState>>
	): Promise<void> => {
		const provider = new GoogleAuthProvider()

		setUiState('loading')

		signInWithPopup(auth, provider)
			.then(async (result) => {
				const user = result.user
				const additionalInfo = getAdditionalUserInfo(result)
				let firstName: string = ''
				let lastName: string = ''

				if (additionalInfo != null) {
					if (additionalInfo.profile != null) {
						if (additionalInfo.profile.given_name != undefined) {
							firstName = additionalInfo.profile
								.given_name as string
						}

						if (additionalInfo.profile.last_name != undefined) {
							lastName = additionalInfo.profile
								.last_name as string
						}
					}
				}

				await saveUserInfo(user.uid, firstName, lastName)
				const appUser = await getUserInfo(user.uid)
				appUser!.setFirebaseUser(user)

				setUser(appUser)

				const focusedPatterns = await appUser!.getFocusedPatterns()

				if (focusedPatterns == null) {
					router.push('/onboarding')
				} else {
					router.push('/dashboard')
				}
			})
			.catch((error) => {
				console.error('error', error)
				setUiState('default')
			})
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				signup,
				login,
				continueAsGuest,
				logout,
				signInWithGoogle,
				isLoading,
			}}
		>
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

export const useProtectedRoute = () => {
	const { user, isLoading } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (isLoading) {
			return
		}

		if (!user) {
			router.push('/')
		}
	}, [user, isLoading])
}
