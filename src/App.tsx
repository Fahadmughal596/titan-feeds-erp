import AppRoutes from './routes/AppRoutes';

/**
 * App is just the route table now. Layout lives in layouts/MainLayout, the
 * URL map in routes/AppRoutes, and each screen's data in routes/pageConfig.
 */
export default function App() {
  return <AppRoutes />;
}
