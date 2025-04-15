import { Answer } from "./Answer";

export default interface Problem {
    prompt: string,
    options: string[],
    answer: Answer
}