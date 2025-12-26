export default function TermsPage() {
  return (
    <div className="min-h-dvh bg-linear-to-br from-gray-50 to-blue-50 pt-16">
      <header className="border-b bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Terms of Service
          </h1>
          <p className="text-gray-600 mt-1">
            Please read these terms carefully
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-14 space-y-8 text-center">
        <p className="text-gray-700">
          By using Catchy, you agree to use the platform responsibly and only
          for lawful purposes.
        </p>

        <p className="text-gray-700">
          You are responsible for maintaining the confidentiality of your
          account and all activity that occurs under it.
        </p>

        <p className="text-gray-700">
          Catchy is provided on an “as-is” basis. While we strive for reliability,
          we cannot guarantee uninterrupted or error-free service.
        </p>

        <p className="text-gray-700">
          We may update these terms from time to time. Continued use of Catchy
          means you accept the updated terms.
        </p>
      </main>
    </div>
  );
}
