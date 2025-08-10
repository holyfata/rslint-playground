import path from "node:path"
import { NextRequest, NextResponse } from "next/server"
import { lint } from "@/@rslint"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { ruleOptions } = body

        console.log('ruleOptions', ruleOptions, process.cwd())

        const filePath = path.join(process.cwd(), 'worker/src/index.ts')
        const configPath = path.join(process.cwd(), 'worker/rslint.json')

        const result = await lint({
            files: [filePath],
            config: configPath,
            ruleOptions
        })

        return NextResponse.json({ result })
    } catch (error) {
        console.error('POST /api/lint', error)
        return NextResponse.json({ error: 'Failed to lint' }, { status: 500 })
    }
}
