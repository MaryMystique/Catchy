"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getTasks, getProjects } from "@/lib/firestore";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { FaClock, FaExclamationCircle, FaArrowLeft } from "react-icons/fa";


interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'deadline' | 'overdue' | 'info';
  taskId?: string;
  projectId?: string;
  projectName?: string;
  taskTitle?: string;
  createdAt: Date;
  read: boolean;
}

export default function AllNotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const projects = await getProjects(user.uid);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const allNotifications: Notification[] = [];

        for (const project of projects) {
          const tasks = await getTasks(user.uid, project.id!);

          tasks.forEach((task: any) => {
            if (task.status === 'done') return;

            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);

            const diffTime = dueDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 0) {
              allNotifications.push({
                id: `${task.id}-overdue`,
                title: 'Overdue Task',
                message: `"${task.title}" is ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''} overdue`,
                type: 'overdue',
                taskId: task.id,
                projectId: project.id,
                projectName: project.name,
                taskTitle: task.title,
                createdAt: new Date(),
                read: false
              });
            } else if (diffDays === 0) {
              allNotifications.push({
                id: `${task.id}-today`,
                title: 'Task Due Today',
                message: `"${task.title}" is due today`,
                type: 'deadline',
                taskId: task.id,
                projectId: project.id,
                projectName: project.name,
                taskTitle: task.title,
                createdAt: new Date(),
                read: false
              });
            } else if (diffDays <= 3) {
              allNotifications.push({
                id: `${task.id}-soon`,
                title: 'Upcoming Deadline',
                message: `"${task.title}" is due in ${diffDays} day${diffDays > 1 ? 's' : ''}`,
                type: 'deadline',
                taskId: task.id,
                projectId: project.id,
                projectName: project.name,
                taskTitle: task.title,
                createdAt: new Date(),
                read: false
              });
            }
          });
        }

        setNotifications(allNotifications.sort((a, b) => {
          if (a.type === 'overdue' && b.type !== 'overdue') return -1;
          if (a.type !== 'overdue' && b.type === 'overdue') return 1;
          return 0;
        }));
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, [user]);

  const getIcon = (type: string) => {
    switch(type) {
      case 'overdue':
        return <FaExclamationCircle className="text-red-500" size={24} />;
      case 'deadline':
        return <FaClock className="text-yellow-500" size={24} />;
      default:
        return <FaClock className="text-blue-500" size={24} />;
    }
  };


return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
            >
              <FaArrowLeft /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">All Notifications</h1>
            <p className="text-gray-600 mt-2">
              {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Notifications List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center">
                <FaClock className="mx-auto text-gray-300 text-5xl mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-500">You're all caught up! No pending deadlines.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notif) => (
                  <Link
                    key={notif.id}
                    href={`/projects/${notif.projectId}`}
                    className={`block p-6 hover:bg-gray-50 transition ${
                      notif.type === 'overdue' ? 'bg-red-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getIcon(notif.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            notif.type === 'overdue' 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {notif.type === 'overdue' ? 'Overdue' : 'Upcoming'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{notif.message}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>Project: {notif.projectName}</span>
                          <span>•</span>
                          <span>Task: {notif.taskTitle}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
