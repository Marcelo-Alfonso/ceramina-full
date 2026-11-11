import LoadingScreen from '@/components/LoadingScreen'


export default function Loading() {

  return (
        <div className="min-h-screen bg-[#f6f3f4] font-sans">
          <main>  
              <LoadingScreen message="Cargando página..." />
          </main>
        </div>


  );
}