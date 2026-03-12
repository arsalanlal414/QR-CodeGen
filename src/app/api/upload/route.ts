import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import type { ImageMetadata, UploadResponse } from '@/types'

// ── Constants ────────────────────────────────────────────────────────────────
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')
const DATA_DIR = join(process.cwd(), 'data', 'uploads')
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
])

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp'])

// ── Helpers ──────────────────────────────────────────────────────────────────
async function ensureDirectories() {
  if (!existsSync(UPLOAD_DIR)) await mkdir(UPLOAD_DIR, { recursive: true })
  if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR, { recursive: true })
}

// ── Route handler ────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image')

    // ── Validation ───────────────────────────────────────────────────────────
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No image file provided.' }, { status: 400 })
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a JPEG, PNG, GIF, or WebP image.' },
        { status: 415 },
      )
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: 'Invalid file extension.' },
        { status: 415 },
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File is too large. Maximum size is 10 MB.' },
        { status: 413 },
      )
    }

    // ── Persist file ─────────────────────────────────────────────────────────
    await ensureDirectories()

    const id = crypto.randomUUID()
    const filename = `${id}.${ext}`

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    await writeFile(join(UPLOAD_DIR, filename), buffer)

    // ── Persist metadata (outside public/) ───────────────────────────────────
    const metadata: ImageMetadata = {
      id,
      originalName: file.name.replace(/[^\w.\-]/g, '_'), // sanitise display name
      filename,
      mimetype: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    }

    await writeFile(
      join(DATA_DIR, `${id}.json`),
      JSON.stringify(metadata, null, 2),
    )

    // ── Build response ────────────────────────────────────────────────────────
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
    const imagePageUrl = `${baseUrl}/image/${id}`

    const response: UploadResponse = {
      id,
      filename,
      imageUrl: `${baseUrl}/uploads/${filename}`,
      imagePageUrl,
      metadata,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (err) {
    console.error('[upload]', err)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
