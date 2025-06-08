import { Answer } from './Answer'

export default interface Problem<T> {
	prompt: string
	options: T[]
	answer: Answer<T>
}
