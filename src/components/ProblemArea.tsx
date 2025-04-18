import Problem from "@/interfaces/Problem"
import ProblemCard from "./ProblemCard"
import { useCallback, useEffect, useState } from "react"
import { Pattern, ProblemCardState } from "@/utils/Types"
import ProblemAnswer from "./ProblemAnswer"
import { generateProblem } from "@/utils/GeminiFunctions"
import RecapCard from "./RecapCard"
import { motion, AnimatePresence } from "framer-motion"
import { PatternStat } from "@/interfaces/PatternStat"

interface ProblemAreaProps {
    focusedPatterns: string[] | undefined | null
}

export default function ProblemArea({ focusedPatterns }: ProblemAreaProps) {

    const [cardState, setCardState] = useState<ProblemCardState>("default")
    const [showAnswer, setShowAnswer] = useState(false)
    const [problem, setProblem] = useState<Problem | null>()
    const [questionCount, setQuestionCount] = useState(0)
    const [showRecap, setShowRecap] = useState(false)
    const [patternStats, setPatternStats] = useState<PatternStat[]>([])

    const createNewProblem = useCallback(async () => {
        if (focusedPatterns != null && !showRecap) {
            if (questionCount > 0 && questionCount % 1 == 0) {
                setShowRecap(true)
            }
            else {
                setCardState("loading")

                const res = await generateProblem(focusedPatterns as string[])

                setProblem(res) 
                setShowAnswer(false)
                setQuestionCount(prev => {
                    return prev + 1
                })
                setCardState("default")
            }
        }
        else if (focusedPatterns == null) {
            console.error("focusedPatterns undefined")
        }
        else if (showRecap) {
            setShowRecap(false)
            setCardState("loading")

            const res = await generateProblem(focusedPatterns as string[])

            setProblem(res) 
            setShowAnswer(false)
            setQuestionCount(prev => {
                return prev + 1
            })
            setCardState("default")
        }
    }, [focusedPatterns, showRecap, questionCount])

    const updatePatternStats = useCallback((pattern: Pattern, isCorrect: boolean) => {
        setPatternStats(prevStats => {
            const existingIndex = prevStats.findIndex(stat => stat.pattern === pattern);

            if (existingIndex !== -1) {
                const updated = [...prevStats];
                const stat = updated[existingIndex];
                updated[existingIndex] = {
                    ...stat,
                    correct: stat.correct + (isCorrect ? 1 : 0),
                    attempts: stat.attempts + 1,
                };

                return updated;
            } else {
                return [
                    ...prevStats,
                    {
                        pattern,
                        correct: isCorrect ? 1 : 0,
                        attempts: 1,
                    },
                ];
            }
        });
    }, []);

    useEffect(() => {
		if (focusedPatterns != null) {
			createNewProblem()
		}
	}, [focusedPatterns])

    return (
        <div className="flex gap-5 self-stretch h-4/5 max-h-[600px] relative">
            <AnimatePresence mode="wait">
                {showRecap && (
                    <motion.div
                        key="recap"
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "-100%", opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-full"
                    >
                        <RecapCard patternStats={patternStats} createNewProblem={createNewProblem} />
                    </motion.div>
                )}

                {!showRecap && (
                    <motion.div
                        key="problem"
                        initial={{ x: "100%", opacity: 1 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "-100%", opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex max-h-full self-stretch w-full gap-5"
                    >
                        {(problem != null || cardState === "loading") && (
                            <>
                                <ProblemCard
                                    problem={problem}
                                    cardState={cardState}
                                    setCardState={setCardState}
                                    showAnswer={showAnswer}
                                    setShowAnswer={setShowAnswer}
                                    updatePatternStats={updatePatternStats}
                                />
                                <ProblemAnswer
                                    showAnswer={showAnswer}
                                    cardState={cardState}
                                    answer={problem?.answer ?? null}
                                    createNewProblem={createNewProblem}
                                />
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}