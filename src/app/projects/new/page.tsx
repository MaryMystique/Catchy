"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import  { useState } from 'react';
import { FaArrowLeft } from "react-icons/fa";
import { HiLightBulb } from "react-icons/hi";
import toast from 'react-hot-toast';
import Breadcrumbs from '@/components/Breadcrumbs';

const page = () => {
    const router = useRouter();
    const [formData, setForData] = useState({
        name: "",
        description: "",
        color: "bg-blue-500",
        dueDate: ""
    });

    const [errors, setErrors] = useState({
        name: "",
        dueDate: ""
    });

    const colorOptions = [
        { name: "Blue", value: "bg-blue-500" },
        { name: "Purple", value: "bg-purple-500" },
        { name: "Green", value: "bg-green-500" },
        { name: "Orange", value: "bg-orange-500" },
        { name: "Pink", value: "bg-pink-500" },
        { name: "Red", value: "bg-red-500" },
        { name: "Yellow", value: "bg-yellow-500" },
        { name: "Indigo", value: "bg-indigo-500" },
    ];

    const validateForm = () => {
        const newErrors = {
            name: "",
            dueDate: ""
        };

        if (!formData.name.trim()) {
            newErrors.name = "Project name is required";
        } else if (formData.name.length < 3) {
            newErrors.name = "Project name must be at least 3 characters";
        }

        if (formData.dueDate) {
            const selectedDate = new Date(formData.dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                newErrors.dueDate = "Due date cannot be in the past";
            }
        }
        setErrors(newErrors);
        return !newErrors.name && !newErrors.dueDate;
    }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors before submitting");
            return;
        }
        // For just it will redirect to projects page but later, will add actual database creation
        console.log("Creating project:", formData);
        toast.success("project created successfully!");
        router.push("/projects");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

  return (
    <div className='min-h-dvh bg-gray-50 pt-16'>
     <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
            <Breadcrumbs
            items={[
                { label: "Project", href: "/projects" },
                { label: "New Project" }
            ]}
            />
            <h1 className='text-3xl font-bold text-gray-900'>Create New Project</h1>
            <p className='text-gray-600 mt-2'>Fill in the details to create your project</p>
        </div>
        {/* Form */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-8'>
            <form onSubmit={handleSubmit} className='space-y-6'>

                {/* Project Name */}
                <div>
                    <label htmlFor='name' className='block text-sm font-semibold text-gray-900 mb-2'>
                        Project Name <span className='text-red-500'>*</span>
                    </label>
                    <input type='text' id='name' name='name' required value={formData.name} onChange={(e) => { handleChange(e);
                        // clear error when user types
                        if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${errors.name ? "border-red-500" : "border-gray-300"}`} 
                    placeholder='e.g., Website Redesign' />
                    {errors.name && (
                        <p className='text-red-500 text-sm mt-1'>{errors.name}</p>
                    )}
                </div>
               

                {/* Project Description */}
                <div>
                    <label htmlFor='description' className='block text-sm font-semibold text-gray-900 mb-2'>
                        Description
                    </label>
                    <textarea id='description' name='description' value={formData.description} onChange={handleChange} rows={4}  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none' placeholder='What is the project about?' />
                    <p className='text-xs text-gray-500 mt-1'>Optional: Add a brief description of your project</p>
                </div>
                {/* Project Color */}
                <div>
                    <label className='block text-sm font-semibold text-gray-900 mb-3'>
                        Project Color <span className='text-red-500'>*</span>
                    </label>
                    <div className='grid grid-cols-4 sm:grid-cols-8 gap-3'>
                        {colorOptions.map((color) => (
                            <button key={color.value}
                            type='button'
                            onClick={() => setForData({ ...formData, color: color.value})}
                            className={`w-full aspect-square rounded-lg ${color.value} hover:scale-110 transition ${ formData.color === color.value
                                ? "ring-4 ring-gray-900 ring-offset-2" : "ring-2 ring-gray-200"
                            }`}
                            title={color.name} />
                        ))}
                    </div>
                </div>

                {/* Due Date */}
                <div>
                    <label htmlFor='dueDate' className='block text-sm font-semibold text-gray-900 mb-2'>
                        Due Date 
                    </label>
                    <input type='date' id='dueDate' name='dueDate' value={formData.dueDate} onChange={(e) => { handleChange(e);
                        // clear error when user types
                        if (errors.dueDate) setErrors({ ...errors, dueDate: "" });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${errors.dueDate ? "border-red-500" : "border-gray-300"}`} 
                    />
                    {errors.dueDate && (
                        <p className='text-red-500 text-sm mt-1'>{errors.dueDate}</p>
                    )}
                    <p className='text-xs text-gray-500 mt-1'>Optional: Set a dealine for this project</p>
                </div>

                {/* Action Buttons */}
                <div className='flex gap-4 pt-4'>
                    <button type='submit' className='flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg'>
                        Create Project
                    </button>
                    <Link href="/projects" className='flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition text-center'>
                    Cancel
                    </Link>
                </div>
            </form>
        </div>

        {/* Tips Section */}
        <div className='mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6'>
            <h3 className='font-semibold text-gray-900 mb-2'>
                <div className='flex items-start gap-2'>
               <HiLightBulb  className='text-yellow-400 text-3xl'/> 
              <p> Tips for creating projects </p>
               </div>
               </h3>
               <ul className='space-y-1 text-sm text-gray-700 mt-4'>
                <li>. Choose a clear, descriptive name for your project</li>
                <li>. Pick a color to easily identify this project</li>
                <li>. Set realistic due dates to stay on track</li>
                <li>. You can always edit these details later</li>
               </ul>
        </div>

     </div>
    </div>
  )
}

export default page