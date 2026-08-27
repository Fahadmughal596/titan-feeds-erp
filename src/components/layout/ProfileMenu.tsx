import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Settings, UserRound } from 'lucide-react';
import { ROUTES } from '../../constants';

export type Profile = { name?: string; email?: string; avatar?: string };

/** Avatar button plus its dropdown. Closes on outside click or Escape. */
export default function ProfileMenu({
  profile,
  onLogoutClick,
}: {
  profile: Profile;
  onLogoutClick: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const goToProfile = () => {
    setOpen(false);
    navigate(ROUTES.PROFILE);
  };

  const initial = (profile.name || 'A').slice(0, 1).toUpperCase();

  return (
    <div className="profile-wrap" ref={ref}>
      <button className="profile" onClick={() => setOpen((v) => !v)}>
        {profile.avatar ? <img src={profile.avatar} alt="" /> : <UserRound />}
        <b>{profile.name || 'Profile'}</b>
        <ChevronDown className={open ? 'rotate' : ''} />
      </button>

      {open && (
        <div className="profile-menu">
          <div className="profile-summary">
            {profile.avatar ? (
              <img src={profile.avatar} alt="" />
            ) : (
              <div className="avatar-fallback">{initial}</div>
            )}
            <div>
              <strong>{profile.name || 'Admin User'}</strong>
              <span>{profile.email || 'admin@titan.com'}</span>
            </div>
          </div>

          <button onClick={goToProfile}>
            <UserRound />
            My Profile
          </button>
          <button onClick={goToProfile}>
            <Settings />
            Account Settings
          </button>
          <hr />
          <button
            className="menu-logout"
            onClick={() => {
              setOpen(false);
              onLogoutClick();
            }}
          >
            <LogOut />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
