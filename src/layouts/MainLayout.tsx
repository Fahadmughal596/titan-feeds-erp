import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header, LogoutDialog, Sidebar } from '../components/layout';
import type { Profile } from '../components/layout/ProfileMenu';
import { ROUTES } from '../constants';

const readProfile = (): Profile => {
  try {
    return JSON.parse(localStorage.getItem('titan_profile') || '{}');
  } catch {
    return {};
  }
};

/**
 * The application chrome: sidebar, header, and the routed page between them.
 *
 * Previously this lived in components/Layout.tsx and held the nav data, the
 * profile dropdown and the logout dialog in one file. Those are now their own
 * components and this only wires them together.
 */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const profile = readProfile();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem('auth');
    setLogoutOpen(false);
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="app">
      <Sidebar
        open={navOpen}
        onClose={() => setNavOpen(false)}
        onLogoutClick={() => setLogoutOpen(true)}
      />

      {navOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setNavOpen(false)}
        />
      )}

      <main>
        <Header
          profile={profile}
          onMenuClick={() => setNavOpen(true)}
          onLogoutClick={() => setLogoutOpen(true)}
        />
        <div className="content">{children}</div>
        <footer>Designed By Spiraltech</footer>
      </main>

      <LogoutDialog
        open={logoutOpen}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={logout}
      />
    </div>
  );
}
