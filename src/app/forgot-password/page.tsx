"use client";
import Link from "next/link";
import Image from "next/image";
import { FaHome, FaEnvelope } from "react-icons/fa";
import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const validateEmail = () => {
        if (!email.trim()) {
            setError("Email is required");
            return false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Email is invaild");
            return false;
        }
        setError("");
        return true;
     };

     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateEmail) {
            return;
        }
        setIsLoading(true);

        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, email);
            setEmailSent(true);
            toast.success("Password reset email sent! Check your inbox.");
        } catch (error: any) {
           console.error("Password reset email failed:", error);
           if (error.code === 'auth/user-not-found') {
            toast.error("No account found with this email address.");
           } else if (error.code === 'auth/invaild-email') {
            toast.error("Invaild email address.");
           } else {
            toast.error("Failed to send reset email. Please try again.");
           }
        } finally {
            setIsLoading(false);
        }
     };

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (error) {
            setError("");
        }
     }

     return (
    <div className='min-h-dvh bg-linear-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4 py-12'>
      <div className='max-w-md w-full'>
        {/* Logo */}
        <div className='text-center mb-8 mt-7'>
          <Link href="/" className='inline-flex items-center gap-2 justify-center mb-2'>
            <Image src="/dc.jpg" alt='Catchy logo' width={48} height={48} className='w-12 h-12 object-cover rounded-lg' />
            <span className='text-3xl font-bold text-blue-600'>Catchy</span>
          </Link>
          <h1 className='text-2xl font-bold text-gray-900 mt-4'>Forgot Password?</h1>
          <p className='text-gray-600 mt-2'>
            {emailSent
              ? "Check your email for reset instructions"
              : "Enter your email to receive a password reset link"}
          </p>
        </div>
        {/* Form or Success Message */}
        {!emailSent ? (
          <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-8'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Email Field */}
              <div>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                  Email Address
                </label>
                <div className='relative'>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    required
                    value={email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 pl-11 text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                      error ? "border-red-500" : "border-gray-300"
                    } ${isLoading ? "bg-gray-100 cursor-not-allowed" : ''}`}
                    placeholder='you@example.com'
                  />
                  <FaEnvelope className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                </div>
                {error && (
                  <p className='text-red-500 text-sm mt-1'>{error}</p>
                )}
              </div>
              {/* Submit Button */}
              <button
                type='submit'
                disabled={isLoading}
                className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg ${
                  isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Sending..." : 'Send Reset Link'}
              </button>
            </form>
            {/* Back to Login */}
            <div className='mt-6 text-center'>
              <Link href="/login" className='text-sm text-blue-600 hover:text-blue-700 font-medium'>
                ← Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-8'>
            {/* Success Icon */}
            <div className='flex justify-center mb-6'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
                <FaEnvelope className='text-green-600 text-2xl' />
              </div>
            </div>
            {/* Success Message */}
            <div className='text-center space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900'>Email Sent!</h3>
              <p className='text-gray-600'>
                We've sent a password reset link to <span className='font-medium'>{email}</span>
              </p>
              <p className='text-sm text-gray-500'>
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>
            {/* Action Buttons */}
            <div className='mt-8 space-y-3'>
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
                className='w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition'
              >
                Try Different Email
              </button>
              <Link
                href="/login"
                className='block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition'
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}
        {/* Back to Home */}
        <div className='text-center mt-6'>
          <Link href="/" className='text-gray-600 hover:text-gray-900 transition'>
            <div className='inline-flex items-center gap-3'>
              <FaHome className="text-gray-800 text-2xl"/>
              <p>Back to Home</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
  }