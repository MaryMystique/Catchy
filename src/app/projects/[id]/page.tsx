"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { IoMdArrowRoundForward } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { FaPlus, FaRegCalendarAlt } from "react-icons/fa";
import TaskModal from '@/components/TaskModal';
import TaskDetailModal from '@/components/TaskDetailModal';
import { TbFilters } from "react-icons/tb";
import Breadcrumbs from '@/components/Breadcrumbs';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { getProject, getTasks } from '@/lib/firestore';
import { TaskCardSkeleton } from '@/components/LoadingSkeletons';
import EmptyState from '@/components/EmptyState';
import toast from 'react-hot-toast';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' |'high';
  dueDate: string;
  status: 'todo' | 'inProgress' | 'done';
}

const Page = () => {
    const params = useParams();
    const projectId = params.id as string;
    const { user } = useAuth();

    const [project, setProject] = useState<any>(null);
    const [tasks, setTasks] = useState<{
    todo: Task[];
    inProgress: Task[];
    done: Task[]
  }>({
    todo: [],
    inProgress: [],
    done: []
  });

  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  //Load project and tasks
  const loadProjectData = async () => {
    if (!user || !projectId) return;

    try {
      setIsLoading(true);
     
      // Load project
      const projectData = await getProject(user.uid, projectId);
      if (!projectData) {
        toast.error("Project not found");
        return;
      }
      setProject(projectData);

      // Load tasks
      const tasksData = await getTasks(user.uid, projectId);
     
      // Organize tasks by status
      const organizedTasks = {
        todo: tasksData.filter(task => task.status === 'todo'),
        inProgress: tasksData.filter(task => task.status === 'inProgress'),
        done: tasksData.filter(task => task.status === 'done')
      };
     
      setTasks(organizedTasks);
    } catch (error) {
      console.error('Error loading project:', error);
      toast.error('Failed to load project data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjectData();
  }, [user, projectId])
  
  // Filter tasks based on selected filters
  const filterTasks = (taskList: Task[]) => {
    return taskList.filter(task => {
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      return matchesPriority;
    });
  };
  const filteredTasks = {
    todo: filterTasks(tasks.todo),
    inProgress: filterTasks(tasks.inProgress),
    done: filterTasks(tasks.done)
  };

  const handleTaskClick = (task: Task, status: string) => {
    setSelectedTask({ ...task, status});
    setIsDetailModalOpen(true);
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "high": return "bg-red-100 text-red-700 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Calculate progress
  const totalTasks = tasks.todo.length + tasks.inProgress.length + tasks.done.length;
  const progress = totalTasks > 0 ? Math.round((tasks.done.length / totalTasks) * 100) : 0;

  if (isLoading || !project) {
    return (
      <ProtectedRoute>
        <div className='min-h-dvh bg-gray-50 pt-16'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='animate-pulse space-y-4'>
              <div className='h-8 bg-gray-200 rounded w-1/3'></div>
              <div className='h-24 bg-gray-200 rounded'></div>
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {[1, 2, 3].map(i => (
                  <div key={i} className='bg-gray-200 rounded-xl h-64'></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }
  return (
    <ProtectedRoute>
    <div className='min-h-dvh bg-gray-50 pt-16'>
     {/* Project Header */}
     <header className='bg-white border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
         {/* Breadcrumb */}
         <Breadcrumbs
           items={[
            { label: "Projects", href: "/projects" },
            { label: project.name }
           ]}
           />
         
         <div className='flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4'>
          {/* Project Info */}
          <div className='flex-1'>
            <div className='flex items-center gap-3 mb-3'>
              <div className={`w-4 h-4 rounded-full ${project.color}`}></div>
              <h1 className='text-3xl font-bold text-gray-900'>{project.name}</h1>
            </div>
            <p className='text-gray-600 mb-4'>{project.description}</p>

            {/* Project Stats */}
            <div className='flex flex-wrap items-center gap-6 text-sm'>
              <div>
                <span className='text-gray-600'>Due Date:</span>
                <span className='font-medium text-gray-900'>{project.dueDate}</span>
              </div>
            <div>
              <span className='text-gray-600'>Progress:</span>
              <span className='font-medium text-gray-900'>{project.progress}%</span>
          </div>
          <div>
            <span className='text-gray-600'>Tasks:</span>
            <span className='font-medium text-gray-900'>{totalTasks}</span>
          </div>
         </div>
        {/* Filters */}
        <div className='flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-200'>
          <span className='text-sm font-medium text-gray-700'> <TbFilters /> </span>
          {/* Priority Filter */}
          <select
           value={priorityFilter}
           onChange={(e) => setPriorityFilter(e.target.value)}
           className='px-3 py-1.5 text-sm border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'>
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
           </select>
           {/* Clear Filters */}
           {(priorityFilter ! == "all") && (
            <button 
              onClick={() => setPriorityFilter("all")}
              className='text-sm text-blue-600 hover:text-blue-700 font-medium'>
                Clear filters
              </button>
           )}
           </div>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center gap-3'>
          {/* View Toggle */}
          <div className='flex bg-gray-100 rounded-lg p-1'>
            <button onClick={() => setViewMode("board")}
            className={`px-4 py-2 rounded text-sm font-medium transition ${viewMode === "board"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
            }`} >Board</button>

            <button onClick={() => setViewMode("list")}
            className={`px-4 py-2 rounded text-sm font-medium transition ${viewMode === "list"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
            }`} >List</button>
          </div>
          <button onClick={() => setIsTaskModalOpen(true)}
           className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium'>
            + Add Task
          </button>
        </div>
        </div>
        </div>
     </header>

     <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Board View */}
      {viewMode === "board"  &&  (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* To Do Column */}
          <div className='bg-gray-100 rounded-xl p-4'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-semibold text-gray-900'>
                To Do <span className='text-gray-500 text-sm ml-1'>({filteredTasks.todo.length})</span>
              </h3>
              </div>
              <button className='text-gray-600 hover:text-gray-900'>
                <span className='text-xl'> <FaPlus /> </span>
              </button>
            </div>

            {filteredTasks.todo.length === 0 ? (
              <div className='text-center py-8 text-gray-500 text-sm'>
                No tasks in To Do
              </div>
            ) : (
            <div className='space-y-3'>
              {filteredTasks.todo.map((task) => (
                <div key={task.id} onClick={() => handleTaskClick(task, "todo")}
                 className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer'>
                  <h4 className='font-medium text-gray-900 mb-2'>{task.title}</h4>
                  <div className='flex items-center justify-between'>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className='text-xs text-gray-500'>{task.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
          {/* In Progress Column */}
          <div className='bg-blue-100 rounded-xl p-4'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-semibold text-gray-900'>
                In Progress <span className='text-gray-500 text-sm ml-1'>({filteredTasks.inProgress.length})</span>
              </h3>
              <button className='text-gray-600 hover:text-gray-900'>
                <span className='text-xl'> <FaPlus /> </span>
              </button>
            </div>

           {filteredTasks.inProgress.length === 0 ? (
            <div className='text-center py-8 text-gray-500 text-sm'>
              No tasks in progress
            </div>
           ) : (
           <div className='space-y-3'>
              {filteredTasks.inProgress.map((task) => (
                <div key={task.id} onClick={() => handleTaskClick(task, "inProgress")}
                className='bg-white p-4 rounded-lg shadow-sm border border-blue-200 hover:shadow-md transition cursor-pointer'>
                  <h4 className='font-medium text-gray-900 mb-2'>{task.title}</h4>
                  <div className='flex items-center justify-between'>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className='text-xs text-gray-500'>{task.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
           )}
          </div>
          {/* Done Column */}
          <div className='bg-green-100 rounded-xl p-4'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-semibold text-gray-900'>
                Done <span className='text-gray-500 text-sm ml-1'>({filteredTasks.done.length})</span>
              </h3>
              <button className='text-gray-600 hover:text-gray-900'>
                <span className='text-xl'> <FaPlus /> </span>
              </button>
            </div>

           {filteredTasks.done.length === 0 ? (
            <div className='text-center py-8 text-gray-500 text-sm'>
              No completed tasks
            </div>
           ) : (
           <div className='space-y-3'>
              {filteredTasks.done.map((task) => (
                <div key={task.id} onClick={() => handleTaskClick(task, "done")}
                className='bg-white p-4 rounded-lg shadow-sm border border-green-200 hover:shadow-md transition cursor-pointer opacity-75'>
                  <h4 className='font-medium text-gray-900 mb-2 line-through'>{task.title}</h4>
                  <div className='flex items-center justify-between'>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className='text-xs text-gray-500'>{task.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
           )}
          </div> 
          </div> 
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          {totalTasks === 0 ? (
            <EmptyState
            icon="/jj.jpg"
            title='No tasks yet'
            description='Create your first task to start tracking your work.'
            />
          ) : (
            <>
          {/* Desktop Table Header - Hidden on Mobile*/}
          <div className='hidden md:grid grid-cols-12 gap-4 p-4 border-b border-gray-200 font-semibold text-sm text-gray-600 bg-gray-50'>
            <div className='col-span-5'>Task</div>
            <div className='col-span-2'>Status</div>
            <div className='col-span-2'>Priority</div>
            <div className='col-span-3'>Due Date</div>
          </div>

          {/* All Tasks List */}
          <div>
            {[...filteredTasks.todo, ...filteredTasks.inProgress, ...filteredTasks.done].map((task, index) => {
              let status = "";
              if (tasks.todo.find(t => t.id === task.id)) status = "To Do";
              else if (tasks.inProgress.find(t => t.id === task.id)) status = "In Progress";
              else status = "Done";

              return (
                <div key={task.id} onClick={() => handleTaskClick(task, status.toLowerCase().replace(" ", ""))} className={`p-4 hover:bg-gray-50 transition cursor-pointer ${ index ! == filteredTasks.todo.length + filteredTasks.inProgress.length + filteredTasks.done.length - 1
                  ? "border-b border-gray-200" : ""
                }`} >
                  {/* Desktop Layout */}
                  <div className='hidden md:grid grid-cols-12 gap-4 items-center'>
                  <div className='col-span-5 font-medium text-gray-900'>{task.title}</div>
                  <div className='col-span-2'>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      status === "Done" ? "bg-green-100 text-green-700" : 
                      status === "In Progress" ? "bg-blue-100 text-blue-700" : 
                      "bg-gray-100 text-gray-700"
                    }`} >
                      {status}
                    </span>
                  </div>
                  <div className='col-span-2'>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className='col-span-3 text-gray-600 text-sm'>{task.dueDate}</div>
                </div>
                {/* Mobile Layout - Stacked Vertically */}
                <div className='md:hidden space-y-3'>
                  <h4 className='font-semibold text-gray-900 text-base'>{task.title}</h4>
                  <div className='flex flex-wrap gap-2'>
                    <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium ${
                      status === "Done" ? "bg-green-100 text-green-700" : 
                      status === "In Progress" ? "bg-blue-100 text-blue-700" : 
                      "bg-gray-100 text-gray-700"
                    }`} >
                      {status}
                    </span>
                  
                    <span className={`inline-block px-3 py-1.5 rounded-full text-xs border font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  
                  <span className='inline-block px-3 py-1.5 rounded-full text-xs bg-gray-100 text-gray-700 font-medium'>  <FaRegCalendarAlt /> {task.dueDate}
                  </span>
                </div>
                </div>
                </div>
              );
            })}
          </div>
          </>
          )}
        </div>
      )}
     </main>

     {/* Task Creation Modal */}
     <TaskModal 
     isOpen={isTaskModalOpen}
     onClose={() => setIsTaskModalOpen(false)}
     projectId={projectId}
     onTaskCreated={loadProjectData} //Refresh tasks after creating
     />

     {/* Task Detail Modal */}
     <TaskDetailModal 
     isOpen={isDetailModalOpen}
     onClose={() => setIsDetailModalOpen(false)}
     task={selectedTask}
     />
    </div>
    </ProtectedRoute>
  )
}

export default Page;
