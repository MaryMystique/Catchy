"use client";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  status: 'todo' | 'inProgress' | 'done';
}

interface DraggableTaskCardProps {
  task: Task;
  onTaskClick: () => void;
  onTaskDrop: (taskId: string, newStatus: 'todo' | 'inProgress' | 'done') => void;
  onToggleComplete: () => void;
}

export default function DraggableTaskCard({ 
  task, 
  onTaskClick, 
  onTaskDrop,
  onToggleComplete 
}: DraggableTaskCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "high": return "bg-red-100 text-red-700 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.setData("currentStatus", task.status);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
    draggable
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
    className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition cursor-grab active:cursor-grabbing group ${isDragging ? "opacity-50 scale-95" : "" }`}
    >
      <div className="flex items-start gap-3">
        <input
        type="checkbox"
        checked={task.status === "done"}
        onChange={onToggleComplete}
        onClick={(e) => e.stopPropagation()}
        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
        />
        <div
         onClick={onTaskClick}
         className="flex-1 cursor-pointer"
         >
          <h4 className={`font-medium text-gray-900 mb-2 ${task.status === 'done' ? "line-through" : "" }`}>{task.title}
          </h4>
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                {task.priority}
            </span>
            <span className="text-xs text-gray-500">{task.dueDate}</span>
          </div>
         </div>
        </div> 
    </div>
  )
}