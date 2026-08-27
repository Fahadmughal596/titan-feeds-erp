/**
 * Every URL in the app. Nothing hard-codes a path string anywhere else, so
 * renaming a route is a one-line change here.
 */
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',

  // Inventory
  INVENTORY: '/inventory',
  INVENTORY_ADD: '/inventory/add',
  INVENTORY_IMPORT: '/inventory/bulk-import',

  // Raw material
  RAW_MATERIAL: '/raw-material',
  RAW_MATERIAL_IMPORT: '/raw-material/bulk-import',

  // Products
  PRODUCTS: '/products',
  PRODUCT_ADD: '/products/add',
  BRAND_ADD: '/products/brands/add',
  VARIANT_ADD: '/products/variants/add',

  // Formulations
  FORMULATOR: '/formulator',
  FORMULAS: '/formulas',
  BOM: '/bom',

  // General
  INVOICES: '/invoices',
  INVOICE_IMPORT: '/invoices/bulk-import',
  PURCHASE_ORDERS: '/purchase-orders',
  CLIENTS_SUPPLIERS: '/clients-suppliers',
  CLIENT_ADD: '/clients-suppliers/clients/add',
  SUPPLIER_ADD: '/clients-suppliers/suppliers/add',

  // Finance
  EXPENSES: '/expenses',
  EXPENSE_CATEGORIES: '/expense-categories',
  EXPENSE_ALLOCATIONS: '/expense-allocations',
  FINANCE_ANALYTICS: '/finance-analytics',
} as const;

/**
 * Old flat URLs kept alive as redirects so any link already shared with the
 * client keeps working. Safe to delete once nothing points at them.
 */
export const LEGACY_REDIRECTS: Array<[string, string]> = [
  ['/add-client', ROUTES.CLIENT_ADD],
  ['/add-supplier', ROUTES.SUPPLIER_ADD],
  ['/add-brand', ROUTES.BRAND_ADD],
  ['/add-product', ROUTES.PRODUCT_ADD],
  ['/add-variant', ROUTES.VARIANT_ADD],
  ['/bulk/raw-material', ROUTES.RAW_MATERIAL_IMPORT],
  ['/bulk/batch', ROUTES.INVENTORY_IMPORT],
  ['/bulk/invoice', ROUTES.INVOICE_IMPORT],
  // '/finance' duplicated '/finance-analytics' — one page, one URL now.
  ['/finance', ROUTES.FINANCE_ANALYTICS],
];
