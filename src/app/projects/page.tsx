"use client";
import Image from "next/image";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import EmptyState from '@/components/EmptyState';
import SearchBar from '@/components/SearchBar';
import { ProjectCardSkeleton, ProjectListSkeleton } from '@/components/LoadingSkeletons';
import { useRouter } from 'next/navigation';
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { getProjects, getTasks } from "@/lib/firestore";
import toast from "react-hot-toast";

interface ProjectWithStats {
  id: string;
  name: string;
  description: string;
  color: string;
  dueDate: string;
  tasksCount: number;
  completedTasks: number;
  progress: number;
}

const page = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [projects, setProjects] = useState<ProjectWithStats[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "progress" | "date">("name");

  // Load projects from Firestore
  useEffect(() => {
    if (!user) return;

    const loadProjects = async () => {
      try {
        setIsLoading(true);
        const projectsData = await getProjects(user.uid);

        // Load tasks for each project to calculate stats
        const ProjectWithStats = await Promise.all(
          projectsData.map(async (project) => {
            const tasks = await getTasks(user.uid, project.id!);
            const completedTasks = tasks.filter(task => task.status === 'done').length;
            const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

            return {
              id: project.id!,
              name: project.name,
              description: project.description,
              color: project.color,
              dueDate: project.dueDate,
              tasksCount: tasks.length,
              completedTasks,
              progress,
            };
          })
        );

        setProjects(ProjectWithStats);
      } catch (error) {
        console.error('Error loading projects:', error);
        toast.error('Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [user]);

  // Filter projects based on search
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort filtered projects
  const sortedProjects = [ ... filteredProjects].sort((a, b) => {
    switch(sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "progress":
        return b.progress - a.progress; // Higher progress first
      case "date":
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(); // Earlier dates first
      default:
        return 0; 
    }
  });

  return (
    <ProtectedRoute>
    <div className='min-h-dvh bg-gray-50 pt-16'>
     {/* Header */}
      <header className='bg-white border-b border-gray-200 sticky top-0 z-10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
            <div className='flex-1'>
              <h1 className='text-2xl font-bold text-gray-900'>All Projects</h1>
              <p className='text-gray-600 mt-1'>
                {sortedProjects.length} projects {sortedProjects.length ! === 1 ? 's' : ''}
                 {searchQuery && `found for "${searchQuery}"`} </p>
            </div>

            <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
              {/* Search Bar */}
             <div className="w-full sm:w-64">
               <SearchBar
                placeholder="Search projects..."
                onSearch={setSearchQuery}
               />
             </div>


              {/* Sort Dropdown */}
              <select
               value={sortBy}
               onChange={(e) => setSortBy(e.target.value as "name" | "progress" | "date")}
               className='px-4 py-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'>
                <option value="name">Sort by Name</option>
                <option value="progress">Sort by Progress</option>
                <option value="date">Sort by Due Date</option>
               </select>

              {/* Toggle View */}
              <div className='flex bg-gray-100 rounded-lg p-1'>
                <button onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${viewMode === "grid"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
                }`} > Grid </button> 

                <button onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${viewMode === "list"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
                }`} > List </button> 
              </div>

              <Link href="/projects/new" className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-center'>+ New Project</Link>
            </div>
          </div>
        </div>
      </header>
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>

      {isLoading ? (
          // Show skeletons while loading
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <ProjectListSkeleton />
          )
        ) : sortedProjects.length === 0 ? (
          // Show empty state
          searchQuery ? (
            <EmptyState
              icon="/sm.jpg"
              title="No projects found"
              description={`No projects match "${searchQuery}". Try a different search term.`}
            />
          ) : (
            <EmptyState
              icon="/f3.jpg"
              title="No projects yet"
              description="Create your first project to start organizing your tasks and boost your productivity."
              actionLabel="Create Project"
              actionHref="/projects/new"
            />
          )

       ) : (
      <>
        {/* Grid View */}
        {viewMode === "grid" && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {sortedProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}
              className='bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition p-6 group'>
                {/* Colour Indicator */}
                <div className='flex items-start justify-between mb-4'>
                  <div className={`w-12 h-12 ${project.color} rounded-lg`}></div>
                  <span className='text-xs text-gray-500'>{project.dueDate}</span>
                </div>
                {/* Project Info */}
                <h3 className='text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition'>
                  {project.name}
                </h3>
                <p className='text-gray-600 text-sm mb-4 line-clamp-2'>
                  {project.description}
                </p>
                {/* Progress Bar */}
                <div className='mb-4'>
                  <div className='flex items-center justify-between text-sm mb-2'>
                    <span className='text-gray-600'>Progress</span>
                    <span className='font-semibold text-gray-900'>{project.progress}%</span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div className={`h-2 rounded-full ${project.color}`}
                    style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>
                {/* Task Count */}
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-600'>
                    {project.completedTasks}/{project.tasksCount} tasks Completed
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
        {/* List View */}
        {viewMode === "list" && (
          <div className='bg-white rounded-xl shadow-sm border border-gray-200'>
            {sortedProjects.map((project, index) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className={`flex flex-col sm:flex-row sm:items-center gap-4 p-6 hover:bg-gray-50 transition ${
                  index ! ===  sortedProjects.length - 1 ? "border-b border-gray-200" : ""
                }`} >
                {/* Colour Dot */}
                <div className={`w-4 h-4 rounded-full ${project.color} shrink-0`}></div>
                {/* Project Name */}
                 <div className='flex-1 min-w-0'>
                  <h3 className='font-semibold text-gray-900 mb-1'>{project.name}</h3>
                  <p className='text-sm text-gray-600 truncate'>{project.description}</p>
                </div>
                {/* Progress */}
                <div className='w-full sm:w-48'>
                  <div className='flex items-center justify-between text-sm mb-1'>
                    <span className='text-gray-600'>Progress</span>
                    <span className='font-semibold text-gray-900'>{project.progress}%</span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div className={`h-2 rounded-full ${project.color}`}
                    style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>
                {/* Task Count  & Due Date*/}
                <div className='flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1 text-sm'>
                  <span className='text-gray-600'>
                    {project.completedTasks}/{project.tasksCount} tasks 
                  </span>
                  <span className='text-gray-500 text-xs'>{project.dueDate}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
        </>
       )}
      </main>
    </div>
    </ProtectedRoute>
  );
}

export default page