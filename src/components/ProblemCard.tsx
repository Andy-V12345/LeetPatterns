import Problem from "@/interfaces/Problem"
import { useState } from "react";

interface ProblemCardProps {
    problem: Problem
}

export default function ProblemCard({ problem }: ProblemCardProps) {
    const [selected, setSelected] = useState<string | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);

    const handleSelect = (option: string) => {
        setSelected(option);
        setShowAnswer(true);
    };

    return(
        <div className="bg-card-bg rounded-md p-6 space-y-4">
            <p className="text-lg font-medium">{problem.prompt}</p>
            <div className="grid grid-cols-2 gap-4">
            {problem.options.map((option) => (
                <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className={`py-2 px-4 rounded border hover:opacity-65 transition-all`}
                >
                {option}
                </button>
            ))}
            </div>
            {showAnswer && (
            <p className="text-sm mt-2">
                {selected === problem.answer
                ? '✅ Correct!'
                : `❌ Oops! The correct pattern is ${problem.answer}.`}
            </p>
            )}
        </div>
    )
}