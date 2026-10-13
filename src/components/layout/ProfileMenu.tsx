import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon, SettingsIcon, UserRoundIcon } from 'lucide-react';
import { useAppState } from '../../contexts/AppStateContext';
import { Avatar } from '../ui/Avatar';

export function ProfileMenu() {
  const { profile } = useAppState();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const itemClass =
  'flex items-center gap-2 rounded-md px-2.5 py-2 text-[13px] text-ink transition-colors duration-150 hover:bg-canvas focus-visible:bg-canvas focus-visible:outline-none';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${profile.name}`}
        className="flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors duration-150 hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        
        <Avatar name={profile.name} />
        <span className="hidden text-left leading-tight md:block">
          <span className="block text-[13px] font-medium text-ink">{profile.name}</span>
          <span className="block text-[11px] text-muted">{profile.role}</span>
        </span>
        <ChevronDownIcon className="hidden h-4 w-4 text-muted md:block" aria-hidden />
      </button>
      <AnimatePresence>
        {open &&
        <motion.div
          role="menu"
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
          className="absolute right-0 z-30 mt-2 w-64 origin-top-right rounded-lg border border-line bg-white p-1 shadow-lg">
          
            <div className="border-b border-line px-2.5 py-2.5">
              <p className="text-[13px] font-semibold text-ink">{profile.name}</p>
              <p className="truncate text-[12px] text-muted">{profile.email}</p>
              <p className="mt-1 truncate text-[11px] text-muted">{profile.branch}</p>
            </div>
            <div className="pt-1">
              <Link to="/profile" role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
                <UserRoundIcon className="h-4 w-4 text-muted" aria-hidden />
                Profile
              </Link>
              <Link to="/settings" role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
                <SettingsIcon className="h-4 w-4 text-muted" aria-hidden />
                Settings
              </Link>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}