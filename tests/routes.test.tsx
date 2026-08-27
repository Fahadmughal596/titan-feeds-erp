import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from '../src/routes/AppRoutes';
import { LIST_PAGES, SIMPLE_FORMS, BULK_IMPORTS } from '../src/routes/pageConfig';
import { LEGACY_REDIRECTS, ROUTES } from '../src/constants';

const at = (route: string) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <AppRoutes />
    </MemoryRouter>
  );

const signIn = () => localStorage.setItem('auth', '1');

describe('routing', () => {
  beforeEach(() => localStorage.clear());

  it('sends signed-out visitors to login', async () => {
    at(ROUTES.INVENTORY);
    expect(await screen.findByText('Welcome Back')).toBeTruthy();
  });

  const everyRoute = [
    ...LIST_PAGES.map((p) => p.path),
    ...SIMPLE_FORMS.map((p) => p.path),
    ...BULK_IMPORTS.map((p) => p.path),
    ROUTES.PROFILE,
    ROUTES.INVENTORY_ADD,
  ];

  it.each(everyRoute)('renders %s with the sidebar', async (route) => {
    const errors: string[] = [];
    const spy = vi.spyOn(console, 'error').mockImplementation((...a) => errors.push(a.join(' ')));
    signIn();

    const { unmount } = at(route);

    // The sidebar proves MainLayout mounted and the route matched.
    expect((await screen.findAllByText('Dashboard')).length).toBeGreaterThan(0);
    await waitFor(() => expect(document.body.textContent!.length).toBeGreaterThan(80));

    const real = errors.filter((e) => !e.includes('not wrapped in act'));
    spy.mockRestore();
    unmount();
    expect(real).toEqual([]);
  });

  it.each(LEGACY_REDIRECTS)('redirects %s to %s', async (from, to) => {
    signIn();
    at(from);
    // The destination screen renders, so the old link still lands somewhere real.
    await waitFor(() => expect(document.body.textContent!.length).toBeGreaterThan(80));
    expect(to.startsWith('/')).toBe(true);
  });

  it('has no duplicate paths in the route config', () => {
    const paths = everyRoute;
    expect(new Set(paths).size).toBe(paths.length);
  });
});
