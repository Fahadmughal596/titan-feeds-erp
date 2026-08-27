import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';

export default function Login() {
  const [email, setEmail] = useState('admin@titan.com');
  const [password, setPassword] = useState('admin123');
  const navigate = useNavigate();
  const location = useLocation();

  // ProtectedRoute records the URL the user was trying to reach, so a deep
  // link survives the login redirect instead of always landing on Inventory.
  const from = (location.state as { from?: string } | null)?.from || ROUTES.INVENTORY;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('auth', '1');
    navigate(from, { replace: true });
  };

  return (
    <div className="login">
      <form onSubmit={submit}>
        <div className="loginbrand">
          T I T A N<small>FEEDS</small>
        </div>
        <h2>Welcome Back</h2>
        <p>Sign in to continue to Titan ERP</p>

        <label>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button className="btn orange">Login</button>
      </form>
    </div>
  );
}
