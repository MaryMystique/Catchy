"use client";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-dvh bg-linear-to-br from-gray-50 to-blue-50">

    <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
     {/* Hero section */}
    <div className="max-w-7xl mx-auto text-center mb-20">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Organize Your Task,
          <br/> <span className="text-blue-600">Boost Your Productivity</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Catchy helps you to manage projects, track tasks, and stay on top of your goals.
          Simple, intuitive, and designed for getting things done.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={"/signup"} className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl">
          Get Started Free
          </Link>
          <Link href={"/login"} className="bg-white text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition shadow-sm">
          Login
          </Link>
        </div>
    </div>
    {/* Featured Section */}
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
        Everything you need to stay organized
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Feature 1 */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5 overflow-hidden">
            <Image src="/1a.jpg" alt="Project Oraganization" width={32} height={32} className="object-contain" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Project Organization</h3>
          <p className="text-gray-600 leading-relaxed">
            Create projects, break them into tasks, and track everything in one organized place.
          </p>
        </div>
        {/* Feature 2 */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5 overflow-hidden">
             <Image src="/2b.jpg" alt="Multiple Views" width={32} height={32} className="object-contain" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Multiple Views</h3>
          <p className="text-gray-600 leading-relaxed">
           Switch between List and Kanban board views to visualize your workflow your way.
          </p>
        </div>
        {/* Feature 3 */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5 overflow-hidden">
            <Image src="/3.jpg" alt="Track Progress" width={32} height={32} className="object-contain" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Track Progress</h3>
          <p className="text-gray-600 leading-relaxed">
            Monitor your productivity with visual progess indicators and detailed statistics.
          </p>
        </div>
        {/* Feature 4 */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5 overflow-hidden">
            <Image src="/4b.jpg" alt="Priority Management" width={32} height={32} className="object-contain" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Priority Management</h3>
          <p className="text-gray-600 leading-relaxed">
            Set priorities and due dates to focus on what matters most and never miss deadlines.
          </p>
        </div>
        {/* Feature 5 */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5 overflow-hidden">
             <Image src="/5a.jpg" alt="Drag & Drop" width={32} height={32} className="object-contain" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Drag & Drop</h3>
          <p className="text-gray-600 leading-relaxed">
            Easily reorganize tasks with intuitive drag-and-drop across different columns.
          </p>
        </div>
        {/* Feature 6 */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5 overflow-hidden">
            <Image src="/6a.jpg" alt="Fully Responsive" width={32} height={32} className="object-contain" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Fully Responsive</h3>
          <p className="text-gray-600 leading-relaxed">
            Access your tasks anywhere - desktop, tablet, or mobile. Your data syncs seamlessly.
          </p>
        </div>

      </div>
    </div>
    </main>
    </div>
  );
}
