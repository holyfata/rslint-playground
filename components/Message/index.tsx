"use client";
import { useLintResultStore } from "@/store";
import { Card } from "@douyinfe/semi-ui";

const Message = () => {
    const lintResult = useLintResultStore((state) => state.lintResult);

    if (!lintResult) return <div className="text-center text-gray-500">No lint messages</div>;

    const messages = lintResult.diagnostics.map((diagnostic) => ({
        startLineNumber: diagnostic.range.start.line,
        startColumn: diagnostic.range.start.column,
        endLineNumber: diagnostic.range.end.line,
        endColumn: diagnostic.range.end.column,
        message: diagnostic.message,
        severity: 8,
        ruleName: diagnostic.ruleName,
    }))

    return (
        <div>
            {messages.map((item) => {
                const { startLineNumber, endLineNumber, message, ruleName } = item;
                return (
                    <Card key={`${item.startLineNumber}-${item.startColumn}-${item.endLineNumber}-${item.endColumn}-${item.message}`}>
                        {startLineNumber}:{endLineNumber}&nbsp;-&nbsp;{message} <span className="font-bold">({ruleName})</span>
                    </Card>
                )
            })}
            {(!messages || messages.length === 0) && <div className="text-center text-gray-500">No lint messages</div>}
        </div>
    )
}

export default Message;
