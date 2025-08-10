"use client";
import { Button } from "@douyinfe/semi-ui"
import { useRuleStore } from "@/store";

const LintButton = () => {
    const { ruleOptions } = useRuleStore()

    const handleLint = () => {
        fetch('/api/lint', {
            method: 'POST',
            body: JSON.stringify({ ruleOptions })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
            })
            .catch(err => {
                console.error('Failed to lint', err)
            })
    }

    return (
        <Button onClick={handleLint}>Do Lint</Button>
    )
}

export default LintButton;
