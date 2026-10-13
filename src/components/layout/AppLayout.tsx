import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { useAppState } from '../../contexts/AppStateContext';
import { isOpenReferral } from '../../utils/workflow';
import { cn } from '../../utils/cn';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppLayout() {
  const { orders, referrals, preferences } = useAppState();
  const [collapsed, setCollapsed] = useState(preferences.startCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => setCollapsed(preferences.startCollapsed), [preferences.startCollapsed]);

  useEffect(() => {
    setMobileOpen(false);
    mainRef.current?.scrollTo({ top: 0 });
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const counts = useMemo(
    () => ({
      pending: orders.filter((o) => o.status === 'Pending Approval').length,
      doctor: referrals.filter((r) => r.kind === 'doctor' && isOpenReferral(r)).length,
      caller: referrals.filter((r) => r.kind === 'caller' && isOpenReferral(r)).length
    }),
    [orders, referrals]
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-canvas">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-white px-3 py-2 text-[13px] font-medium text-ink focus:not-sr-only focus:absolute focus:left-3 focus:top-3">
        
        Skip to content
      </a>
      <aside
        className={cn(
          'hidden shrink-0 transition-[width] duration-200 ease-out lg:block',
          collapsed ? 'w-[68px]' : 'w-[220px]'
        )}>
        
        <Sidebar collapsed={collapsed} counts={counts} />
      </aside>

      <AnimatePresence>
        {mobileOpen &&
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
            <motion.div
            className="absolute inset-0 bg-navy/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)} />
          
            <motion.div
            className="absolute inset-y-0 left-0 w-[260px] shadow-xl"
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}>
            
              <Sidebar collapsed={false} counts={counts} onNavigate={() => setMobileOpen(false)} />
              <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              className="absolute right-2 top-3 flex h-9 w-9 items-center justify-center rounded-md text-white/70 hover:bg-white/10 hover:text-white">
              
                <XIcon className="h-4 w-4" aria-hidden />
              </button>
            </motion.div>
          </div>
        }
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} onOpenMobile={() => setMobileOpen(true)} />
        <main id="main" ref={mainRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1680px] px-4 py-5 md:px-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>);

}