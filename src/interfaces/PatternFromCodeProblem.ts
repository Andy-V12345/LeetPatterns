import { TemplateVariantTitle } from '@/utils/Types'

export default interface PatternFromCodeProblem {
	codeSnippet: string
	answerOptions: TemplateVariantTitle[]
	correctAnswer: TemplateVariantTitle
	explanation: string
}
