"use server"

import { GoogleGenAI, Type } from "@google/genai";
import { gemini_system_intructions, leetcode_practice_problems, patterns } from "./Consts";
import Problem from "@/interfaces/Problem";
import { shuffle } from "./UtilFunctions";
import { LeetcodeSample } from "@/interfaces/LeetcodeSample";
import { Pattern } from "./Types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

function generateRandomNum(max: number): number {
    return Math.floor(Math.random() * max)
}

export async function generateProblem(focusedPatterns: string[]): Promise<Problem> {
    const randomNum = generateRandomNum(2)
    const useFocused = (randomNum < 1)
    let pattern: string;

    if (useFocused && focusedPatterns.length > 0) {
        pattern = focusedPatterns[generateRandomNum(focusedPatterns.length)];
    }
    else {
        pattern = patterns[generateRandomNum(patterns.length)]
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Generate a medium-difficulty LeetCode-style problem that uses the ${pattern} pattern.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    problem: {
                        type: Type.STRING,
                        description: "A medium-difficulty LeetCode-style problem prompt (3–5 sentences)."
                    },
                    correctPattern: {
                        type: Type.STRING,
                        description: "One of the known pattern names."
                    },
                    explanation: {
                        type: Type.STRING,
                        description: "Explanation on why this pattern applies and how it is used in a solution."
                    },
                    distractorPatterns: {
                        type: Type.ARRAY,
                        description: "An array of 3 plausible but incorrect pattern names.",
                        items: {
                            type: Type.STRING
                        },
                        minItems: "3",
                        maxItems: "3"
                    }
                },
                required: [
                    "problem",
                    "correctPattern",
                    "explanation",
                    "distractorPatterns"
                ],
            },
            systemInstruction: gemini_system_intructions,
        },
    });

    const resText = response.text
    const resObj = JSON.parse(resText as string)

    let options: string[] = [...resObj.distractorPatterns, resObj.correctPattern]
    options = shuffle(options)

    const leetcode_sample = getLeetcodeSample(resObj.correctPattern)

    const problem: Problem = {
        prompt: resObj.problem,
        options: options as Pattern[],
        answer: {
            correct: resObj.correctPattern,
            explanation: resObj.explanation,
            leetcodeUrl: leetcode_sample.url,
            leetcodeTitle: leetcode_sample.title
        }
    }

    return problem
}

function getLeetcodeSample(pattern: string): LeetcodeSample {
    const leetcode_samples = leetcode_practice_problems[pattern];
    return leetcode_samples[generateRandomNum(leetcode_samples.length)]
}