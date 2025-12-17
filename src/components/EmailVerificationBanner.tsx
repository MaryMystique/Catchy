"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { FaEnvelope, FaTimes } from "react-icons/fa";

export default function EmailVerificationBanner() {
    const { user, resendVerificationEmail } = useAuth();
    const [isDismissed, setIsDismissed] = useState(false);
    const [isResending, setIsResending] = useState(false);

    // Don't show if user is verified or banner is dismissed
    if (!user || user.emailVerified || isDismissed) {
        return null;
    }

    const handleResend = async () => {
        setIsResending(true);
        try {
            await resendVerificationEmail();
        } catch (error) {
          // Error handled in context  
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="bg-yellow-50 border-b border-yellow-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <FaEnvelope className="text-yellow-600 text-xl shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-mediym text-yellow-900">
                                Please verify your email address
                            </p>
                            <p className="text-xs text-yellow-700 mt-0.5">
                                Check your inbox for a verification link. Didn't receive it?{" "}
                                <button
                                onClick={handleResend} disabled={isResending}
                                className="underline hover:no-underline font-medium disabled:opacity-50">
                                    {isResending ? "Sending..." : "Resend email"}
                                </button>
                            </p>
                        </div>
                    </div>
                    <button
                    onClick={() => setIsDismissed(true)}
                    className="text-yellow-600 hover:text-yellow-900 transition shrink-0" 
                    title="Dismiss" >
                        <FaTimes />
                    </button>
                </div>
            </div>
        </div>
    );
}