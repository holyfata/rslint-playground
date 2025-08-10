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

    // 将lint结果转换为Monaco Editor的markers格式
    const markers = useMemo(() => {
        if (!lintResult?.diagnostics) return [];
        console.log('lintResult', lintResult)
        
        return lintResult.diagnostics.map((diagnostic: Diagnostic) => ({
            startLineNumber: diagnostic.range.start.line, // Monaco使用1-based行号
            startColumn: diagnostic.range.start.column,   // Monaco使用1-based列号
            endLineNumber: diagnostic.range.end.line,
            endColumn: diagnostic.range.end.column,
            message: diagnostic.message,
            severity: 8, // 8 = Error (红色), 4 = Warning (黄色), 1 = Info (蓝色)
            code: diagnostic.ruleName,
            source: 'rslint'
        }));
    }, [lintResult]);

    // 编辑器挂载后的回调，用于设置markers
    const handleEditorDidMount = (editor: any, monaco: any) => {
        // 设置markers
        if (markers.length > 0) {
            monaco.editor.setModelMarkers(editor.getModel(), 'rslint', markers);
        }
    };

    // 当markers变化时更新编辑器
    useEffect(() => {
        // @ts-ignore
        if (window.monaco && markers.length > 0) {
            // 获取当前编辑器实例并更新markers
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
