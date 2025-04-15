import Problem from "@/interfaces/Problem"
import ProblemCard from "./ProblemCard"
import { useState } from "react"
import { ProblemCardState } from "@/utils/Types"
import ProblemAnswer from "./ProblemAnswer"

interface ProblemAreaProps {
    problem: Problem
}

export default function ProblemArea({ problem }: ProblemAreaProps) {

    const [cardState, setCardState] = useState<ProblemCardState>("default")
    const [showAnswer, setShowAnswer] = useState(false)

    return(
        <div className="flex flex-col gap-8">
            <ProblemCard problem={problem} cardState={cardState} setCardState={setCardState} showAnswer={showAnswer} setShowAnswer={setShowAnswer} />

            {showAnswer && 
                <ProblemAnswer answer={problem.answer} />
            }
        </div>
    )
}