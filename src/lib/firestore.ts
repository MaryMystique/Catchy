import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

// PROJECT FUNCTIONS
export interface Project {
  id?: string;
  userId: string;
  name: string;
  description: string;
  color: string;
  dueDate: string;
  createdAt: any;
  updatedAt: any;
}

// Create a new project
export async function createProject(userId: string, projectData: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
  try {
    const docRef = await addDoc(collection(db, 'users', userId, 'projects'), {
      ...projectData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

// Get all projects for a user
export async function getProjects(userId: string): Promise<Project[]> {
  try {
    const projectsRef = collection(db, 'users', userId, 'projects');
    const q = query(projectsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const projects: Project[] = [];
    querySnapshot.forEach((doc) => {
      projects.push({
        id: doc.id,
        ...doc.data(),
      } as Project);
    });

    return projects;
  } catch (error) {
    console.error('Error getting projects:', error);
    throw error;
  }
}

// Get a single project
export async function getProject(userId: string, projectId: string): Promise<Project | null> {
  try {
    const docRef = doc(db, 'users', userId, 'projects', projectId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Project;
    }
    return null;
  } catch (error) {
    console.error('Error getting project:', error);
    throw error;
  }
}

// Update a project
export async function updateProject(userId: string, projectId: string, projectData: Partial<Project>) {
  try {
    const docRef = doc(db, 'users', userId, 'projects', projectId);
    await updateDoc(docRef, {
      ...projectData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

// Delete a project
export async function deleteProject(userId: string, projectId: string) {
  try {
    const docRef = doc(db, 'users', userId, 'projects', projectId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

// TASK FUNCTIONS
export interface Task {
  id?: string;
  projectId: string;
  userId: string;
  title: string;
  description: string;
  status: 'todo' | 'inProgress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: any;
  updatedAt: any;
}

// Create a new task
export async function createTask(userId: string, projectId: string, taskData: Omit<Task, 'id' | 'userId' | 'projectId' | 'createdAt' | 'updatedAt'>) {
  try {
    const docRef = await addDoc(collection(db, 'users', userId, 'projects', projectId, 'tasks'), {
      ...taskData,
      userId,
      projectId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

// Get all tasks for a project
export async function getTasks(userId: string, projectId: string): Promise<Task[]> {
  try {
    const tasksRef = collection(db, 'users', userId, 'projects', projectId, 'tasks');
    const q = query(tasksRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const tasks: Task[] = [];
    querySnapshot.forEach((doc) => {
      tasks.push({
        id: doc.id,
        ...doc.data(),
      } as Task);
    });
    return tasks;
  } catch (error) {
    console.error('Error getting tasks:', error);
    throw error;
  }
}

// Get a single task
export async function getTask(userId: string, projectId: string, taskId: string): Promise<Task | null> {
  try {
    const docRef = doc(db, 'users', userId, 'projects', projectId, 'tasks', taskId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Task;
    }
    return null;
  } catch (error) {
    console.error('Error getting task:', error);
    throw error;
  }
}

// Update a task
export async function updateTask(userId: string, projectId: string, taskId: string, taskData: Partial<Task>) {
  try {
    const docRef = doc(db, 'users', userId, 'projects', projectId, 'tasks', taskId);
    await updateDoc(docRef, {
      ...taskData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}

// Delete a task
export async function deleteTask(userId: string, projectId: string, taskId: string) {
  try {
    const docRef = doc(db, 'users', userId, 'projects', projectId, 'tasks', taskId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}