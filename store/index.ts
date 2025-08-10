import { LintResponse } from "@/types"
import { create } from "zustand"

const defaultRuleOptions = {
    "@typescript-eslint/no-unused-vars": "error"
}

export const useRuleStore = create<{
    ruleOptions: Record<string, string>
    setRuleOptions: (ruleOptions: Record<string, string>) => void
}>((set) => {
    return {
        ruleOptions: defaultRuleOptions,
        setRuleOptions: (ruleOptions) => {
            set({ ruleOptions })
        }
    }
})

export const useLintResultStore = create<{
    lintResult: LintResponse | null
    setLintResult: (lintResult: LintResponse) => void
}>((set) => {
    return {
        lintResult: null,
        setLintResult: (lintResult) => {
            set({ lintResult })
        }
    }
})
