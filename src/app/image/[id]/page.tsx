import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getMetadata } from '@/lib/storage'

// ── Metadata export ──────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const meta = await getMetadata(id)
  if (!meta) return { title: 'Image Not Found' }

  // Remove extension from filename for display
  const displayName = meta.originalName.replace(/\.[^/.]+$/, "")

  return {
    title: `${displayName} - 中文考试服务网`,  // ← CHANGED
    description: 'View this shared image on QRShare.',
    openGraph: {
      title: displayName,  // ← CHANGED
      description: 'Shared via QRShare',
      images: [{ url: meta.imageUrl, alt: displayName }],  // ← CHANGED
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: displayName,  // ← CHANGED
      description: 'Shared via QRShare',
      images: [meta.imageUrl],
    },
  }
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function ImagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const meta = await getMetadata(id)
  if (!meta) notFound()

  const imageUrl = meta.imageUrl
  // Remove extension from filename for display
  const displayName = meta.originalName.replace(/\.[^/.]+$/, "")
  
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={displayName}  // ← CHANGED (was meta.originalName)
      style={{
        display: 'block',
        width: '100%',
        height: '100vh',
        objectFit: 'contain',
        background: '#000',
      }}
    />
  )
}
