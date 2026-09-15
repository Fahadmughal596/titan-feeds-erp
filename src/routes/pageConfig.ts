import { sampleRows } from '../data/config';
import { ROUTES } from '../constants';

export type ListPageConfig = {
  path: string;
  title: string;
  headers: string[];
  seed: any[][];
  keyName: string;
  addLabel?: string;
  tabs?: string[];
};

export type SimpleFormConfig = {
  path: string;
  title: string;
  subtitle: string;
  fields: string[];
  button: string;
  /** Where the form returns after saving. */
  backTo: string;
};

export type BulkImportConfig = {
  path: string;
  title: string;
  subtitle: string;
};

/**
 * Every table screen, described as data.
 *
 * These configs used to sit inline inside App.tsx, which made that one file
 * carry all the headers, seed rows and labels for the whole app. Adding a
 * screen is now an entry here plus nothing else.
 */
export const LIST_PAGES: ListPageConfig[] = [
  {
    path: ROUTES.DASHBOARD,
    title: 'Dashboard',
    headers: ['Module', 'Records', 'Status'],
    seed: [
      ['Inventory', '124', 'Active'],
      ['Products', '48', 'Active'],
      ['Invoices', '96', 'Active'],
    ],
    keyName: 'dash',
    addLabel: 'Add Widget',
  },
  {
    path: ROUTES.INVENTORY,
    title: 'Batches',
    tabs: ['Inventory', 'Batches'],
    headers: ['Date', 'Batch number', 'Batch Name', 'PO', 'Items', 'Total Amount', 'Paid', 'Unpaid', 'Status'],
    seed: sampleRows.batches,
    keyName: 'titan_batches_v4',
    addLabel: 'Add Inventory',
  },
  {
    path: ROUTES.RAW_MATERIAL,
    title: 'Raw Material',
    headers: ['Sr no.', 'Brand', 'Product', 'UOM', 'DM %', 'CP %', 'ME', 'GE', 'EE %', 'CF %', 'TDN %', 'NDF %', 'ADF %', 'Ash %', 'Ca %', 'P %'],
    seed: sampleRows.raw,
    keyName: 'titan_raw_v4',
    addLabel: 'Add Raw Material',
  },
  {
    path: ROUTES.PRODUCTS,
    title: 'Products',
    headers: ['Brand', 'Product', 'Variant', 'Item Code', 'UOM', 'Value In KG', 'Description'],
    seed: sampleRows.products,
    keyName: 'titan_products_v4',
    addLabel: 'Add Product',
  },
  {
    path: ROUTES.FORMULATOR,
    title: 'Formulator',
    headers: ['Sr no.', 'Name', 'Variant', 'Date', 'Status'],
    seed: sampleRows.formulas,
    keyName: 'titan_formulator_v2',
    addLabel: 'Add Formula',
  },
  {
    path: ROUTES.FORMULAS,
    title: 'Formula',
    headers: ['Sr no.', 'Name', 'Variant', 'Date', 'Status'],
    seed: sampleRows.formulas,
    keyName: 'titan_formulas_v2',
    addLabel: 'Add Formula',
  },
  {
    path: ROUTES.BOM,
    title: 'BOM',
    headers: ['Sr no', 'BatchNumber', 'Mfg Date', 'Exp Date', 'Total Bags', 'Total Weight'],
    seed: sampleRows.bom,
    keyName: 'bom',
    addLabel: 'Make BOM',
  },
  {
    path: ROUTES.INVOICES,
    title: 'INVOICES',
    headers: ['Invoice No', 'Date', 'Client', 'Items', 'Total Amount', 'Paid', 'Unpaid', 'Status'],
    seed: sampleRows.invoices,
    keyName: 'invoices',
    addLabel: 'Add Invoice',
  },
  {
    path: ROUTES.PURCHASE_ORDERS,
    title: 'PURCHASE ORDER',
    headers: ['PO Number', 'Date', 'Supplier', 'Total Amount', 'Paid', 'Unpaid', 'Status'],
    seed: sampleRows.purchase,
    keyName: 'purchase',
    addLabel: 'Add Purchase Order',
  },
  {
    path: ROUTES.CLIENTS_SUPPLIERS,
    title: 'Clients And Supplier',
    tabs: ['Client', 'Suppliers'],
    headers: ['Sr no.', 'Name', 'Phone Number', 'Company', 'Address', 'Paid', 'Unpaid', 'Status'],
    seed: sampleRows.clients,
    keyName: 'clients',
    addLabel: 'Add Client',
  },
  {
    path: ROUTES.EXPENSES,
    title: 'Expenses',
    headers: ['Sr no.', 'Category', 'Sub Category', 'Date', 'Description', 'Amount'],
    seed: sampleRows.expenses,
    keyName: 'expenses',
    addLabel: 'Add Expense',
  },
  {
    path: ROUTES.EXPENSE_CATEGORIES,
    title: 'Expense Category',
    tabs: ['Category', 'SubCategory'],
    headers: ['Sr no.', 'Category', 'Description'],
    seed: sampleRows.categories,
    keyName: 'cat',
    addLabel: 'Add Category',
  },
  {
    path: ROUTES.EXPENSE_ALLOCATIONS,
    title: 'Expense Allocations',
    headers: ['Sr no.', 'Category', 'SubCategory', 'Percentage', 'Status'],
    seed: [['1', 'Rent', 'Factory Rent', '20%', 'Active']],
    keyName: 'alloc',
    addLabel: 'Add Allocation',
  },
  {
    path: ROUTES.FINANCE_ANALYTICS,
    title: 'Finance & Analytics',
    headers: ['Metric', 'Current Month', 'Last Month', 'Change'],
    seed: [['Revenue', '1,200,000PKR', '980,000PKR', '+22%']],
    keyName: 'titan_finance_analytics_v4',
  },
];

