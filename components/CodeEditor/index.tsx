"use client";
import Editor from "react-simple-code-editor";
import Prism, { highlight } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import { useEffect, useState } from "react";
import { useLintResultStore } from "@/store";

const CodeEditor = () => {
    const [code, setCode] = useState("");
    const lintResult = useLintResultStore((state) => state.lintResult)

    useEffect(() => {
        fetch('/api/file?relPath=src/index.ts', {
            method: 'GET'
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch file')
                }
                return res.json()
            })
            .then(data => {
                setCode(data.content)
            })
            .catch(err => {
                console.error('Failed to fetch file', err)
            })
    }, [])

    const handleValueChange = (value: string) => {
        fetch('/api/file', {
            method: 'POST',
            body: JSON.stringify({
                relPath: 'src/index.ts',
                content: value
            })
        })
    }

    return (
        <div>
            {lintResult && <div>{JSON.stringify(lintResult)}</div>}
            <Editor 
                value={code}
                onValueChange={handleValueChange}
                highlight={code => highlight(code, Prism.languages.js, 'js')}
                padding={10}
                style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                }}
            />
        </div>
    )
}

export default CodeEditor;
