"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { IoMdArrowRoundForward } from "react-icons/io";
import { FaHome, FaPlus, FaRegCalendarAlt, FaEdit, FaTrash, FaCalendar, FaTh } from "react-icons/fa";
import { BiEditAlt } from "react-icons/bi";
import { TbFilters } from "react-icons/tb";
import TaskModal from '@/components/TaskModal';
import TaskDetailModal from '@/components/TaskDetailModal';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProtectedRoute from '@/components/ProtectedRoute';
import TaskColumn from '@/components/TaskColumn';
import CalendarView from '@/components/CalendarView';
import { useAuth } from '@/contexts/AuthContext';
import { getProject, getTasks, updateProject, deleteProject, updateTask } from '@/lib/firestore';
import EmptyState from '@/components/EmptyState';
import toast from 'react-hot-toast';

interface FirestoreTask {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  status: 'todo' | 'inProgress' | 'done';
}

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  dueDate: string;
}

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<{
    todo: FirestoreTask[];
    inProgress: FirestoreTask[];
    done: FirestoreTask[]
  }>({
    todo: [],
    inProgress: [],
    done: []
  });

  const [viewMode, setViewMode] = useState<"board" | "list" | "calendar">("board");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<FirestoreTask | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Edit project modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    color: "",
    dueDate: ""
  });

  //Delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load project and tasks
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
      setProject(projectData as Project);
      setEditFormData({
        name: projectData.name,
        description: projectData.description,
        color: projectData.color,
        dueDate: projectData.dueDate
      });

      // Load tasks
      const tasksData = await getTasks(user.uid, projectId);
     
      // Organize tasks by status
      const organizedTasks = {
        todo: tasksData.filter((task: any) => task.status === 'todo') as FirestoreTask[],
        inProgress: tasksData.filter((task: any) => task.status === 'inProgress') as FirestoreTask[],
        done: tasksData.filter((task: any) => task.status === 'done') as FirestoreTask[]
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
  }, [user, projectId]);

  //Handle edit project
  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateProject(user.uid, projectId, editFormData);
      toast.success("Project updated successfully!");
      setIsEditModalOpen(false);
      loadProjectData();
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    }
  };

  // Handle delete project
  const handleDeleteProject = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      await deleteProject(user.uid, projectId);
      toast.success("Project deleted successfully!");
      router.push('/projects');
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
      setIsDeleting(false);
    }
  };

  // Handle task drop (drag and drop)
  const handleTaskDrop = async (taskId: string, newStatus: 'todo' | 'inProgress' | 'done') => {
    if (!user) return;

    try {
      await updateTask(user.uid, projectId, taskId, { status: newStatus });
      toast.success("Task moved successfully!");
      loadProjectData();
    } catch (error) {
      console.error("Error moving task:", error);
      toast.error("Failed to move task");
    }
  };

  // Handle mark task as complete
  const handleToggleTaskComplete = async (task: FirestoreTask) => {
    if (!user) return;

    const newStatus = task.status === 'done' ? 'todo' : 'done';

    try {
      await updateTask(user.uid, projectId, task.id, { status: newStatus });
      toast.success(newStatus === 'done' ? "Task marked as complete!" : "Task marked as incomplete!");
      loadProjectData();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };
  
  // Filter tasks based on selected filters
  const filterTasks = (taskList: FirestoreTask[]) => {
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

  const handleTaskClick = (task: FirestoreTask) => {
    setSelectedTask(task);
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

  // Get task status helper
  const getTaskStatus = (taskId: string): string => {
    if (tasks.todo.find(t => t.id === taskId)) return "todo";
    if (tasks.inProgress.find(t => t.id === taskId)) return "inProgress";
    return "done";
  };

  const getStatusDisplay = (status: string): string => {
    switch(status) {
      case "todo": return "To Do";
      case "inProgress": return "In Progress";
      case "done": return "Done";
      default: return status;
    }
  };

  // Calculate progress
  const totalTasks = tasks.todo.length + tasks.inProgress.length + tasks.done.length;
  const progress = totalTasks > 0 ? Math.round((tasks.done.length / totalTasks) * 100) : 0;

  // Get all task for calendar
  const allTasks = [...filteredTasks.todo, ...filteredTasks.inProgress, ...filteredTasks.done].map(task => ({
    ...task,
    projectId
  }));

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
    );
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
                  <button
                  onClick={() => setIsEditModalOpen(true)}
                  className='text-gray-500 hover:text-blue-600 transition'
                  title='Edit project'>
                    <BiEditAlt size={26} />
                  </button>
                  <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className='text-gray-500 hover:text-red-600 transition'
                  title='Delete project'>
                    <FaTrash size={16} />
                  </button>
                </div>
                <p className='text-gray-600 mb-4'>{project.description}</p>

                {/* Project Stats */}
                <div className='flex flex-wrap items-center gap-6 text-sm'>
                  <div>
                    <span className='text-gray-600'>Due Date: </span>
                    <span className='font-medium text-gray-900'>{project.dueDate}</span>
                  </div>
                  <div>
                    <span className='text-gray-600'>Progress: </span>
                    <span className='font-medium text-gray-900'>{progress}%</span>
                  </div>
                  <div>
                    <span className='text-gray-600'>Tasks: </span>
                    <span className='font-medium text-gray-900'>{totalTasks}</span>
                  </div>
                </div>

                {/* Filters */}
                <div className='flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-200'>
                  <div className='flex items-center gap-2'>
                    <TbFilters className='text-gray-700' />
                  </div>
                  
                  {/* Priority Filter */}
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className='px-3 py-1.5 text-sm border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>

                  {/* Clear Filters */}
                  {priorityFilter !== "all" && (
                    <button 
                      onClick={() => setPriorityFilter("all")}
                      className='text-sm text-blue-600 hover:text-blue-700 font-medium'
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex items-center gap-3'>
                {/* View Toggle */}
                <div className='flex bg-gray-100 rounded-lg p-1'>
                  <button 
                    onClick={() => setViewMode("board")}
                    className={`px-3 py-2 rounded text-sm font-medium transition flex items-center gap-2 ${
                      viewMode === "board"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                   <FaTh /> Board
                  </button>
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-2 rounded text-sm font-medium transition ${
                      viewMode === "list"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    List
                  </button>
                </div>
                <button 
                  onClick={() => setIsTaskModalOpen(true)}
                  className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium'
                >
                  + Add Task
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* Board View with Drag & Drop */}
          {viewMode === "board" && (
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
               <TaskColumn
                title="To Do"
                status="todo"
                tasks={filteredTasks.todo}
                bgColor="bg-gray-100"
                borderColor="border-gray-200"
                onAddTask={() => setIsTaskModalOpen(true)}
                onTaskClick={handleTaskClick}
                onTaskDrop={handleTaskDrop}
                onToggleComplete={handleToggleTaskComplete}
              />
              <TaskColumn
                title="In Progress"
                status="inProgress"
                tasks={filteredTasks.inProgress}
                bgColor="bg-blue-100"
                borderColor="border-blue-200"
                onAddTask={() => setIsTaskModalOpen(true)}
                onTaskClick={handleTaskClick}
                onTaskDrop={handleTaskDrop}
                onToggleComplete={handleToggleTaskComplete}
              />
              <TaskColumn
                title="Done"
                status="done"
                tasks={filteredTasks.done}
                bgColor="bg-green-100"
                borderColor="border-green-200"
                onAddTask={() => setIsTaskModalOpen(true)}
                onTaskClick={handleTaskClick}
                onTaskDrop={handleTaskDrop}
                onToggleComplete={handleToggleTaskComplete}
              />
            </div>
          )}

          {/* Calendar View */}
          {viewMode === "calendar" && (
            <CalendarView 
              tasks={allTasks}
              onTaskClick={handleTaskClick}
            />
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
                  {/* Desktop Table Header */}
                  <div className='hidden md:grid grid-cols-12 gap-4 p-4 border-b border-gray-200 font-semibold text-sm text-gray-600 bg-gray-50'>
                    <div className='col-span-1'></div>
                    <div className='col-span-4'>Task</div>
                    <div className='col-span-2'>Status</div>
                    <div className='col-span-2'>Priority</div>
                    <div className='col-span-3'>Due Date</div>
                  </div>

                  {/* All Tasks List */}
                  <div>
                    {[...filteredTasks.todo, ...filteredTasks.inProgress, ...filteredTasks.done].map((task, index, array) => {
                      const status = getTaskStatus(task.id);
                      const statusDisplay = getStatusDisplay(status);

                      return (
                        <div 
                          key={task.id}  
                          className={`p-4 hover:bg-gray-50 transition  ${
                            index !== array.length - 1 ? "border-b border-gray-200" : ""
                          }`}
                        >
                          {/* Desktop Layout */}
                          <div className='hidden md:grid grid-cols-12 gap-4 items-center'>
                            <div className='col-span-1'>
                              <input
                                type='checkbox'
                                checked={status === 'done'}
                                onChange={() => handleToggleTaskComplete(task)}
                                className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer'
                              />
                            </div>
                            <div
                              className='col-span-4 font-medium text-gray-900 cursor-pointer'
                              onClick={() => handleTaskClick(task)}
                            >
                              {task.title}
                            </div>
                            <div className='col-span-2'>
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                status === "done" ? "bg-green-100 text-green-700" :
                                status === "inProgress" ? "bg-blue-100 text-blue-700" :
                                "bg-gray-100 text-gray-700"
                              }`}>
                                {statusDisplay}
                              </span>
                            </div>
                            <div className='col-span-2'>
                              <span className={`inline-block px-3 py-1 rounded-full text-xs border ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>
                            <div className='col-span-3 text-gray-600 text-sm'>{task.dueDate}</div>
                          </div>

                          {/* Mobile Layout */}
                          <div className='md:hidden space-y-3'>
                           <div className='flex items-start gap-3'>
                              <input
                                type='checkbox'
                                checked={status === 'done'}
                                onChange={() => handleToggleTaskComplete(task)}
                                className='mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer'
                              />
                              <h4
                                className='font-semibold text-gray-900 text-base cursor-pointer flex-1'
                                onClick={() => handleTaskClick(task)}
                              >
                                {task.title}
                              </h4>
                            </div>
                            <div className='flex flex-wrap gap-2 ml-7'>
                              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                                status === "done" ? "bg-green-100 text-green-700" :
                                status === "inProgress" ? "bg-blue-100 text-blue-700" :
                                "bg-gray-100 text-gray-700"
                              }`}>

                                {statusDisplay}
                              </span>
                              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs border font-medium ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                              <span className='inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-gray-100 text-gray-700 font-medium'>
                                <FaRegCalendarAlt />
                                {task.dueDate}
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
          onTaskCreated={loadProjectData}
        />

        {/* Task Detail Modal */}
        <TaskDetailModal 
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedTask(null);
            loadProjectData(); // Refresh data when modal closes
          }}
          task={selectedTask}
          projectId={projectId}
        />

        {/* Edit Project Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Project</h2>
              <form onSubmit={handleEditProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={editFormData.dueDate}
                    onChange={(e) => setEditFormData({...editFormData, dueDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FaTrash className="text-red-600" size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Delete Project</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{project.name}"? This will permanently delete the project and all its tasks. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProject}
                  disabled={isDeleting}
                  className={`flex-1 px-4 py-3 bg-red-600 text-white rounded-lg transition ${
                    isDeleting ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
                  }`}
                >
                  {isDeleting ? "Deleting..." : "Delete Project"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Page;