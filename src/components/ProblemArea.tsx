import Problem from "@/interfaces/Problem"
import ProblemCard from "./ProblemCard"
import { useCallback, useEffect, useState } from "react"
import { ProblemCardState } from "@/utils/Types"
import ProblemAnswer from "./ProblemAnswer"
import { generateProblem } from "@/utils/GeminiFunctions"
import { Answer } from "@/interfaces/Answer"
import RecapCard from "./RecapCard"

interface ProblemAreaProps {
    focusedPatterns: string[] | undefined | null
}

export default function ProblemArea({ focusedPatterns }: ProblemAreaProps) {

    const [cardState, setCardState] = useState<ProblemCardState>("default")
    const [showAnswer, setShowAnswer] = useState(false)
    const [problem, setProblem] = useState<Problem | null>()
    const [questionCount, setQuestionCount] = useState(0)
    const [showRecap, setShowRecap] = useState(true)

    const createNewProblem = useCallback(async () => {
        if (focusedPatterns != null && !showRecap) {
            setCardState("loading")

            const res = await generateProblem(focusedPatterns as string[])

            setProblem(res) 
            setShowAnswer(false)
            setCardState("default")
            setQuestionCount(prev => {
                const next = prev + 1
                if (next % 7 == 0) {
                    setShowRecap(true)
                }

                return next
            })
        }
        else if (focusedPatterns == null) {
            console.error("focusedPatterns undefined")
        }
    }, [focusedPatterns, showRecap])

    useEffect(() => {
		if (focusedPatterns != null && !showRecap) {
			createNewProblem()
		}
	}, [focusedPatterns, showRecap])

    return(
        <div className="flex gap-5 self-stretch">
            {showRecap ? 
                <RecapCard />
            :
                <>
                    {(problem != null || cardState == "loading") && 
                        <ProblemCard problem={problem} cardState={cardState} setCardState={setCardState} showAnswer={showAnswer} setShowAnswer={setShowAnswer} />
                    }

                    {(problem != null || cardState == "loading") && 
                        <ProblemAnswer showAnswer={showAnswer} cardState={cardState} answer={problem?.answer ?? null} createNewProblem={createNewProblem} />
                    }
                </>
            }
        </div>
    )
}