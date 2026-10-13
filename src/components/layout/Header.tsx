import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { MenuIcon, PanelLeftCloseIcon, PanelLeftOpenIcon, SearchIcon } from 'lucide-react';
import { useAppState } from '../../contexts/AppStateContext';
import { orderPath } from '../../utils/workflow';
import { IconButton } from '../ui/IconButton';
import { ProfileMenu } from './ProfileMenu';

interface HeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobile: () => void;
}

export function Header({ collapsed, onToggleCollapse, onOpenMobile }: HeaderProps) {
  const { orders } = useAppState();
  const navigate = useNavigate();
  const [lookup, setLookup] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = lookup.trim().toUpperCase();
    if (!q) return;
    const match = orders.find((o) => o.id === q) ?? orders.find((o) => o.id.endsWith(q));
    if (match) {
      navigate(orderPath(match));
      setLookup('');
    } else {
      toast.error(`No order found for "${lookup.trim()}"`, { description: 'Check the order ID and try again.' });
    }
  };

  return (
    <header className="flex h-[60px] shrink-0 items-center gap-2 border-b border-line bg-white px-3 md:gap-3 md:px-6">
      <IconButton label="Open navigation" icon={MenuIcon} className="lg:hidden" onClick={onOpenMobile} />
      <IconButton
        label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        icon={collapsed ? PanelLeftOpenIcon : PanelLeftCloseIcon}
        className="hidden lg:inline-flex"
        onClick={onToggleCollapse} />
      
      <form onSubmit={submit} role="search" className="hidden w-full max-w-[300px] sm:block">
        <label htmlFor="order-lookup" className="sr-only">
          Go to order by ID
        </label>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            id="order-lookup"
            value={lookup}
            onChange={(e) => setLookup(e.target.value)}
            placeholder="Go to order, e.g. 10482"
            className="h-9 w-full rounded-lg border border-line bg-canvas pl-8 pr-3 text-[13px] text-ink placeholder:text-muted focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20" />
          
        </div>
      </form>
      <div className="ml-auto flex items-center gap-3">
        <span className="hidden whitespace-nowrap text-[12px] text-muted md:inline">{format(new Date(), 'EEE, dd MMM yyyy')}</span>
        <ProfileMenu />
      </div>
    </header>);

}