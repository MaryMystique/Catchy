"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { createTask } from "@/lib/firestore";

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    status?: "todo" | "inProgress" | "done";
    onTaskCreated?: () => void; // callback to refresh tasks
}
export default function TaskModal({ isOpen, onClose, projectId, status = "todo", onTaskCreated }: TaskModalProps) {
  const { user } = useAuth();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        status: status
    });
     
    const [errors, setErrors] = useState({
      title: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

   if (!isOpen) return null;

   const validateForm = () => {
    const newErrors = { title: "" };

     if (!formData.title.trim()) {
            newErrors.title = "Task title is required";
          } else if (formData.title.length < 3) {
            newErrors.title = "Task title must be at least 3 characters";
          }
          setErrors(newErrors);
          return !newErrors.title;
        };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to create a task");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save task to Firestore
      await createTask(user.uid, projectId, {
        title: formData.title,
        description: formData.description,
        priority: formData.priority as 'low' | 'medium' | 'high',
        dueDate: formData.dueDate || "No due date",
        status: formData.status as 'todo' | 'inProgress' | 'done',
      });

      toast.success("Task created successfully!");
     
      // Reset form
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        status: status
      });
      setErrors({ title: "" });
     
      // Call callback to refresh tasks
      if (onTaskCreated) {
        onTaskCreated();
      }
     
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
          <button
            onClick={onClose} disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition disabled:cursor-not-allowed"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>
        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Task Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={(e) => {
                handleChange(e);
              if (errors.title) setErrors({ title: "" });
            }} disabled={isSubmitting}
              className={`w-full px-4 py-3 text-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${errors.title ? "border-red-500" : "border-gray-300"} ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ''}`}
              placeholder="e.g., Design homepage layout"
              autoFocus
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>
          {/* Task Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
              rows={3}
              className={`w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ''}`}
              placeholder="Add more details about this task..."
            />
          </div>
          {/* Priority and Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-semibold text-gray-900 mb-2">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                id="priority"
                name="priority"
                required
                value={formData.priority}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ''}`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            {/* Due Date */}
            <div>
              <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-900 mb-2">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ''}`}
              />
            </div>
          </div>
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-gray-900 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ''}`}
            >
              <option value="todo">To Do</option>
              <option value="inProgress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold transition shadow-md ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={`flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold transition ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

   );
}