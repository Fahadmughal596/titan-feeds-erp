import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { BULK_IMPORTS, LIST_PAGES, SIMPLE_FORMS } from './pageConfig';
import { LEGACY_REDIRECTS, ROUTES } from '../constants';
import AddInventory from '../pages/AddInventory';
import BulkImport from '../pages/BulkImport';
import ListPage from '../pages/ListPage';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import SimpleForm from '../pages/SimpleForm';

/**
 * The whole URL map of the app.
 *
 * Signed-in screens nest under <ProtectedRoute>, so the auth check and the
 * layout are declared once instead of being wrapped around every route.
 * Screens that differ only by their data come from routes/pageConfig.ts.
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to={ROUTES.INVENTORY} replace />} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path={ROUTES.INVENTORY_ADD} element={<AddInventory />} />

        {LIST_PAGES.map(({ path, ...config }) => (
          <Route key={path} path={path} element={<ListPage {...config} />} />
        ))}

        {SIMPLE_FORMS.map(({ path, ...config }) => (
          <Route key={path} path={path} element={<SimpleForm {...config} />} />
        ))}

        {BULK_IMPORTS.map(({ path, title, subtitle }) => (
          <Route key={path} path={path} element={<BulkImport title={title} subtitle={subtitle} />} />
        ))}

        {LEGACY_REDIRECTS.map(([from, to]) => (
          <Route key={from} path={from} element={<Navigate to={to} replace />} />
        ))}
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.INVENTORY} replace />} />
    </Routes>
  );
}
