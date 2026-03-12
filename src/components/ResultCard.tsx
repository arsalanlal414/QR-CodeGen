'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Copy, ExternalLink, RefreshCcw, Check } from 'lucide-react'
import type { UploadResponse } from '@/types'
import QRCodeDisplay from './QRCodeDisplay'

interface Props {
  data: UploadResponse
  onReset: () => void
}

export default function ResultCard({ data, onReset }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(data.imagePageUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [data.imagePageUrl])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Success header */}
      <div className="flex items-center gap-3 mb-6 px-1">
        <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
        <div>
          <p className="text-white font-semibold">Image uploaded successfully!</p>
          <p className="text-white/50 text-sm">
            Your QR code is ready — anyone who scans it will see your image.
          </p>
        </div>
      </div>

      {/* Main card */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {/* ── Left: Image preview ── */}
          <div className="p-6 flex flex-col gap-4">
            <p className="text-white/50 text-xs uppercase tracking-widest font-medium">
              Uploaded Image
            </p>

            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-white/[0.04] border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.imageUrl}
                alt={data.metadata.originalName}
                className="w-full h-full object-contain"
              />
            </div>

            {/* File info */}
            <div className="flex flex-col gap-1.5 text-sm">
              <Row label="File" value={data.metadata.originalName} />
              <Row label="Size" value={formatBytes(data.metadata.size)} />
              <Row label="Type" value={data.metadata.mimetype} />
            </div>
          </div>

          {/* ── Right: QR code ── */}
          <div className="p-6 flex flex-col items-center gap-6">
            <p className="text-white/50 text-xs uppercase tracking-widest font-medium self-start">
              QR Code
            </p>

            <QRCodeDisplay url={data.imagePageUrl} size={220} showDownload />

            {/* URL row */}
            <div className="w-full space-y-2">
              <p className="text-white/40 text-xs">Shareable link</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white/60 text-sm truncate">
                  {data.imagePageUrl}
                </div>
                <button
                  onClick={handleCopy}
                  title="Copy link"
                  className="shrink-0 p-2 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all duration-200 active:scale-[0.95]"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <a
                  href={data.imagePageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open image page"
                  className="shrink-0 p-2 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all duration-200 active:scale-[0.95]"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset */}
      <div className="flex justify-center mt-6">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl glass-card border border-white/10 text-white/70 hover:text-white hover:border-brand-500/40 hover:bg-brand-600/10 text-sm font-medium transition-all duration-200 active:scale-[0.98]"
        >
          <RefreshCcw className="w-4 h-4" />
          Upload Another Image
        </button>
      </div>
    </motion.div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-white/40 shrink-0">{label}</span>
      <span className="text-white/70 truncate">{value}</span>
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}
