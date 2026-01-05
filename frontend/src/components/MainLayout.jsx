import { Outlet, useLocation } from 'react-router-dom';
import TopBar from './TopBar';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatBox from './ChatBox';

const MainLayout = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans">
            <TopBar />
            <Header />
            {!isHome && <Navbar />}
            <main className="flex-grow">
                <Outlet />
            </main>
            {/* Hide footer on category, profile, and messages page */}
            {location.pathname !== '/category' && location.pathname !== '/profile' && location.pathname !== '/messages' && <Footer />}
            <ChatBox />
        </div>
    );
};

export default MainLayout;
