"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {  usePathname } from 'next/navigation';
import { FaBell, FaMoon, FaSun } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { useAuth } from '@/contexts/AuthContext';
import { useDarkMode } from '@/contexts/DarkModeContext';
import NotificationsDropdown from './NotificationsDropDown';
import { getTasks, getProjects } from '@/lib/firestore';

export default function Navbar () {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { darkMode, toggleDarkMode } = useDarkMode();
    const [allTasks, setAllTasks] = useState<any[]>([]);

    const isAuthenticated = !!user;

    // Load all tasks for notifications
    useEffect(() => {
    const loadAllTasks = async () => {
      if (!user) return;

      try {
        // Get all projects
        const projects = await getProjects(user.uid);
        
        // Get tasks from all projects
        const tasksPromises = projects.map(async (project) => {
          const tasks = await getTasks(user.uid, project.id!);
          return tasks.map((task: any) => ({
            ...task,
            projectId: project.id
          }));
        });

        const allProjectTasks = await Promise.all(tasksPromises);
        const flatTasks = allProjectTasks.flat();
        
        setAllTasks(flatTasks);
      } catch (error) {
        console.error('Error loading tasks for notifications:', error);
      }
    };

    if (isAuthenticated) {
      loadAllTasks();
      // Refresh every 5 minutes
      const interval = setInterval(loadAllTasks, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user, isAuthenticated]);

  return (
    <nav className='fixed top-0 left-0 w-full backdrop-blur-lg bg-white/80 border-b border-gray-200 shadow-sm z-50'>
     <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='flex justify-between items-center h-16'>
        {/* Logo */}
        <Link href={isAuthenticated ? "/dashboard" : "/"} className='flex items-center gap-2'>
        <Image src="/dc.jpg" alt='Catchy logo' width={48} height={48}
        className='w-12 h-12 object-cover rounded-lg' />
        <span className='text-2xl font-bold text-blue-600 tracking-tight'>Catchy</span>
        </Link>

        {/* Desktop Nav */}
        {isAuthenticated ? (
        // Authenicated Navigation
        <div className='hidden md:flex items-center gap-8'>
            <NavLink href="/dashboard" isActive={pathname === '/dashboard'}>Dashboard</NavLink>  
            <NavLink href="/projects" isActive={pathname === '/projects' || pathname?.startsWith('/projects')}>Projects </NavLink> 

            {/* User Menu */}
            <div className='flex items-center gap-4'>
                {/* Dark Mode Toggle */}
             <button 
             onClick={toggleDarkMode}
              className='text-gray-600 hover:text-gray-900 transition' title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}  >
                {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
             </button>
             {/* Notifications */}
             <NotificationsDropdown tasks={allTasks} />

             <div className='flex items-center gap-3 border-l border-gray-300 pl-4'>
              <Link 
              href="/profile"
               className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold hover:ring-2 hover:ring-blue-300 transition'>
                 {user?.displayName?.charAt(0).toUpperCase() || <FaUser /> }
              </Link>
              <button 
              onClick={logout}
               className='text-sm text-gray-600 hover:text-gray-900 transition font-medium'>
                Logout
                </button>
             </div>
            </div>
          </div>
        ) : (
            // Unauthenicated Navigation
            <div className='hidden md:flex items-center gap-8'>
                <NavLink href='/login' isActive={pathname === "/login"}>
                Login
                </NavLink>
                <Link href="/signup"
                 className='bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition font-medium'>
                    Sign Up
                    </Link>
            </div>
         )}
        {/* Mobile Menu Button */}
        <button className='md:hidden text-gray-900' 
        onClick={() => setOpen(!open)} aria-label='Toggle Menu'>
            {open ? (
                <span className='text-3xl font-bold'>&#10005;</span>
            ) : (
                <span className='text-3xl'>&#9776;</span>
            )}
        </button>
         </div>
     </div>
     {/* Mobile Menu */}
     {open && (
        <div className='md:hidden px-4 pb-4 space-y-4 bg-white/95 shadow-sm border-b border-gray-200'>
            {isAuthenticated ? (
            <>
            <MobileNavLink href='/dashboard'>Dashboard</MobileNavLink>
            <MobileNavLink href='projects'>Projects</MobileNavLink>

            <div className='pt-4 border-t border-gray-200'>
                {/* Dark Mode Toggle Mobile */}
                <button
                onClick={toggleDarkMode}
                className='flex items-center gap-3 mb-4 text-gray-600 hover:text-gray-900 transition'>
                    {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
                    <span className='text-sm font-medium'>
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </span>
                </button>
            <div className='flex items-center gap-3 mb-4'>
              <Link
               href="/profile"
                className='w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold'>
              {user?.displayName?.charAt(0).toUpperCase() ||  <FaUser />}
              </Link>
              <Link 
              href="/profile" 
              className='text-gray-900 font-medium hover:text-blue-600 transition'>
             {user?.displayName || 'User Account'}
              </Link>
            </div>
            <button 
            onClick={logout}
             className='block w-full text-left text-gray-600 hover:text-gray-900 transition font-medium'>
            Logout
            </button>
            </div>
            </>
            ) : (
            <>
            <MobileNavLink href="/login">Login</MobileNavLink>
            <Link 
            href="/signup" 
            className='block bg-blue-600 text-white text-center px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition font-medium'>
                Sign Up
                </Link>
            </>
         )}
        </div>
     )}
    </nav>
  );
}

// * -------Reuseable Components ------*//

function NavLink({ href, children, isActive = false}: { href: string; children: React.ReactNode; isActive?: boolean }) {
    return (
        <Link 
        href={href} 
        className={`relative transition font-medium after:absolute after:left-0 after:bottom-[-3px] after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full ${ 
            isActive
             ?"text-blue-600 after:w-full"
              : "text-gray-500 hover:text-blue-600"
             }`}>
                 {children} </Link>
    );
}

function MobileNavLink({ href, children}: { href: string; children: React.ReactNode }) {
    return (
        <Link 
        href={href} 
        className='block text-gray-900 text-lg font-medium border-b border-gray-100 pb-2'>{children}</Link>
    );
}