/** Single-column "add" forms, one route each. */
export const SIMPLE_FORMS: SimpleFormConfig[] = [
  {
    path: ROUTES.CLIENT_ADD,
    title: 'Add Client',
    subtitle: 'Add new client details quickly',
    fields: ['Name', 'Company Name', 'Phone number', 'Email', 'Address'],
    button: 'Add Client',
    backTo: ROUTES.CLIENTS_SUPPLIERS,
  },
  {
    path: ROUTES.SUPPLIER_ADD,
    title: 'Add Supplier',
    subtitle: 'Add new supplier details quickly',
    fields: ['Name', 'Company Name', 'Phone number', 'Email', 'Address'],
    button: 'Add Supplier',
    backTo: ROUTES.CLIENTS_SUPPLIERS,
  },
  {
    path: ROUTES.BRAND_ADD,
    title: 'Add Brands',
    subtitle: 'Create and manage product brands',
    fields: ['Name', 'Description'],
    button: 'Add Brand',
    backTo: ROUTES.PRODUCTS,
  },
  {
    path: ROUTES.PRODUCT_ADD,
    title: 'Add Products',
    subtitle: 'Add new product to inventory',
    fields: ['Name', 'Brand', 'Description'],
    button: 'Add Product',
    backTo: ROUTES.PRODUCTS,
  },
  {
    path: ROUTES.VARIANT_ADD,
    title: 'Add Variant',
    subtitle: 'Define product variations and specifications',
    fields: ['Name', 'Item Code', 'Brand', 'Product', 'UOM', 'Weight In KG', 'Description'],
    button: 'Add Variant',
    backTo: ROUTES.PRODUCTS,
  },
];

/** Spreadsheet upload screens. */
export const BULK_IMPORTS: BulkImportConfig[] = [
  {
    path: ROUTES.RAW_MATERIAL_IMPORT,
    title: 'Add Raw Material',
    subtitle: 'Add raw material name and its nutrition',
  },
  { path: ROUTES.INVENTORY_IMPORT, title: 'Add Batch', subtitle: 'Add bulk batches' },
  { path: ROUTES.INVOICE_IMPORT, title: 'Add Invoice', subtitle: 'Add bulk invoices' },
];
