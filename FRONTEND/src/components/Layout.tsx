import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import AnimatedBackground from './AnimatedBackground';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg-base)] max-w-[100vw] overflow-x-hidden">
      <AnimatedBackground />
      
      {/* Sidebar - fixed position */}
      <div className="w-64 fixed top-0 bottom-0 left-0 z-20">
        <Sidebar />
      </div>
      
      {/* Main Content Area - offset by sidebar width */}
      <div className="flex-1 flex flex-col ml-64 pl-4 min-h-screen w-[calc(100vw-16rem)]">
        <Topbar />
        <main className="flex-1 pr-4 pb-4">
          <div className="glass-panel min-h-[calc(100vh-8rem)] p-6 mb-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
