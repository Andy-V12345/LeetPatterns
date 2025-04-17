import { Pattern } from "@/utils/Types";
import { Answer } from "./Answer";

export default interface Problem {
    prompt: string,
    options: Pattern[],
    answer: Answer
}