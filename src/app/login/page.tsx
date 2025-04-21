import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { GoogleIcon } from '../signup/page'

export default function LoginPage() {
	return (
		<div className="bg-background overflow-hidden h-[100vh] flex flex-col justify-center items-center p-8">
			<div className="h-fit w-[450px] bg-card-bg overflow-y-scroll flex flex-col gap-4 rounded-xl p-8">
				<div className="flex flex-col gap-1">
					<h1 className="font-bold text-2xl">Sign in</h1>
					<p className="text-sm">
						Start practicing for free. No credit card required.
					</p>
				</div>

				<button className="flex justify-center items-center bg-card-fg gap-5 py-3 rounded-lg hover:opacity-50 transition-all">
					<GoogleIcon />
					<p className="text-foreground font-semibold">
						Continue with Google
					</p>
				</button>

				<div className="flex gap-5 justify-center items-center">
					<div className="h-[1px] w-full bg-foreground" />

					<p className="text-lg">OR</p>

					<div className="h-[1px] w-full bg-foreground" />
				</div>

				<Input type="email" placeholder="Email" />

				<Input type="password" placeholder="Password" />

				<Link
					href="/forgotpassword"
					className="self-end text-sm hover:opacity-50 transition-all"
				>
					Forgot password?
				</Link>

				<button className="py-3 hover:bg-theme-hover-orange transition-all rounded-lg bg-theme-orange mt-5 font-semibold">
					Sign in
				</button>

				<div className="flex gap-2 self-center">
					<p>Don't have an account?</p>
					<Link
						href="/signup"
						className="text-theme-orange hover:opacity-50 transition-all"
					>
						Sign up
					</Link>
				</div>
			</div>
		</div>
	)
}
