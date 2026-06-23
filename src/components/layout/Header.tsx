export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white px-4 py-4 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="pl-12 lg:pl-0">
          <p className="text-sm text-slate-500">Welcome back</p>
          <p className="font-semibold text-slate-900">Money Lending CRM</p>
        </div>
        <div className="hidden rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 sm:block">
          Admin Dashboard
        </div>
      </div>
    </header>
  );
}
