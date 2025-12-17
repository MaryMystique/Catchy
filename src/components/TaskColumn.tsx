"use client";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import DraggableTaskCard from "./DraggableTaskCard";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  status: 'todo' | 'inProgress' | 'done';
}

interface TaskColumnProps {
  title: string;
  status: 'todo' | 'inProgress' | 'done';
  tasks: Task[];
  bgColor: string;
  borderColor: string;
  onAddTask: () => void;
  onTaskClick: (task: Task) => void;
  onTaskDrop: (taskId: string, newStatus: 'todo' | 'inProgress' | 'done') => Promise<void>;
  onToggleComplete: (task: Task) => void;
}

export default function TaskColumn({
  title,
  status,
  tasks,
  bgColor,
  borderColor,
  onAddTask,
  onTaskClick,
  onTaskDrop,
  onToggleComplete
}: TaskColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const taskId = e.dataTransfer.getData("taskId");
    const currentStatus = e.dataTransfer.getData("currentStatus");

    // Only update if moving to different column
    if (currentStatus !== status && taskId) {
      await onTaskDrop(taskId, status);
    }
  };

  return (
    <div 
      className={`${bgColor} rounded-xl p-4 transition-all ${
        isDragOver ? 'ring-2 ring-blue-500 ring-offset-2 scale-[1.02]' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className='flex items-center justify-between mb-4'>
        <h3 className='font-semibold text-gray-900'>
          {title} <span className='text-gray-500 text-sm ml-1'>({tasks.length})</span>
        </h3>
        <button 
          onClick={onAddTask}
          className='text-gray-600 hover:text-gray-900 transition'
        >
          <FaPlus className='text-lg' />
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className='text-center py-8 text-gray-500 text-sm border-2 border-dashed border-gray-300 rounded-lg'>
          {isDragOver ? 'Drop task here' : `No tasks in ${title}`}
        </div>
      ) : (
        <div className='space-y-3 min-h-[100px]'>
          {tasks.map((task) => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              onTaskClick={() => onTaskClick(task)}
              onTaskDrop={onTaskDrop}
              onToggleComplete={() => onToggleComplete(task)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
