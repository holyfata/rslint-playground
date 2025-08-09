import fs from "node:fs"
import path from "node:path"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const relPath = searchParams.get('relPath')
        if (!relPath) {
            return NextResponse.json({ error: 'relPath is required' }, { status: 400 })
        }
        const filePath = path.join(process.cwd(), 'worker', relPath)
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        return NextResponse.json({ content: fileContent })
    } catch (error) {
        console.error('GET /api/file', error)
        return NextResponse.json({ error: 'Failed to get file' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { relPath, content } = body
        if (!relPath || !content) {
            return NextResponse.json({ error: 'relPath and content are required' }, { status: 400 })
        }
        const filePath = path.join(process.cwd(), 'worker', relPath)
        fs.writeFileSync(filePath, content)
        return NextResponse.json({ message: 'File saved successfully' })
    } catch (error) {
        console.error('POST /api/file', error)
        return NextResponse.json({ error: 'Failed to save file' }, { status: 500 })
    }
}
