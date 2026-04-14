import LoadingScreen from '@/components/LoadingScreen'


export default function Loading() {

  return (
        <div className="min-h-screen bg-[#F8F4ED] font-sans">
          <main>  
              <LoadingScreen message="Cargando página..." />
          </main>
        </div>


  );
}