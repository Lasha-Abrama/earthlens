import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import i18n from 'i18next';
import { toast } from 'react-toastify';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { getCountrySlug } from '../utils/formatters';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [favorites, setFavorites] = useLocalStorage(STORAGE_KEYS.favorites, []);
  const [wishlist, setWishlist] = useLocalStorage(STORAGE_KEYS.wishlist, []);
  const [theme, setTheme] = useLocalStorage(STORAGE_KEYS.theme, 'dark');
  const [language, setLanguageState] = useLocalStorage(STORAGE_KEYS.language, 'en');
  const [searchHistory, setSearchHistory] = useLocalStorage(STORAGE_KEYS.searchHistory, []);
  const [recentViews, setRecentViews] = useLocalStorage(STORAGE_KEYS.recentViews, []);
  const [comparisonHistory, setComparisonHistory] = useLocalStorage(STORAGE_KEYS.comparisonHistory, []);
  const [preferences, setPreferences] = useLocalStorage(STORAGE_KEYS.preferences, { visited: [] });
  const [sessionStats, setSessionStats] = useSessionStorage(STORAGE_KEYS.sessionStats, {
    openedAt: new Date().toISOString(),
    viewedCountries: 0,
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleFavorite = useCallback((country) => {
    const code = getCountrySlug(country);
    const exists = favorites.some((item) => item.cca3 === code);
    toast[exists ? 'info' : 'success'](i18n.t(exists ? 'actions.favoriteRemoved' : 'actions.favoriteAdded'));
    setFavorites((current) => {
      const currentExists = current.some((item) => item.cca3 === code);
      return currentExists
        ? current.filter((item) => item.cca3 !== code)
        : [
            ...current,
            {
              cca3: code,
              cca2: country.cca2,
              name: country.name.common,
              flag: country.flags.svg,
              capital: country.capital?.[0],
              region: country.region,
              population: country.population,
            },
          ];
    });
  }, [favorites, setFavorites]);

  const toggleWishlist = useCallback((country) => {
    const code = getCountrySlug(country);
    const exists = wishlist.some((item) => item.cca3 === code);
    toast[exists ? 'info' : 'success'](i18n.t(exists ? 'actions.wishlistRemoved' : 'actions.wishlistAdded'));
    setWishlist((current) => {
      const currentExists = current.some((item) => item.cca3 === code);
      return currentExists
        ? current.filter((item) => item.cca3 !== code)
        : [
            ...current,
            {
              cca3: code,
              cca2: country.cca2,
              name: country.name.common,
              flag: country.flags.svg,
              capital: country.capital?.[0],
              region: country.region,
              population: country.population,
            },
          ];
    });
  }, [wishlist, setWishlist]);

  const rememberSearch = useCallback((term) => {
    const clean = term.trim();
    if (!clean) return;
    setSearchHistory((current) => [clean, ...current.filter((item) => item !== clean)].slice(0, 8));
  }, [setSearchHistory]);

  const addRecentView = useCallback((country) => {
    const code = getCountrySlug(country);
    setRecentViews((current) =>
      [
        {
          cca3: code,
          name: country.name.common,
          flag: country.flags.svg,
          region: country.region,
        },
        ...current.filter((item) => item.cca3 !== code),
      ].slice(0, 6),
    );
    setSessionStats((current) => ({ ...current, viewedCountries: current.viewedCountries + 1 }));
    sessionStorage.setItem(STORAGE_KEYS.lastViewed, code);
  }, [setRecentViews, setSessionStats]);

  const markVisited = useCallback((code) => {
    setPreferences((current) => {
      const visited = current.visited.includes(code)
        ? current.visited.filter((item) => item !== code)
        : [...current.visited, code];
      return { ...current, visited };
    });
  }, [setPreferences]);

  const value = useMemo(
    () => ({
      favorites,
      wishlist,
      theme,
      language,
      searchHistory,
      recentViews,
      comparisonHistory,
      preferences,
      sessionStats,
      setTheme,
      setLanguage: setLanguageState,
      setWishlist,
      setFavorites,
      setComparisonHistory,
      toggleFavorite,
      toggleWishlist,
      rememberSearch,
      addRecentView,
      markVisited,
      isFavorite: (code) => favorites.some((item) => item.cca3 === code),
      isWishlisted: (code) => wishlist.some((item) => item.cca3 === code),
    }),
    [
      favorites,
      wishlist,
      theme,
      language,
      searchHistory,
      recentViews,
      comparisonHistory,
      preferences,
      sessionStats,
      setTheme,
      setLanguageState,
      setWishlist,
      setFavorites,
      setComparisonHistory,
      toggleFavorite,
      toggleWishlist,
      rememberSearch,
      addRecentView,
      markVisited,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Context hooks are intentionally colocated with their provider for this app-level state module.
// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);
