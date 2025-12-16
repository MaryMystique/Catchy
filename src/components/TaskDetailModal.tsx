"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { updateTask, deleteTask } from "@/lib/firestore";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";


interface Task {
  id: number;
  title: string;
  priority: string;
  dueDate: string;
  description?: string;
  status?: string;
}

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  projectId?: string;
}

export default function TaskDetailModal({ isOpen, onClose, task, projectId }: TaskDetailModalProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [editFormData, setEditFormData] = useState<{
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    dueDate: string;
    status: 'todo' | 'inProgress' | 'done';
  }>({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    status: "todo"
  });

  //Load task data into form when task changes
  useEffect(() => {
    if (task) {
      setEditFormData({
        title: task.title,
        description: task.description || "",
        priority: task.priority as "low" | "medium" | "high",
        dueDate: task.dueDate,
        status: (task.status || "todo") as 'todo' | 'inProgress' | 'done'
      });
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !projectId) {
      toast.error("Unable to update task");
      return;
    }

    try {
      await updateTask(user.uid, projectId, task.id.toString(), editFormData);
      toast.success("Task updated successfully!");
      setIsEditing(false);
      onClose(); // Close modal and refresh parent
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async () => {
    if (!user || !projectId) {
      toast.error("Unable to delete task");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteTask(user.uid, projectId, task.id.toString());
      toast.success("Task deleted successfully!");
      onClose(); // Close modal and refresh parent
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
      setIsDeleting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "high": return "bg-red-100 text-red-700 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusInfo = (status: string) => {
    switch(status) {
      case "todo": return { label: "To Do", color: "bg-gray-100 text-gray-700" };
      case "inProgress": return { label: "In Progress", color: "bg-blue-100 text-blue-700" };
      case "done": return { label: "Done", color: "bg-green-100 text-green-700" };
      default: return { label: "To Do", color: "bg-gray-100 text-gray-700" };
    }
  };

  const statusInfo = getStatusInfo(task.status || "todo");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

        {isEditing ? (
          // EDIT MODE
          <>
            <div className="flex items-start justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Edit Task</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            <form onSubmit={handleEditTask} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  rows={4}
                />
              </div>

              {/* Priority & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Priority
                  </label>
                  <select
                    value={editFormData.priority}
                    onChange={(e) => setEditFormData({...editFormData, priority: e.target.value as "low" | "medium" | "high"})}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Status
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({...editFormData, status: e.target.value as "todo" | "inProgress" | "done"})}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="todo">To Do</option>
                    <option value="inProgress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={editFormData.dueDate}
                  onChange={(e) => setEditFormData({...editFormData, dueDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </>
          ) : (
       
          // VIEW MODE
          <>
            <div className="flex items-start justify-between p-6 border-b border-gray-200">
              <div className="flex-1 pr-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                    {task.priority} priority
                  </span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition shrink-0"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Due Date */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Due Date</h3>
                <div className="flex items-center gap-2 text-gray-900">
                  <span className="text-lg">:date:</span>
                  <span>{task.dueDate}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {task.description || "No description provided for this task."}
                </p>
              </div>

              {/* Activity Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Activity</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-sm">✓</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Task created</p>
                      <p className="text-xs text-gray-500">Recently</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-sm">:pencil2:</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Priority set to {task.priority}</p>
                      <p className="text-xs text-gray-500">Recently</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Edit Task
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex-1 bg-red-50 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-100 transition border border-red-200"
                >
                  Delete Task
                </button>
              </div>
            </div>
          </>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FaTrash className="text-red-600" size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Delete Task</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this task? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTask}
                  disabled={isDeleting}
                  className={`flex-1 px-4 py-2 bg-red-600 text-white rounded-lg transition ${
                    isDeleting ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
                  }`}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
