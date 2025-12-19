"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, applyActionCode } from "firebase/auth";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";

export default function EmailVerifiedPage() {
    const [isVerifying, setIsVerifying] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                // Get the action code from URL
                const urlParams = new URLSearchParams(window.location.search);
                const mode = urlParams.get('mode');
                const oobCode = urlParams.get('oobCode');

                if (mode === 'verifyEmail' && oobCode) {
                    const auth = getAuth();

                    // Apply the email verification code
                    await applyActionCode(auth, oobCode);

                    // Reload the user to get updated emailVerified status
                    if (auth.currentUser) {
                        await auth.currentUser.reload();
                    }

                    setIsVerifying(false);
                    toast.success("Email verified successfully! Redirecting to dashboard...");

                    // Redirect to dashboard after 2 seconds
                    setTimeout(() => {
                      router.push('/dashboard');
                    }, 2000);
                } else {
                    setError('Invalid verification link');
                    setIsVerifying(false);
                }
            } catch (error: any) {
              console.error('Verification error:', error);
              setError(error.Message || 'Failed to verify email');
              setIsVerifying(false);  
            }
          };
           verifyEmail();
          }, [router]);

          if (isVerifying) {
            return (
                <div className="min-h-dvh bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full">
                        <FaSpinner className="text-blue-600 text-5xl mx-auto mb-4 animate-spin" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email...</h2>
                        <p className="text-gray-600">Please wait while we verify your email address.</p>
                    </div>
                </div>
            );
          }
     if (error) { 
      return (
         <div className="min-h-dvh bg-linear-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-4xl">x</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-6">{error}</p>
               <a
                 href="/signup"
                 className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Back to Sign Up
                 </a>
                 </div>
                 </div>
                 );
                }
                  
      return (
         <div className="min-h-dvh bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-green-600 text-4xl" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Verified!</h1>
              <p className="text-gray-600 mb-4">
                Your email has been verified successfully. Redirecting you to the dashboard...
              </p>
               <div className="flex items-center justify-center gap-2 text-blue-600">
                <FaSpinner className="animate-spin" />
                <span className="text-sm">Loading your dashboard...</span>
               </div>
                 </div>
                 </div>
                 );
                }
                  