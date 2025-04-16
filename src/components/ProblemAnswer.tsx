import { Answer } from "@/interfaces/Answer";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface ProblemAnswerProps {
    answer: Answer
    createNewProblem: () => Promise<void>
    showAnswer: boolean
}

const LeetcodeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#ffa115"} fill={"none"} {...props}>
        <path d="M13.8514 3L4.62921 12C3.79026 12.8187 3.79026 14.1462 4.62921 14.9649L10.1841 20.386C11.0231 21.2047 12.3833 21.2047 13.2222 20.386L15.9997 17.6754" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.33203 10.3377L10.1836 6.57889C11.0226 5.76016 12.3828 5.76016 13.2217 6.57889L15.9992 9.28943" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 13H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function ProblemAnswer({ answer, createNewProblem, showAnswer }: ProblemAnswerProps) {
    const handleNextQuestion = () => {
        createNewProblem()
    }

    return (
        <div className="flex flex-col w-[30%] self-stretch bg-card-bg rounded-md">
            <div className="bg-[#363535] p-3 rounded-t-md">
                <p className="text-theme-orange font-bold text-sm">Explanation</p>
            </div>

            <div className="flex flex-col justify-between h-full gap-4 px-6 pb-6">
                {!showAnswer ? 
                    <i className="text-sm self-center my-auto text-center">Answer the question before seeing the explanation!</i>
                :
                    <>
                        {/* Explanation text */}
                        <div className="self-stretch font-sans max-h-[400px] pr-5 overflow-y-scroll overflow-x-hidden">
                            <div className="prose prose-invert h-fit max-w-full markdown">
                                <ReactMarkdown>{answer.explanation}</ReactMarkdown>
                            </div>
                        </div>

                        {/* Leetcode Problem Link */}
                        <Link href={answer.leetcodeUrl} target="_blank" className="flex flex-col gap-0 hover:opacity-50 transition-all w-fit">
                            <p className="text-[#B3B3B3] text-sm">{`Practice ${answer.correct}:`}</p>

                            <div className="flex gap-1 items-center">
                                {/* Leetcode Icon */}
                                <LeetcodeIcon />

                                <p className="text-sm font-semibold">{answer.leetcodeTitle}</p>
                            </div>
                        </Link>

                        {/* Next Question Button */}
                        <button onClick={handleNextQuestion} className="bg-theme-orange hover:bg-theme-hover-orange transition-all px-4 py-2 rounded-lg">
                            Next Question
                        </button>
                    </>
                }
            </div>
        </div>
    )
}