'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { incrementPageView } from '@/actions/analytics'

/**
 * Client component to track page views automatically
 * Drops into layouts to trigger analytics on route change
 */
export default function ViewTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Only track public paths, ignore admin and login
    if (pathname && !pathname.startsWith('/admin') && !pathname.startsWith('/login')) {
      incrementPageView(pathname)
    }
  }, [pathname])

  return null // This component doesn't render anything
}
