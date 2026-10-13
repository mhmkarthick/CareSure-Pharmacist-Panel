import React from 'react';
import { NavLink } from 'react-router-dom';
import { navSections, type NavCountKey } from '../../data/navigation';
import { cn } from '../../utils/cn';
import { LogoMark } from './LogoMark';

interface SidebarProps {
  collapsed: boolean;
  counts: Record<NavCountKey, number>;
  onNavigate?: () => void;
}

export function Sidebar({ collapsed, counts, onNavigate }: SidebarProps) {
  return (
    <div className="flex h-full flex-col bg-navy text-white">
      <div className={cn('flex h-[60px] shrink-0 items-center gap-2.5 border-b border-white/10', collapsed ? 'justify-center px-2' : 'px-5')}>
        <LogoMark />
        {!collapsed &&
        <div className="leading-tight">
            <p className="text-[15px] font-semibold tracking-tight">CareSure</p>
            <p className="text-[11px] text-white/60">Pharmacist Panel</p>
          </div>
        }
      </div>
      <nav aria-label="Main navigation" className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {navSections.map((section) =>
        <div key={section.label}>
            {collapsed ?
          <div className="mx-2 mb-2 h-px bg-white/10" aria-hidden /> :

          <p className="mb-1.5 px-2.5 text-[11px] font-medium text-white/55">{section.label}</p>
          }
            <ul className="space-y-0.5">
              {section.items.map((item) => {
              const count = item.countKey ? counts[item.countKey] : 0;
              const Icon = item.icon;
              return (
                <li key={item.to}>
                    <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={onNavigate}
                    title={collapsed ? item.label : undefined}
                    aria-label={collapsed ? `${item.label}${count ? ` (${count})` : ''}` : undefined}
                    className={({ isActive }) =>
                    cn(
                      'relative flex h-9 items-center gap-2.5 rounded-md text-[13px] font-medium transition-colors duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-bright',
                      collapsed ? 'justify-center' : 'px-2.5',
                      isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
                    )
                    }>
                    
                      {({ isActive }) =>
                    <>
                          {isActive &&
                      <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r bg-primary-bright" aria-hidden />
                      }
                          <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
                          {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                          {!collapsed && count > 0 &&
                      <span className="rounded bg-white/10 px-1.5 text-[11px] tabular-nums text-white/90">{count}</span>
                      }
                          {collapsed && count > 0 &&
                      <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary-bright" aria-hidden />
                      }
                        </>
                    }
                    </NavLink>
                  </li>);

            })}
            </ul>
          </div>
        )}
      </nav>
      {!collapsed &&
      <p className="shrink-0 border-t border-white/10 px-5 py-3 text-[11px] leading-snug text-white/55">
          Prototype data. Changes are kept in this session only.
        </p>
      }
    </div>);

}