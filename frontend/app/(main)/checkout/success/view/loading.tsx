export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center animate-pulse">
        <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-6"></div>
        <div className="h-8 bg-slate-200 rounded-full w-3/4 mx-auto mb-4"></div>
        <div className="h-4 bg-slate-200 rounded-full w-1/2 mx-auto mb-8"></div>
        <div className="h-12 bg-slate-200 rounded-2xl w-full"></div>
      </div>
    </div>
  )
}