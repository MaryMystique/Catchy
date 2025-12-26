export default function PrivacyPage() {
    
  return (
    <div className="min-h-dvh bg-linear-to-br from-gray-50 to-blue-50 pt-16">
      <header className="border-b bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-14 space-y-6 text-center">
        <p className="text-gray-700">
          Your privacy matters to us. Catchy only collects the information
          necessary to provide and improve the service.
        </p>

        <p className="text-gray-700">
          We do not sell your data, and we never use your information for
          advertising purposes.
        </p>

        <p className="text-gray-700">
          Any data you create in Catchy remains yours and is handled securely.
        </p>
      </main>
    </div>
  );
}
