"use client";
import { JsonViewer } from "@douyinfe/semi-ui";
import { useEffect, useState } from "react";

const TsConfig = () => {
    const [value, setValue] = useState('')

    useEffect(() => {
        fetch('/api/file?relPath=tsconfig.json', {
            method: 'GET'
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch file')
                }
                return res.json()
            })
            .then(data => {
                setValue(data.content)
                console.log('tsconfig', data.content)
            })
            .catch(err => {
                console.error('Failed to fetch file', err)
            })
    }, [])

    const handleValueChange = (value: string) => {
        setValue(value)
        fetch('/api/file', {
            method: 'POST',
            body: JSON.stringify({
                relPath: 'tsconfig.json',
            })
        })
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

export default TsConfig;
