'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload, ImageIcon, AlertCircle, Loader2 } from 'lucide-react'

const ACCEPTED_TYPES = { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] }
const MAX_SIZE_BYTES = 10 * 1024 * 1024

interface Props {
  onUpload: (file: File) => Promise<void>
  isUploading: boolean
  error?: string
}

export default function UploadZone({ onUpload, isUploading, error }: Props) {
  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (accepted[0]) await onUpload(accepted[0])
    },
    [onUpload],
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    maxSize: MAX_SIZE_BYTES,
    disabled: isUploading,
  })

  const rejectionMessage =
    fileRejections[0]?.errors[0]?.message ?? null

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Drop zone */}
      <motion.div
        {...(getRootProps() as object)}
        whileHover={!isUploading ? { scale: 1.01 } : {}}
        whileTap={!isUploading ? { scale: 0.99 } : {}}
        className={[
          'relative cursor-pointer rounded-3xl p-12 transition-all duration-300',
          'border-2 border-dashed',
          'glass-card',
          isDragActive
            ? 'drag-active border-brand-500'
            : 'border-white/20 hover:border-brand-500/60 hover:bg-white/[0.08]',
          isUploading ? 'pointer-events-none opacity-80' : '',
        ].join(' ')}
      >
        <input {...getInputProps()} />

        {/* Pulsing ring when drag is active */}
        {isDragActive && (
          <motion.div
            className="absolute inset-0 rounded-3xl border-2 border-brand-400/40"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.03, opacity: 0 }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}

        <div className="flex flex-col items-center gap-5 text-center">
          {/* Icon */}
          <motion.div
            animate={isUploading ? { rotate: 360 } : { y: [0, -6, 0] }}
            transition={
              isUploading
                ? { duration: 1, repeat: Infinity, ease: 'linear' }
                : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
            }
            className={[
              'w-20 h-20 rounded-2xl flex items-center justify-center',
              isDragActive
                ? 'bg-brand-500/30 shadow-[0_0_30px_rgba(124,58,237,0.5)]'
                : 'bg-white/10',
            ].join(' ')}
          >
            {isUploading ? (
              <Loader2 className="w-9 h-9 text-brand-400" />
            ) : isDragActive ? (
              <ImageIcon className="w-9 h-9 text-brand-300" />
            ) : (
              <Upload className="w-9 h-9 text-white/60" />
            )}
          </motion.div>

          {/* Text */}
          <div>
            {isUploading ? (
              <p className="text-white/80 text-lg font-medium">Uploading your image…</p>
            ) : isDragActive ? (
              <p className="text-brand-300 text-lg font-semibold">Drop it here!</p>
            ) : (
              <>
                <p className="text-white text-lg font-semibold mb-1">
                  Drag & drop your image
                </p>
                <p className="text-white/50 text-sm">
                  or{' '}
                  <span className="text-brand-400 underline underline-offset-2">
                    browse to upload
                  </span>
                </p>
              </>
            )}
          </div>

          {/* Constraints */}
          {!isUploading && (
            <div className="flex flex-wrap justify-center gap-2 mt-1">
              {['JPEG', 'PNG', 'GIF', 'WebP'].map((fmt) => (
                <span
                  key={fmt}
                  className="px-2.5 py-1 rounded-md bg-white/[0.06] border border-white/10 text-white/40 text-xs"
                >
                  {fmt}
                </span>
              ))}
              <span className="px-2.5 py-1 rounded-md bg-white/[0.06] border border-white/10 text-white/40 text-xs">
                max 10 MB
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Error messages */}
      {(error || rejectionMessage) && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error ?? rejectionMessage}
        </motion.div>
      )}
    </div>
  )
}
