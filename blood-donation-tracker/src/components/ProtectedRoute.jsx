import { SignIn } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useAuthGuard } from "../lib/auth.js";

export default function ProtectedRoute({
  children,
  requiredRole = null,
  fallback = null,
}) {
  const { user, profile, loading, error, isSignedIn, hasAccess } =
    useAuthGuard(requiredRole);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error if there's an authentication error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Authentication Error
          </h2>
          <p className="text-gray-600 mb-4">
            There was a problem loading your profile.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show sign-in if user is not authenticated
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to LifeFlow
            </h1>
            <p className="text-gray-600">Please sign in to continue</p>
          </div>
          <SignIn
            routing="hash"
            signUpUrl="/sign-up"
            afterSignInUrl="/"
            appearance={{
              elements: {
                formButtonPrimary: "bg-red-600 hover:bg-red-700",
                footerActionLink: "text-red-600 hover:text-red-700",
              },
            }}
          />
        </div>
      </div>
    );
  }

  // Show access denied if user doesn't have required role
  if (!hasAccess) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">🚫</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
            {requiredRole &&
              ` This page requires ${requiredRole.toLowerCase()} access.`}
          </p>
          <div className="space-x-4">
            <button
              onClick={() => window.history.back()}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Go Back
            </button>
            <Link
              to="/"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 inline-block"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show profile completion prompt if profile is incomplete
  if (
    profile &&
    !profile.donor &&
    !profile.hospital &&
    (!profile.role || profile.role !== "ADMIN")
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-blue-600 text-6xl mb-4">👋</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome to LifeFlow!
          </h2>
          <p className="text-gray-600 mb-6">
            To get started, please complete your profile by choosing your role.
          </p>
          <div className="space-y-3">
            <Link
              to="/register/donor"
              className="block w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition duration-200 text-center"
            >
              🩸 I'm a Blood Donor
            </Link>
            <Link
              to="/register/hospital"
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 text-center"
            >
              🏥 I'm a Hospital
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render the protected content
  return children;
}
