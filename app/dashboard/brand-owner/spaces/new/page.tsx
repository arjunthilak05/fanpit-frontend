// This page dynamically imports the AddSpaceForm component to prevent prerendering issues
import dynamic from 'next/dynamic'

// Prevent static generation for this page since it requires authentication
export const dynamic = 'force-dynamic'

const AddSpaceForm = dynamic(() => import('./AddSpaceForm'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  )
})

export default function AddSpacePage() {
  return <AddSpaceForm />
}
