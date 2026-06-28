import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import BackToTop from '../../components/BackToTop/BackToTop.jsx';
import WelcomeModal from '../../components/WelcomeModal/WelcomeModal.jsx';
import ScrollProgress from '../../components/ScrollProgress/ScrollProgress.jsx';
import { useScrollTop } from '../../hooks/useScrollTop.js';

const AppLayout = () => {
  useScrollTop();

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <Suspense fallback={<main className="page-shell"><div className="app-loader">EarthLens</div></main>}>
        <Outlet />
      </Suspense>
      <Footer />
      <BackToTop />
      <WelcomeModal />
    </>
  );
};

export default AppLayout;
