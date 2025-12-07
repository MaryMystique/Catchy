"use client"
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { IoMdArrowRoundForward } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { FaPlus, FaRegCalendarAlt } from "react-icons/fa";
import TaskModal from '@/components/TaskModal';
import TaskDetailModal from '@/components/TaskDetailModal';
import { TbFilters } from "react-icons/tb";
import Breadcrumbs from '@/components/Breadcrumbs';


const page = () => {
    const params = useParams();
    const projectId = params.id;

    const project = {
    id: projectId,
    name: "Website Redesign",
    description: "Revamp company website with modern design and improved UX",
    color: "bg-blue-500",
    dueDate: "Dec 15, 2024",
    progress: 62
  };

  // Mock tasks data organized by status
  const [tasks] = useState({
    todo: [
      { id: 1, title: "Design homepage mockup", priority: "high", dueDate: "Nov 28" },
      { id: 2, title: "Create color palette", priority: "medium", dueDate: "Nov 29" },
      { id: 3, title: "Review competitor sites", priority: "low", dueDate: "Nov 30" },
    ],
    inProgress: [
      { id: 4, title: "Build navigation component", priority: "high", dueDate: "Nov 27" },
      { id: 5, title: "Set up project structure", priority: "medium", dueDate: "Nov 28" },
    ],
    done: [
      { id: 6, title: "Project kickoff meeting", priority: "high", dueDate: "Nov 25" },
      { id: 7, title: "Gather requirements", priority: "medium", dueDate: "Nov 26" },
      { id: 8, title: "Create project timeline", priority: "low", dueDate: "Nov 26" },
    ]
  });

  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  

  // Filter tasks based on selected filters
  const filterTasks = (taskList: any[]) => {
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

  const handleTaskClick = (task: any, status: string) => {
    setSelectedTask({ ...task, status});
    setIsDetailModalOpen(true);
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "high": return "bg-red-100 text-red-700 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
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
         {/* <div className='flex items-center gap-2 text-sm text-gray-600 mb-4'>
          <Link href="/dashboard" className='hover:text-blue-600 transition'>
           <div className='inline-flex items-center gap-3'>
            <FaHome className="text-gray-800 text-2xl"/> 
            <p> Home</p>
            </div>
          </Link>
          <span> < IoMdArrowRoundForward/> </span>
          <Link href="/projects" className='hover:text-blue-600 transition'>
          Projects</Link>
          <span> < IoMdArrowRoundForward/> </span>
          <span className='text-gray-900 font-medium'>{project.name}</span>
         </div> */}
         
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
            <span className='font-medium text-gray-900'>
              {tasks.todo.length + tasks.inProgress.length + tasks.done.length}
            </span>
          </div>
         </div>
        {/* Filters */}
        <div className='flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-200'>
          <span className='text-sm font-medium text-gray-700'> <TbFilters /> </span>
          {/* Priority Filter */}
          <select
           value={priorityFilter}
           onChange={(e) => setPriorityFilter(e.target.value)}
           className='px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'>
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
           </select>
           {/* Clear Filters */}
           {(priorityFilter ! === "all") && (
            <button 
              onClick={() => {
                setPriorityFilter("all");
              }}
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
              <button className='text-gray-600 hover:text-gray-900'>
                <span className='text-xl'> <FaPlus /> </span>
              </button>
            </div>

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

           <div className='space-y-3'>
              {filteredTasks.done.map((task) => (
                <div key={task.id} onClick={() => handleTaskClick(task, "done")}
                className='bg-white p-4 rounded-lg shadow-sm border border-green-200 hover:shadow-md transition cursor-pointer'>
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
          </div>

          </div> 
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
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
                <div key={task.id} onClick={() => handleTaskClick(task, status.toLowerCase().replace(" ", ""))} className={`p-4 hover:bg-gray-50 transition cursor-pointer ${ index ! === filteredTasks.todo.length + filteredTasks.inProgress.length + filteredTasks.done.length - 1
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
                  {/* Task Title */}
                  <h4 className='font-semibold text-gray-900 text-base'>{task.title}</h4>
                  {/* Status, Priority, Date Row */}
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
        </div>
      )}
     </main>

     {/* Task Creation Modal */}
     <TaskModal 
     isOpen={isTaskModalOpen}
     onClose={() => setIsTaskModalOpen(false)}
     projectId={projectId as string}
     />

     {/* Task Detail Modal */}
     <TaskDetailModal 
     isOpen={isDetailModalOpen}
     onClose={() => setIsDetailModalOpen(false)}
     task={selectedTask}
     />
    </div>
  )
}

export default page