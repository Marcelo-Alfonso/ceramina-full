import Header from '@/components/Header';

interface LoadingScreenProps {
  progress?: number | null;
  message?: string;
  fullScreen?: boolean;
  subtle?: boolean;
}

export default function LoadingScreen({
  progress = null,
  message = 'Preparando tus piezas...',
  fullScreen = true,
  subtle = false,
}: LoadingScreenProps) {
  
  const containerClass = fullScreen
    ? 'fixed inset-0 z-[200] flex flex-col bg-[#FDFBF7]'
    : 'relative flex flex-col py-12';

  const panelClass = subtle
    ? 'max-w-md w-full mx-auto p-6 rounded-3xl bg-white/50 backdrop-blur-sm border border-[#E6B9B3]/30'
    : 'max-w-md w-full mx-auto p-8 rounded-[2rem] shadow-xl shadow-[#756C64]/5 bg-white border border-[#E6B9B3]/20';

  return (
    <div className={containerClass} role="status" aria-live="polite">
      {fullScreen && <Header />}

      <div className={`flex-1 flex items-center justify-center px-6 ${fullScreen ? 'pt-20' : ''}`}>
        <div className={`${panelClass} animate-in fade-in zoom-in-95 duration-500`}>
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <svg
                className="animate-spin h-14 w-14 text-[#A7B39B]"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path
                  className="opacity-80"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <div className="absolute inset-0 m-auto w-2 h-2 bg-[#FFA195] rounded-full animate-pulse" />
            </div>

            <div className="w-full space-y-4">
              <div className="space-y-1">
                <p className="text-lg font-serif text-[#756C64]">{message}</p>
                {progress !== null && (
                  <p className="text-xs font-bold text-[#FFA195] tracking-widest uppercase">
                    {Math.max(0, Math.min(100, Math.round(progress)))}% Completado
                  </p>
                )}
              </div>
              <div className="relative h-1.5 w-full bg-[#E2E1D5] rounded-full overflow-hidden">
                {progress === null ? (
                  <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-[#A7B39B] via-[#FFA195] to-[#A7B39B] animate-indeterminate rounded-full" />
                ) : (
                  <div
                    className="h-full bg-[#A7B39B] transition-all duration-500 ease-out rounded-full shadow-[0_0_8px_rgba(167,179,155,0.5)]"
                    style={{ width: `${Math.max(5, Math.min(100, progress))}%` }}
                  />
                )}
              </div>

              <p className="text-[10px] text-[#756C64]/60 uppercase tracking-[0.2em]">
                Moldeando detalles con amor
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}