import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Catchy",
    description: "Learn why Catchy was built and the philosophy behind simple, focused productivity.",
};

export default function AboutPage() {
    return (
        <main className="min-h-dvh bg-linear-to-br from-gray-50 to-blue-50 pt-16">
          {/* Header */}
          <header className="bg-blue-50 border-b border-white sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
                <h1 className="text-3xl font-bold text-gray-900">About Catchy</h1>
                <p className="text-gray-600 mt-1">
                    A calm, focused approach to getting things done
                </p>
            </div>
          </header>

          {/* Content */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
            {/* Intro */}
            <p className="text-lg text-gray-700 leading-relaxed">
                Catchy was created for people who want to stay productive without feeling overwhelmed. Many task management tools try to do everything at once - dashboards packed with features, endless settings, and constant distractions.
            </p>

            {/* Why Catchy */}
            <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-gray-900">
                    Why Catchy exists
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    Productivity should feel supportive, not stressful. Catchy was built to remove friction from planning your work and help you focus on what truly matters each day.
                </p>
                <p className="text-gray-700 leading-relaxed">
                    Instead of overwhelming you with complexity, Catchy gives you just enough structure to stay organized - projects to group your goals, tasks to guide your actions, and progress tracking to keep you motivated.
                </p>
            </section>

            {/* How it works */}
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                How Catchy works
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Catchy is centered around projects and tasks. Each project represents a goal or area of focus, while tasks break that goal into manageable steps.
              </p>
              <p className="text-gray-700 leading-relaxed">
                With priority levels, due dates, and visual progress indicators, you always know what needs attention and how far you've come - without digging through cluttered interfaces.
              </p>
            </section>

            {/* What makes it different */}
            <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-gray-900">
                    What makes Catchy different
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    Catchy focuses on clarity. The interface is clean, the interactions are predictable, and every feature exists for a reason.
                </p>
                <p className="text-gray-700 leading-relaxed">
                    Whether you're managing personal goals, school work, or multiple projects, Catchy adapts to your workflow without demanding constant attention.
                </p>
            </section>

            {/* Closing */}
            <section className="space-y-3">
                <h2 className="text-2xl font-semibold text-gray-900">
                    Built with intention
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    Catchy isn't about doing more - it's about doing the right things consistently. By keeping your workspace calm and your goals clear, Catchy helps you build momentum one task at a time.
                </p>
            </section>
          </div>   
        </main>
    )
}