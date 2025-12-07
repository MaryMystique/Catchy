"use client";
import Link from 'next/link';
import Image from 'next/image';
import { FaHome } from "react-icons/fa";

export default function LoginPage () {
  return (
    <div className='min-h-dvh bg-linear-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4 py-12'>
      <div className='max-w-md w-full'>
        {/* logo */}
        <div className='text-center mb-8 mt-7'>
          <Link href="/" className='inline-flex items-center gap-2 justify-center mb-2'>
           <Image src="/dc.jpg" alt='Catchy logo' width={48} height={48} className='w-12 h-12 object-cover rounded-lg' />
           <span className='text-3xl font-bold text-blue-600'>Catchy</span>
          </Link>
          <h1 className='text-2xl font-bold text-gray-900 mt-4'>Welcome back</h1>
          <p className='text-gray-600 mt-2'>Sign in to your account to continue</p>
        </div>
        {/* Login Form */}
        <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-8'>
            <form className='space-y-6'>
                {/* Email Field */}
                <div>
                    <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                        Email Address
                    </label>
                    <input type='email' id='email' name='email' required className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition' placeholder='you@example.com' />
                </div>
                {/* Password Field */}
                <div>
                    <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
                        Password
                    </label>
                    <input type='password' id='password' name='password' required className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition' placeholder='........' />
                </div>
                {/* Remember Me & Forgot Password */}
                <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                     <input type='checkbox' id='remember' className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'/>
                     <label htmlFor='remember' className='ml-2 text-sm text-gray-600'>
                        Remember Me
                     </label>
                    </div>
                    <Link href="/forgot-password" className='text-sm text-blue-600 hover:text-blue-700 font-medium'>
                    Forgot password?
                    </Link>
                </div>
                {/* Submit Button */}
                <button type='submit' className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg'>
                    Sign In
                </button>
            </form>
            {/* Sign Up Link */}
            <div className='mt-6 text-center'>
             <p className='text-gray-600'>
                Don't have an account?{" "}
                <Link href="/signup" className='text-blue-600 hover:text-blue-700 font-semibold'>
                Sign up for Free
                </Link>
             </p>
            </div>
        </div>
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
  )
}

