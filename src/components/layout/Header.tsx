import { Bell, Menu } from 'lucide-react';
import ProfileMenu from './ProfileMenu';
import type { Profile } from './ProfileMenu';

export default function Header({
  profile,
  onMenuClick,
  onLogoutClick,
}: {
  profile: Profile;
  onMenuClick: () => void;
  onLogoutClick: () => void;
}) {
  return (
    <header>
      <button className="menubtn" onClick={onMenuClick} aria-label="Open menu">
        <Menu />
      </button>

      <div className="headright">
        <button className="bell" aria-label="Notifications">
          <Bell />
          <span>3</span>
        </button>
        <ProfileMenu profile={profile} onLogoutClick={onLogoutClick} />
      </div>
    </header>
  );
}
