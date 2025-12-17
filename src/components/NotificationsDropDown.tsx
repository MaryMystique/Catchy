"use client";
import { useState, useEffect, useRef } from "react";
import { FaBell, FaClock, FaExclamationCircle } from "react-icons/fa";
import Link from "next/link";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'deadline' | 'overdue' | 'info';
  taskId?: string;
  projectId?: string;
  createdAt: Date;
  read: boolean;
}

interface NotificationsDropdownProps {
  tasks: Array<{
    id: string;
    title: string;
    dueDate: string;
    status: string;
    projectId: string;
  }>;
}

export default function NotificationsDropdown({ tasks }: NotificationsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Generate notifications from tasks
  useEffect(() => {
    const generateNotifications = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const newNotifications: Notification[] = [];

      tasks.forEach(task => {
        if (task.status === 'done') return; // Skip completed tasks

        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Overdue tasks
        if (diffDays < 0) {
          newNotifications.push({
            id: `${task.id}-overdue`,
            title: 'Overdue Task',
            message: `"${task.title}" is ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''} overdue`,
            type: 'overdue',
            taskId: task.id,
            projectId: task.projectId,
            createdAt: new Date(),
            read: false
          });
        }
        // Due today
        else if (diffDays === 0) {
          newNotifications.push({
            id: `${task.id}-today`,
            title: 'Task Due Today',
            message: `"${task.title}" is due today`,
            type: 'deadline',
            taskId: task.id,
            projectId: task.projectId,
            createdAt: new Date(),
            read: false
          });
        }
        // Due in 1-3 days
        else if (diffDays <= 3) {
          newNotifications.push({
            id: `${task.id}-soon`,
            title: 'Upcoming Deadline',
            message: `"${task.title}" is due in ${diffDays} day${diffDays > 1 ? 's' : ''}`,
            type: 'deadline',
            taskId: task.id,
            projectId: task.projectId,
            createdAt: new Date(),
            read: false
          });
        }
      });

      setNotifications(newNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    };

    generateNotifications();
  }, [tasks]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'overdue':
        return <FaExclamationCircle className="text-red-500" />;
      case 'deadline':
        return <FaClock className="text-yellow-500" />;
      default:
        return <FaBell className="text-blue-500" />;
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };


return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition"
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[500px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <FaBell className="mx-auto text-gray-300 text-3xl mb-3" />
                <p className="text-gray-500 text-sm">No notifications</p>
                <p className="text-gray-400 text-xs mt-1">You're all caught up!</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer ${
                    !notif.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getIcon(notif.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm text-gray-900">{notif.title}</p>
                        {!notif.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{notif.message}</p>
                      <p className="text-xs text-gray-400">{getTimeAgo(notif.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <Link
              href="/notifications"
               className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
