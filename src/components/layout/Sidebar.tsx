import { NavLink } from 'react-router-dom';
import { LayoutDashboard, LogOut, X } from 'lucide-react';
import BrandLogo from '../BrandLogo';
import { NAV_GROUPS, ROUTES } from '../../constants';

type Props = {
  open: boolean;
  onClose: () => void;
  onLogoutClick: () => void;
};

/**
 * Navigation rail. The link list comes from constants/navigation.ts, so this
 * component only decides how items look, not what they are.
 */
export default function Sidebar({ open, onClose, onLogoutClick }: Props) {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'navitem active' : 'navitem';

  return (
    <aside className={open ? 'sidebar open' : 'sidebar'}>
      <div className="brand">
        <BrandLogo />
        <button className="close" onClick={onClose} aria-label="Close menu">
          <X />
        </button>
      </div>

      <NavLink
        to={ROUTES.DASHBOARD}
        onClick={onClose}
        className={({ isActive }) => (isActive ? 'dash active' : 'dash')}
      >
        <LayoutDashboard />
        Dashboard
      </NavLink>

      {NAV_GROUPS.map((group) => (
        <div className="navgroup" key={group.section}>
          <div className="gtitle">{group.section}</div>
          {group.items.map(({ label, to, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={onClose} className={linkClass}>
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      ))}

      <button className="logout" onClick={onLogoutClick}>
        <LogOut />
        Logout
      </button>
    </aside>
  );
}
