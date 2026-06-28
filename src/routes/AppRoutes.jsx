import { lazy } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AppLayout from '../layouts/AppLayout/AppLayout.jsx';

const Home = lazy(() => import('../pages/Home/Home.jsx'));
const Countries = lazy(() => import('../pages/Countries/Countries.jsx'));
const CountryDetails = lazy(() => import('../pages/CountryDetails/CountryDetails.jsx'));
const Compare = lazy(() => import('../pages/Compare/Compare.jsx'));
const Favorites = lazy(() => import('../pages/Favorites/Favorites.jsx'));
const Wishlist = lazy(() => import('../pages/Wishlist/Wishlist.jsx'));
const About = lazy(() => import('../pages/About/About.jsx'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound.jsx'));

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="explore" element={<Countries />} />
          <Route path="country/:code" element={<CountryDetails />} />
          <Route path="compare" element={<Compare />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="about" element={<About />} />
          <Route path="home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
