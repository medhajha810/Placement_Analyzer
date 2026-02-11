import { Suspense } from 'react'
import { AuthSignup } from '@/components/auth-signup'

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <AuthSignup />
    </Suspense>
  )
}
