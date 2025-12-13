"use client"

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
}

export default function TaskDetailModal({ isOpen, onClose, task }: TaskDetailModalProps) {

  if (!isOpen || !task) return null;
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

        {/* Modal Header */}
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

        {/* Modal Body */}
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

          {/* Activity Section (Placeholder for future) */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Activity</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-sm"></span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Task created</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-sm">:pencil2:</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Priority changed to {task.priority}</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Edit Task
            </button>
            <button
              className="flex-1 bg-red-50 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-100 transition border border-red-200"
            >
              Delete Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
