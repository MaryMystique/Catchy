import React from 'react'
import Link from 'next/link'

export default function Footer()  {
  return (
    <footer className='bg-white border-t border-gray-200 py-12'>
     <div className='max-w-7xl mx-autopx-4 sm:px-6 lg:px-8'>
        {/* Footer Content */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
            {/* Brand Section */}
            <div>
                <h3 className='text-xl font-bold text-blue-600 mb-3'>Catchy</h3>
                <p className='text-gray-600 leading-relaxed'>
                    Simple task management for productive people. Organize your life, one task at a time.
                </p>
            </div>
            {/* Quick links */}
            <div>
                <h4 className='font-semibold text-gray-900 mb-3'>Quick Links</h4>
                <ul className='space-y-2'>
                    <li>
                        <Link href="/about" className='text-gray-600 hover:text-blue-600 transition'>
                        About Us
                        </Link>
                    </li>
                    <li>
                        <Link href="/features" className='text-gray-600 hover:text-blue-600 transition'>
                        Features
                        </Link>
                    </li>
                    <li>
                        <Link href="/pricing" className='text-gray-600 hover:text-blue-600 transition'>
                        Pricing
                        </Link>
                    </li>
                </ul>
            </div>
            {/* Support */}
            <div>
                <h4 className='font-semibold text-gray-900 mb-3'>Support</h4>
                <ul className='space-y-2'>
                    <li>
                        <Link href="/help" className='text-gray-600 hover:text-blue-600 transition'>
                        Help Center
                        </Link>
                    </li>
                    <li>
                        <Link href="/contact" className='text-gray-600 hover:text-blue-600 transition'>
                        Contact Us
                        </Link>
                    </li>
                    <li>
                        <Link href="/privacy" className='text-gray-600 hover:text-blue-600 transition'>
                        Privacy Policy
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
        {/* Bottom bar */}
        <div className='border-t border-gray-200 pt-6 text-center text-gray-600'>
            <p>&copy; {new Date().getFullYear()} Catchy. Built with passion for productivity.</p>
        </div>
     </div>
    </footer>
  )
}

