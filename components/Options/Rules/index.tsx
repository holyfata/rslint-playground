"use client";
import { JsonViewer } from "@douyinfe/semi-ui";
import { useEffect, useState } from "react";
import { useRuleStore } from "@/store";

const Rules = () => {
    const [value, setValue] = useState('')
    const { ruleOptions, setRuleOptions } = useRuleStore()

    useEffect(() => {
        setValue(JSON.stringify(ruleOptions, null, 2))
    }, [])

    const handleValueChange = (value: string) => {
        try {
            const newRuleOptions = JSON.parse(value)
            setRuleOptions(newRuleOptions)
        } catch (error) {
            console.error('Failed to parse rule options', error)
        }
    }

    return (
        <div className="w-full h-full">
            <JsonViewer 
                width="100%"
                height="100%"
                value={value} 
                onChange={handleValueChange}
            />
        </div>
    )
}

export default Rules;
