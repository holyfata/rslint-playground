"use client";
import { useEffect, useState, useMemo } from "react";
import { useLintResultStore } from "@/store";
import { Diagnostic } from "@/types";
import Editor from "@monaco-editor/react";

const CodeEditor = () => {
    const [code, setCode] = useState("");
    const lintResult = useLintResultStore((state) => state.lintResult);

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

    const handleValueChange = (value: string | undefined) => {
        if (!value) return;
        setCode(value);
        fetch('/api/file', {
            method: 'POST',
            body: JSON.stringify({
                relPath: 'src/index.ts',
                content: value
            })
        })
    }

    // Convert lint results to Monaco Editor markers format
    const markers = useMemo(() => {
        if (!lintResult?.diagnostics) return [];
        console.log('lintResult', lintResult)
        
        return lintResult.diagnostics.map((diagnostic: Diagnostic) => ({
            startLineNumber: diagnostic.range.start.line, // Monaco uses 1-based line numbers
            startColumn: diagnostic.range.start.column,   // Monaco uses 1-based column numbers
            endLineNumber: diagnostic.range.end.line,
            endColumn: diagnostic.range.end.column,
            message: diagnostic.message,
            severity: 8, // 8 = Error (red), 4 = Warning (yellow), 1 = Info (blue)
            code: diagnostic.ruleName,
            source: 'rslint'
        }));
    }, [lintResult]);

    // Callback after editor mounts, used to set markers
    const handleEditorDidMount = (editor: any, monaco: any) => {
        // Set markers
        if (markers.length > 0) {
            monaco.editor.setModelMarkers(editor.getModel(), 'rslint', markers);
        }
    };

    // Update editor when markers change
    useEffect(() => {
        // @ts-ignore
        if (window.monaco && markers.length > 0) {
            // Get current editor instance and update markers
            // @ts-ignore
            const editor = window.monaco.editor.getEditors()[0];
            if (editor) {
                // @ts-ignore
                window.monaco.editor.setModelMarkers(editor.getModel(), 'rslint', markers);
            }
        }
    }, [markers]);

    return (
        <div className="w-full h-full">
            <Editor
                height="100%"
                defaultLanguage="typescript"
                value={code}
                onChange={handleValueChange}
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    theme: 'vs-light',
                    wordWrap: 'on',
                    folding: true,
                    showFoldingControls: 'always',
                }}
            />
        </div>
    )
}

export default CodeEditor;
