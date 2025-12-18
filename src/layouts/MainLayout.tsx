import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
