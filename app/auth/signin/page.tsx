import { Suspense } from 'react'
import { AuthSignin } from '@/components/auth-signin'

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white">Loading...</p>
      </div>
    </div>
  )
}

export default function SigninPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthSignin />
    </Suspense>
  )
}
