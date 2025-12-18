"use client";
import Link from "next/link";
import { FaCheckCircle, FaEnvelope } from "react-icons/fa";

export default function EmailVerifiedPage() {
    return (
        <div className="min-h-dvh bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                    {/* Successs Icon */}
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaCheckCircle className="text-green-600 text-4xl" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Email Verified
                        </h1>
                        <p className="text-gray-600">
                            Your email has been verified successfully. You can log in to your account.
                        </p>
                    </div>
                    {/* Success Message */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-3 text-green-800">
                            <FaEnvelope className="text-xl" />
                            <p className="text-sm font-medium">
                                Your account is now active and ready to use!
                            </p>
                        </div>
                    </div>
                    {/* Login Button */}
                    <Link
                    href="/login"
                    className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg">
                        Go to Login
                    </Link>
                    {/* Help Text */}
                    <p className="text-sm text-gray-500 mt-6">
                        Having trouble?{" "}
                        <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-bold">
                        Reset your password
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}