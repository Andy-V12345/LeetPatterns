import Problem from "@/interfaces/Problem"
import ProblemCard from "./ProblemCard"
import { useCallback, useEffect, useState } from "react"
import { ProblemCardState } from "@/utils/Types"
import ProblemAnswer from "./ProblemAnswer"
import { generateProblem } from "@/utils/GeminiFunctions"

interface ProblemAreaProps {
    focusedPatterns: string[] | undefined | null
}

export default function ProblemArea({ focusedPatterns }: ProblemAreaProps) {

    const [cardState, setCardState] = useState<ProblemCardState>("default")
    const [showAnswer, setShowAnswer] = useState(false)
    const [problem, setProblem] = useState<Problem>()

    const createNewProblem = useCallback(async () => {
        if (focusedPatterns != null) {
            const res = await generateProblem(focusedPatterns as string[])
            setProblem(res) 
            setShowAnswer(false)
            setCardState("default")
            console.log(res.prompt)
        }
        else {
            console.error("focusedPatterns undefined")
        }
    }, [focusedPatterns])

    useEffect(() => {
		if (focusedPatterns != null) {
			createNewProblem()
		}
	}, [focusedPatterns])

    return(
        <div className="flex gap-5 self-stretch">
            {problem != null && 
                <ProblemCard problem={problem} cardState={cardState} setCardState={setCardState} showAnswer={showAnswer} setShowAnswer={setShowAnswer} />
            }

            {problem != null && 
                <ProblemAnswer showAnswer={showAnswer} answer={problem.answer} createNewProblem={createNewProblem} />
            }
        </div>
    )
}