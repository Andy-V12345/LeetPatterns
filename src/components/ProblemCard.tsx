import Problem from "@/interfaces/Problem"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProblemCardState } from "@/utils/Types";
import ReactMarkdown from 'react-markdown';


interface ProblemCardProps {
    problem: Problem,
    cardState: ProblemCardState,
    setCardState: React.Dispatch<React.SetStateAction<ProblemCardState>>
    showAnswer: boolean,
    setShowAnswer: React.Dispatch<React.SetStateAction<boolean>>
}

const overlayVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { 
        opacity: 0, 
        scale: 0.9, 
        transition: { duration: 1.25 } 
    },
};

const checkmarkLine1Variant = {
    initial: { pathLength: 0 },
    animate: { pathLength: 1, transition: { duration: 0.3, ease: "easeInOut" } },
    exit: { pathLength: 0, transition: { duration: 0.3, delay: 0.3, ease: "easeInOut" }}
}

const checkmarkLine2Variant = {
    initial: { pathLength: 0 },
    animate: { pathLength: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeInOut" } },
    exit: { pathLength: 0, transition: { duration: 0.3, ease: "easeInOut" }}
}

export default function ProblemCard({ problem, cardState, setCardState, showAnswer, setShowAnswer }: ProblemCardProps) {
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (option: string) => {
        setSelected(option);

        if(option === problem.answer.correct) {
            setCardState("correct");
        } else {
            setCardState("wrong");
        }

        setTimeout(() => {
            setShowAnswer(true);
        }, 2000);
    };

    const cardStateToColor: { [k: string]: string } = {
        "default": "",
        "correct": "--correct-green",
        "wrong": "--wrong-red",
    };

    return(
        <div 
            className="relative flex flex-col bg-card-bg rounded-md self-stretch w-[70%] overflow-x-hidden" 
            style={{
                boxShadow: `0px 0px 10px 3px var(${cardStateToColor[cardState]})`
            }}
        >

            <div className="bg-[#363535] p-3 rounded-t-md">
                <p className="text-theme-orange font-bold text-sm">Problem</p>
            </div>

            <div className="relative flex flex-col gap-4 h-full justify-between px-6 pb-6">

                <div className="self-stretch font-sans h-[350px] pr-5 overflow-y-scroll overflow-x-hidden">
                    <div className="prose prose-invert max-h-full max-w-full markdown">
                        <ReactMarkdown>{problem.prompt}</ReactMarkdown>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <p className="text-theme-orange font-medium text-lg">Which approach should you use?</p>

                    <div className="grid grid-cols-2 gap-4">
                        {problem.options.map((option) => (
                            <button
                                key={option}
                                disabled={cardState != "default"}
                                onClick={() => handleSelect(option)}
                                className={`py-2 px-4 rounded border hover:opacity-65 transition-all`}
                                style={{
                                    color: `${selected === option ? `var(${cardStateToColor[cardState]})` : ""}`,
                                    borderColor: `${selected === option ? `var(${cardStateToColor[cardState]})` : ""}`
                                }}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        
            <AnimatePresence>
                {cardState !== "default" && !showAnswer && (
                    <motion.div 
                        key="overlay"
                        variants={overlayVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="absolute inset-0 flex flex-col justify-center items-center opacity-40 rounded-md"
                        style={{ backgroundColor: "rgba(33, 37, 41, 0.8)" }}
                    >
                        <motion.svg width="100" height="100" viewBox="0 0 100 100">
                            {cardState === "wrong" ? 
                                <>
                                    <motion.line 
                                        x1="20" y1="20" x2="80" y2="80" 
                                        stroke="var(--wrong-red)" 
                                        strokeWidth="8"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        exit={{ pathLength: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    />
                                    <motion.line 
                                        x1="80" y1="20" x2="20" y2="80" 
                                        stroke="var(--wrong-red)" 
                                        strokeWidth="8"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        exit={{ pathLength: 0 }}
                                        transition={{ duration: 0.3, delay: 0.3, ease: "easeInOut" }}
                                    />
                                </>
                            :
                                <>
                                    <motion.line 
                                        x1="22" y1="52" x2="49" y2="77" 
                                        stroke="var(--correct-green)" 
                                        strokeWidth="8"
                                        variants={checkmarkLine1Variant}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                    />
                                    <motion.line 
                                        x1="45.5" y1="79" x2="82" y2="32"
                                        stroke="var(--correct-green)" 
                                        strokeWidth="8"
                                        variants={checkmarkLine2Variant}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                    />
                                </>
                            }
                        </motion.svg>

                        <p className={`${cardState === "wrong" ? "text-wrong-red" : "text-correct-green"} text-lg font-semibold`}>{cardState === "correct" ? "Correct Answer" : "Incorrect Answer"}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}