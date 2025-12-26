import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features – Catchy",
  description: "Simple, focused tools designed to help you stay productive.",
};

export default function FeaturesPage() {
  return (
    <div className="min-h-dvh bg-linear-to-br from-gray-50 to-blue-50 pt-16">
      <header className="border-b bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Features</h1>
          <p className="text-gray-600 mt-1">
            Everything you need — nothing you don’t
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-14 space-y-12 text-center">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Project-based organization
          </h2>
          <p className="text-gray-700">
            Organize your work into clear projects so you always know what you’re
            working on and why it matters.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Focused task management
          </h2>
          <p className="text-gray-700">
            Break projects into manageable tasks with priorities and due dates
            that help you stay on track without pressure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Clean progress tracking
          </h2>
          <p className="text-gray-700">
            Visual progress indicators help you see how far you’ve come and stay
            motivated every day.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Calm, distraction-free interface
          </h2>
          <p className="text-gray-700">
            A thoughtfully designed interface that keeps your attention where it
            belongs — on your work.
          </p>
        </section>
      </main>
    </div>
  );
}
