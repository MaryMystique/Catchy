"use client";
import Link from "next/link";
import Image from "next/image";
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function SignUpPage() {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await signup(formData.email, formData.password, formData.name);
      // AuthContext will handle redirect to dashboard
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

    return(
     <div className='min-h-dvh bg-linear-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4 py-12'>
       <div className='max-w-md w-full'>
        {/* logo */}
        <div className='text-center mb-8 mt-7'>
          <Link href="/" className='inline-flex items-center gap-2 justify-center mb-2'>
           <Image src="/dc.jpg" alt='Catchy logo' width={48} height={48} className='w-12 h-12 object-cover rounded-lg' />
           <span className='text-3xl font-bold text-blue-600'>Catchy</span>
          </Link>
          <h1 className='text-2xl font-bold text-gray-900 mt-4'>Create your account</h1>
          <p className='text-gray-600 mt-2'>Start organizing your tasks today</p>
        </div> 
        {/* Sign Up Form */}
        <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-8'>
            <form onSubmit={handleSubmit} className='space-y-5'>
                {/* Full Name Field */}
                <div>
                    <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-2'>
                        Full Name
                    </label>
                    <input type='text' id='name' name='name' required value={formData.name} onChange={handleChange} disabled={isLoading} className={`w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${ errors.name ? "border-red-500" : "border-gray-300" } ${isLoading ? "bg-gray-100 cursor-not-allowed" : ''}`} placeholder='Mary Madu' />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                </div>
                {/* Email Field */}
                <div>
                    <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                        Email Address
                    </label>
                    <input type='email' id='email' name='email' required value={formData.email} onChange={handleChange} disabled={isLoading} className={`w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${ errors.email ? "border-red-500" : "border-gray-300" } ${isLoading ? "bg-gray-100 cursor-not-allowed" : ''}`} placeholder='you@example.com' />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                </div>
                {/* Password Field */}
                <div>
                    <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
                        Password
                    </label>
                    <div className="relative">
                    <input type={showPassword ? 'text' : 'password'}
                     id='password' name='password' required value={formData.password} onChange={handleChange} disabled={isLoading} className={`w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${ errors.password ? "border-red-500" : "border-gray-300" } ${isLoading ? "bg-gray-100 cursor-not-allowed" : ''}`} placeholder='........' />
                     <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition" disabled={isLoading}>
                      {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                     </button>
                     </div>
                    {errors.password && ( 
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                </div>
                {/* Confirm Password Field */}
                <div>
                    <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 mb-2'>
                       Confirm Password
                    </label>
                    <div className="relative">
                    <input type={showConfirmPassword ? 'text' : 'password'}
                     id='confirmPassword' name='confirmPassword' required value={formData.confirmPassword} onChange={handleChange} disabled={isLoading} className={`w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${ errors.confirmPassword ? "border-red-500" : "border-gray-300" } ${isLoading ? "bg-gray-100 cursor-not-allowed" : ''}`} placeholder='........' />
                     <button
                     type="button"
                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition" disabled={isLoading}>
                      {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                     </button>
                     </div>
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
               </div>
                  {/* Submit Button */}
                  <button type='submit' disabled={isLoading} className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg ${ isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}>
                    {isLoading ? 'Creating Account...' : "Create Account"}
                   </button>
                   </form>
                {/* Terms Checkbox */}
                <div className='flex items-start'>
                     <input type='checkbox' id='terms' required className='w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500'/>
                     <label htmlFor='terms' className='ml-2 text-sm text-gray-600'>
                        I agree to the{" "}
                    <Link href="/terms" className='text-blue-600 hover:text-blue-700 font-medium'>
                    Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className='text-blue-600 hover:text-blue-700 font-medium'>
                    Privacy Policy
                    </Link>
                     </label>
                </div>
               
            {/* Login Link */}
            <div className='mt-6 text-center'>
             <p className='text-gray-600'>
                Already have an account?{" "}
                <Link href="/login" className='text-blue-600 hover:text-blue-700 font-semibold'>
                Sign in
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
    );
}