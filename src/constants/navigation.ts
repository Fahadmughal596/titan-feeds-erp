import {
  Package, Boxes, ShoppingBag, FlaskConical, FileText, ClipboardList,
  Receipt, Truck, Users, Wallet, Tag, SlidersHorizontal, BarChart3,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ROUTES } from './routes';

export type NavItem = { label: string; to: string; icon: LucideIcon };
export type NavGroup = { section: string; items: NavItem[] };

/**
 * Sidebar structure. This used to live inside Layout.tsx together with an
 * icon-picking function built on string matching; the icon is now just part
 * of the data.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    section: 'Inventory',
    items: [
      { label: 'Inventory', to: ROUTES.INVENTORY, icon: Package },
      { label: 'Raw Material', to: ROUTES.RAW_MATERIAL, icon: Boxes },
      { label: 'Products', to: ROUTES.PRODUCTS, icon: ShoppingBag },
    ],
  },
  {
    section: 'Formulations',
    items: [
      { label: 'Formulator', to: ROUTES.FORMULATOR, icon: FlaskConical },
      { label: 'Formulas', to: ROUTES.FORMULAS, icon: FileText },
      { label: 'BOM', to: ROUTES.BOM, icon: ClipboardList },
    ],
  },
  {
    section: 'General',
    items: [
      { label: 'Invoices', to: ROUTES.INVOICES, icon: Receipt },
      { label: 'Purchase Order', to: ROUTES.PURCHASE_ORDERS, icon: Truck },
      { label: 'Clients and Suppliers', to: ROUTES.CLIENTS_SUPPLIERS, icon: Users },
    ],
  },
  {
    section: 'Finance',
    items: [
      { label: 'Accounts', to: ROUTES.ACCOUNTS, icon: Wallet },
      { label: 'Expense Allocations', to: ROUTES.EXPENSE_ALLOCATIONS, icon: SlidersHorizontal },
      // "Finance & Analytics" used to appear in both General and Finance,
      // pointing at two different URLs. It lives here only now.
      { label: 'Finance & Analytics', to: ROUTES.FINANCE_ANALYTICS, icon: BarChart3 },
    ],
  },
];
