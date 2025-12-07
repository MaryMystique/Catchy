"use client";
import Link from "next/link";
import Image from "next/image";
import EmptyState from "@/components/EmptyState";

export default function DashboardPage() {
    // Mock data for now - will replace with real data later
    const stats = {
        totalProjects: 5,
        activeTasks: 12,
        completedToday: 3,
        overdueTasks: 2
    };
    const recentProjects = [
        { id: 1, name: "Website Redesign", tasksCount: 8, progress: 60, color: "bg-blue-500" },
        { id: 2, name: "Mobile App", tasksCount: 15, progress: 30, color: "bg-purple-500" },
        { id: 3, name: "Marketing Campaign", tasksCount: 6, progress: 80, color: "bg-green-500" },
    ];

    return(
       <div className="min-h-dvh bg-linear-to-br from-gray-50 to-blue-50 pt-16">
        {/* Header */}
        <header className="bg-blue-50 border-b border-white sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back! Here's what's happening</p>
                </div>
                <Link href="/projects/new"
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"> + New Project</Link>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                 <div>
                   <p className="text-gray-600 text-sm font-medium">Total Projects</p>
                   <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProjects}</p>
                 </div>
                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                   <Image src="/f1.jpg" alt="Total Project" width={48} height={48} className="object-contain" /> 
                 </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                 <div>
                   <p className="text-gray-600 text-sm font-medium">Active Tasks</p>
                   <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeTasks}</p>
                 </div>
                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                   <Image src="/s2.jpg" alt="Active Tasks" width={48} height={48} className="object-contain" /> 
                 </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                 <div>
                   <p className="text-gray-600 text-sm font-medium">Completed Today</p>
                   <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completedToday}</p>
                 </div>
                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                   <Image src="/3.jpg" alt="Completed Today" width={48} height={48} className="object-contain" /> 
                 </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                 <div>
                   <p className="text-gray-600 text-sm font-medium">Overdue Tasks</p>
                   <p className="text-3xl font-bold text-gray-900 mt-2">{stats.overdueTasks}</p>
                 </div>
                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                   <Image src="/ss.jpg" alt="Overdue Tasks" width={48} height={48} className="object-contain" /> 
                 </div>
                </div>
              </div>
         </div>
         {/* Recent Projects */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
            <Link href="/projects" className="text-blue-600 hover:text-blue-700 font-medium transition">
              View all →
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <EmptyState 
            icon="/ro.jpg"
            title="No projects yet"
            description="Create your first project to get started with Catchy."
            actionLabel="Create Project"
            actionHref="/projects/new"
            />
          ) : (
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-3 h-3 rounded-full ${project.color} shrink-0`}></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-600">{project.tasksCount} tasks</p>
                    </div>
                  </div>
                  <div className="w-full sm:w-40">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${project.color}`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          )}
         </div>
        </main>
       </div>
    );
}