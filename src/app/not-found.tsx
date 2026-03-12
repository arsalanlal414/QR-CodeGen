import Link from 'next/link'
import { SearchX } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center py-24">
        <div className="w-20 h-20 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center mb-6">
          <SearchX className="w-9 h-9 text-white/30" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-white/50 mb-8 max-w-xs">
          This image may have been removed or the link is invalid.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm transition-all duration-200 hover:shadow-lg hover:shadow-brand-600/30"
        >
          Upload a new image
        </Link>
      </main>
    </>
  )
}
