export default function PricingPage() {
  return (
    <div className="min-h-dvh bg-linear-to-br from-gray-50 to-blue-50 pt-16">
      <header className="border-b bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Pricing</h1>
          <p className="text-gray-600 mt-1">
            Simple pricing with no surprises
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-16 space-y-6 text-center">
        <h2 className="text-4xl font-bold text-gray-900">Free</h2>
        <p className="text-gray-700">
          Catchy is currently free to use while we continue improving the
          experience.
        </p>
        <p className="text-gray-600">
          In the future, we may introduce optional premium features — but the
          core experience will always remain simple and accessible.
        </p>
      </main>
    </div>
  );
}
