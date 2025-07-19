import { SignIn } from '@clerk/clerk-react'
import { useAuthGuard, useHospitalVerification } from '../lib/auth.js'

export default function ProtectedRoute({ children }) {
  const { user, profile, loading, error, isSignedIn, hasAccess, isHospital } = useAuthGuard()
  const { isVerified } = useHospitalVerification()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show error if there's an authentication error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">There was a problem loading your profile.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Show sign-in if user is not authenticated
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">LifeFlow Admin Portal</h1>
            <p className="text-gray-600">Hospital staff and administrators only</p>
          </div>
          <SignIn 
            routing="hash"
            signUpUrl="/sign-up"
            afterSignInUrl="/"
            appearance={{
              elements: {
                formButtonPrimary: 'bg-red-600 hover:bg-red-700',
                footerActionLink: 'text-red-600 hover:text-red-700'
              }
            }}
          />
        </div>
      </div>
    )
  }

  // Show access denied if user doesn't have hospital/admin access
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">🚫</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            This portal is restricted to hospital staff and administrators only.
          </p>
          <div className="space-x-4">
            <a 
              href="http://localhost:5173" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-block"
            >
              Go to Main App
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Show hospital registration prompt if hospital profile is missing
  if (isHospital && !profile.hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-blue-600 text-6xl mb-4">🏥</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Complete Hospital Registration</h2>
          <p className="text-gray-600 mb-6">
            Please complete your hospital profile to access the admin portal.
          </p>
          <a 
            href="/register" 
            className="block w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Complete Registration
          </a>
        </div>
      </div>
    )
  }

  // Show verification pending message if hospital is not verified
  if (isHospital && !isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-yellow-600 text-6xl mb-4">⏳</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verification Pending</h2>
          <p className="text-gray-600 mb-6">
            Your hospital registration is under review. You'll receive access once verified by our team.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Hospital:</strong> {profile.hospital?.name}<br/>
              <strong>License:</strong> {profile.hospital?.licenseNumber}<br/>
              <strong>Status:</strong> Pending Verification
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Check Status
          </button>
        </div>
      </div>
    )
  }

  // Render the protected content
  return children
}
