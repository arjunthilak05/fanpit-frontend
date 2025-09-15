'use client'

import { Suspense } from 'react'
import AddSpaceForm from './AddSpaceForm'

export const dynamic = 'force-dynamic'

export default function AddSpacePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    }>
      <AddSpaceForm />
    </Suspense>
  )
}
