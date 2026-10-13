import {
  LayoutDashboardIcon,
  ClipboardListIcon,
  HourglassIcon,
  CircleCheckIcon,
  CircleXIcon,
  StethoscopeIcon,
  PhoneCallIcon,
  UsersIcon,
  UserRoundIcon,
  SettingsIcon } from
'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type NavCountKey = 'pending' | 'doctor' | 'caller';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
  countKey?: NavCountKey;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
{ label: 'Overview', items: [{ label: 'Dashboard', to: '/dashboard', icon: LayoutDashboardIcon }] },
{
  label: 'Orders',
  items: [
  { label: 'All Orders', to: '/orders', icon: ClipboardListIcon, end: true },
  { label: 'Pending Approval', to: '/orders/pending-approval', icon: HourglassIcon, countKey: 'pending' },
  { label: 'Approved Orders', to: '/orders/approved', icon: CircleCheckIcon },
  { label: 'Rejected Orders', to: '/orders/rejected', icon: CircleXIcon }]

},
{
  label: 'Referrals',
  items: [
  { label: 'Doctor Referrals', to: '/referrals/doctor', icon: StethoscopeIcon, countKey: 'doctor' },
  { label: 'Caller Referrals', to: '/referrals/caller', icon: PhoneCallIcon, countKey: 'caller' }]

},
{ label: 'Management', items: [{ label: 'Customers', to: '/customers', icon: UsersIcon }] },
{
  label: 'Account',
  items: [
  { label: 'Profile', to: '/profile', icon: UserRoundIcon },
  { label: 'Settings', to: '/settings', icon: SettingsIcon }]

}];