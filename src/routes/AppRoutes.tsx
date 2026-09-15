import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { BULK_IMPORTS, LIST_PAGES, SIMPLE_FORMS } from './pageConfig';
import { LEGACY_REDIRECTS, ROUTES } from '../constants';
import AddStock from '../pages/AddStock';
import AddBatch from '../pages/AddBatch';
import BulkImport from '../pages/BulkImport';
import ListPage from '../pages/ListPage';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import SimpleForm from '../pages/SimpleForm';
import ProductsPage from '../pages/ProductsPage';
import ProductDetails from '../pages/ProductDetails';
import AddProduct from '../pages/AddProduct';
import AddBrand from '../pages/AddBrand';
import AddVariant from '../pages/AddVariant';
import BOMPage from '../pages/BOMPage';
import MakeBOM from '../pages/MakeBOM';
import FormulasPage from '../pages/FormulasPage';
import FormulaHistory from '../pages/FormulaHistory';
import AddFormula from '../pages/AddFormula';
import FormulaDetail from '../pages/FormulaDetail';
import InvoicesPage from '../pages/InvoicesPage';
import AddInvoice from '../pages/AddInvoice';
import PurchaseOrdersPage from '../pages/PurchaseOrdersPage';
import ClientsSuppliersPage from '../pages/ClientsSuppliersPage';
import PartnerForm from '../pages/PartnerForm';
import ExpensesPage from '../pages/ExpensesPage';
import AddExpense from '../pages/AddExpense';
import ExpenseCategoriesPage from '../pages/ExpenseCategoriesPage';
import InventoryDashboard from '../pages/InventoryDashboard';
import BatchesPage from '../pages/BatchesPage';
import DashboardPage from '../pages/DashboardPage';
import ExpenseAllocationsPage from '../pages/ExpenseAllocationsPage';
import FinanceAnalyticsPage from '../pages/FinanceAnalyticsPage';

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
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path={ROUTES.INVENTORY_ADD} element={<AddStock />} />
        <Route path={ROUTES.INVENTORY_BATCHES} element={<BatchesPage />} />
        <Route path={ROUTES.INVENTORY_BATCH_ADD} element={<AddBatch />} />
        <Route path={ROUTES.PRODUCT_DETAILS} element={<ProductDetails />} />
        <Route path={ROUTES.PRODUCT_ADD} element={<AddProduct />} />
        <Route path={ROUTES.BRAND_ADD} element={<AddBrand />} />
        <Route path={ROUTES.VARIANT_ADD} element={<AddVariant />} />
        <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
        <Route path={ROUTES.BOM_MAKE} element={<MakeBOM />} />
        <Route path={ROUTES.BOM} element={<BOMPage />} />
        <Route path={ROUTES.FORMULA_ADD} element={<AddFormula />} />
        <Route path={ROUTES.FORMULA_DETAIL} element={<FormulaDetail />} />
        <Route path={ROUTES.FORMULAS} element={<FormulasPage />} />
        <Route path={ROUTES.FORMULATOR} element={<FormulaHistory />} />
        <Route path={ROUTES.INVOICES} element={<InvoicesPage />} />
        <Route path={ROUTES.INVOICE_ADD} element={<AddInvoice />} />
        <Route path={ROUTES.PURCHASE_ORDERS} element={<PurchaseOrdersPage />} />
        <Route path={ROUTES.CLIENTS_SUPPLIERS} element={<ClientsSuppliersPage />} />
        <Route path={ROUTES.CLIENT_ADD} element={<PartnerForm kind="client" />} />
        <Route path={ROUTES.SUPPLIER_ADD} element={<PartnerForm kind="supplier" />} />
        <Route path={ROUTES.EXPENSES} element={<ExpensesPage />} />
        <Route path={ROUTES.EXPENSE_ADD} element={<AddExpense />} />
        <Route path={ROUTES.EXPENSE_CATEGORIES} element={<ExpenseCategoriesPage />} />
        <Route path={ROUTES.EXPENSE_ALLOCATIONS} element={<ExpenseAllocationsPage />} />
        <Route path={ROUTES.FINANCE_ANALYTICS} element={<FinanceAnalyticsPage />} />
        <Route path={ROUTES.INVENTORY} element={<InventoryDashboard />} />

        {LIST_PAGES.filter(({ path }) => ![ROUTES.DASHBOARD, ROUTES.INVENTORY, ROUTES.PRODUCTS, ROUTES.BOM, ROUTES.FORMULAS, ROUTES.FORMULATOR, ROUTES.INVOICES, ROUTES.PURCHASE_ORDERS, ROUTES.CLIENTS_SUPPLIERS, ROUTES.EXPENSES, ROUTES.EXPENSE_CATEGORIES, ROUTES.EXPENSE_ALLOCATIONS, ROUTES.FINANCE_ANALYTICS].includes(path as any)).map(({ path, ...config }) => (
          <Route key={path} path={path} element={<ListPage {...config} />} />
        ))}

        {SIMPLE_FORMS.filter(({ path }) => ![ROUTES.PRODUCT_ADD, ROUTES.BRAND_ADD, ROUTES.VARIANT_ADD, ROUTES.CLIENT_ADD, ROUTES.SUPPLIER_ADD].includes(path as any)).map(({ path, ...config }) => (
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
