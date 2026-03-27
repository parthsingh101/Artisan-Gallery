export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="font-heading text-4xl font-bold text-ink">Artisan</h2>
          <p className="text-charcoal-500 mt-2 font-body italic">
            Connecting souls with original art
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-cream-200">
          {children}
        </div>
      </div>
    </div>
  );
}
