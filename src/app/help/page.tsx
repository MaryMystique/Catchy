export default function HelpCenterPage() {
  return (
    <div className="min-h-dvh bg-linear-to-br from-gray-50 to-blue-50 pt-16">
      <header className="border-b bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Help Center
          </h1>
          <p className="text-gray-600 mt-1">
            Get answers and learn how to use Catchy effectively
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-14 space-y-10 text-center">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Getting Started
          </h2>
          <p className="text-gray-700">
            Create your first project, add tasks, and start tracking progress
            in just a few minutes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Managing Projects
          </h2>
          <p className="text-gray-700">
            Organize your work into projects to keep everything structured
            and easy to manage.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Tasks & Progress
          </h2>
          <p className="text-gray-700">
            Track task completion and view progress indicators to stay motivated
            and focused.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Need more help?
          </h2>
          <p className="text-gray-700">
            If you’re stuck or have questions, feel free to contact our support
            team anytime.
          </p>
        </section>
      </main>
    </div>
  );
}
