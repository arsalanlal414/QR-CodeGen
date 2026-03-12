'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import QRCode from 'qrcode'
import { Download, Loader2 } from 'lucide-react'

interface Props {
  url: string
  size?: number
  showDownload?: boolean
}

const QR_OPTIONS = {
  margin: 2,
  color: { dark: '#07031a', light: '#ffffff' },
  errorCorrectionLevel: 'H' as const,
}

export default function QRCodeDisplay({ url, size = 240, showDownload = true }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return
    setReady(false)
    QRCode.toCanvas(canvasRef.current, url, { ...QR_OPTIONS, width: size }).then(() =>
      setReady(true),
    )
  }, [url, size])

  const handleDownload = useCallback(async () => {
    const dataUrl = await QRCode.toDataURL(url, { ...QR_OPTIONS, width: 600 })
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = dataUrl
    link.click()
  }, [url])

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Canvas wrapper with glow */}
      <div className="relative">
        {!ready && (
          <div
            className="absolute inset-0 rounded-2xl bg-white/10 flex items-center justify-center"
            style={{ width: size, height: size }}
          >
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="rounded-2xl transition-opacity duration-300 glow-purple"
          style={{ opacity: ready ? 1 : 0, display: 'block' }}
        />
      </div>

      {showDownload && (
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white text-sm font-medium transition-all duration-200 active:scale-[0.97]"
        >
          <Download className="w-4 h-4" />
          Download QR Code
        </button>
      )}
    </div>
  )
}
