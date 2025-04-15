"use client"

import { patterns } from "@/utils/Consts";
import { saveFocusedPatterns } from "@/utils/UserFunctions";
import { useState } from "react";

export default function OnboardingPage() {

    const [patternsSelected, setPatternsSelected] = useState(
        Object.fromEntries(patterns.map(pattern => [pattern, false]))
    )

    const handleContinueClick = () => {
        saveFocusedPatterns(patternsSelected)
    }

    return(
        <div className="bg-background overflow-hidden h-[100vh] flex flex-col justify-center items-center px-5">
            <div className="h-3/5 sm:w-4/5 md:w-3/5 xl:w-2/5 bg-card-bg overflow-y-scroll flex flex-col justify-between gap-5 rounded-xl p-8">
                <h1 className="font-bold text-2xl">Any patterns to focus on?</h1>

                <div className="flex flex-wrap gap-3 gap-y-3">
                    {
                        patterns.map((pattern) => (
                            <button 
                                onClick={() => { 
                                    const tmp = {...patternsSelected}
                                    tmp[pattern] = !tmp[pattern]
                                    setPatternsSelected(tmp)
                                }} 
                                key={pattern} 
                                className={`${patternsSelected[pattern] ? "bg-theme-orange hover:bg-theme-hover-orange" : "bg-transparent hover:opacity-75"} font-medium transition-all  text-sm border-theme-orange border-1 py-2 px-4 rounded-full`}
                            >
                                {pattern}
                            </button>
                        ))
                    }
                </div>

                <button onClick={handleContinueClick} className="self-end mt-auto font-medium bg-theme-orange hover:bg-theme-hover-orange transition-colors px-5 py-3 text-base rounded-4xl">
                    Continue
                </button>
            </div>
        </div>
    )
}