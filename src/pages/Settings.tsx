import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import { MonitorIcon } from 'lucide-react';
import { useAppState } from '../contexts/AppStateContext';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Toggle } from '../components/ui/Toggle';
import { Field, inputClass } from '../components/ui/Field';
import { InfoItem } from '../components/ui/InfoItem';
import { SettingsSection } from '../components/settings/SettingsSection';
import { ChangePasswordForm } from '../components/settings/ChangePasswordForm';
import { formatDate, formatMoney, formatTime, errorMessage } from '../utils/format';
import { cn } from '../utils/cn';
import { nowIso } from '../utils/datetime';
import type { CurrencyDisplay, DateFormat, Preferences, TableRows, TimeFormat, NotificationPreferences } from '../types/preferences';

const DRAFT_KEY = 'caresure-settings-draft';
const SESSION_STARTED = nowIso();
const SAMPLE_DATE = '2026-10-12T09:42:00';

const notificationRows: Array<{key: keyof NotificationPreferences;label: string;description: string;}> = [
{ key: 'orders', label: 'New orders', description: 'When an order enters the pharmacist approval queue.' },
{ key: 'approvals', label: 'Approval outcomes', description: 'Confirmation when you approve or reject an order.' },
{ key: 'doctorReferrals', label: 'Doctor referral updates', description: 'When a doctor responds to a referral you created.' },
{ key: 'callerReferrals', label: 'Caller referral updates', description: 'When the caller desk completes a clarification.' },
{ key: 'system', label: 'Important system notices', description: 'Maintenance windows and policy changes.' }];


function readDraft(fallback: Preferences): Preferences {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? { ...fallback, ...(JSON.parse(raw) as Partial<Preferences>) } : fallback;
  } catch {
    return fallback;
  }
}

export function Settings() {
  const { preferences, updatePreferences } = useAppState();
  const [draft, setDraft] = useState<Preferences>(() => readDraft(preferences));
  const [errors, setErrors] = useState<{notificationEmail?: string;sessionTimeout?: string;}>({});
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(preferences);

  useEffect(() => {
    try {
      if (dirty) sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));else
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {

      /* storage unavailable — draft simply isn't preserved */}
  }, [draft, dirty]);

  const set = <K extends keyof Preferences,>(key: K, value: Preferences[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    if (key === 'notificationEmail' || key === 'sessionTimeout') setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const discard = () => {
    setDraft(preferences);
    setErrors({});
  };

  const save = async () => {
    const next: typeof errors = {};
    if (draft.notificationEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.notificationEmail.trim())) {
      next.notificationEmail = 'Enter a valid email address or leave it blank.';
    }
    if (!Number.isFinite(draft.sessionTimeout) || draft.sessionTimeout < 5 || draft.sessionTimeout > 240) {
      next.sessionTimeout = 'Choose a value between 5 and 240 minutes.';
    }
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error('Fix the highlighted fields to save.');
      return;
    }
    setSaving(true);
    try {
      await updatePreferences({ ...draft, notificationEmail: draft.notificationEmail.trim() });
      toast.success('Settings saved');
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const selectClass = cn(inputClass, 'h-9');

  return (
    <div className="pb-4">
      <PageHeader title="Settings" description="Preferences for how the panel looks and behaves for you." />

      <div className="grid gap-4 xl:grid-cols-2">
        <SettingsSection id="account-settings" title="Account Settings" description="Profile and display preferences.">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Rows per table page" htmlFor="table-rows" hint="Applies to every list screen.">
              <select id="table-rows" value={draft.tableRows} onChange={(e) => set('tableRows', Number(e.target.value) as TableRows)} className={selectClass}>
                <option value={10}>10 rows</option>
                <option value={15}>15 rows</option>
                <option value={25}>25 rows</option>
              </select>
            </Field>
          </div>
          <div className="mt-2 divide-y divide-line">
            <Toggle
              id="start-collapsed"
              checked={draft.startCollapsed}
              onChange={(v) => set('startCollapsed', v)}
              label="Collapse sidebar by default"
              description="Gives the order workspace more room on smaller desktop screens." />
            
          </div>
        </SettingsSection>

        <SettingsSection id="app-preferences" title="Application Preferences" description="Formats used across tables, records and prescriptions.">
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Date format" htmlFor="date-format">
              <select id="date-format" value={draft.dateFormat} onChange={(e) => set('dateFormat', e.target.value as DateFormat)} className={selectClass}>
                <option value="DD MMM YYYY">12 Oct 2026</option>
                <option value="DD/MM/YYYY">12/10/2026</option>
                <option value="MM/DD/YYYY">10/12/2026</option>
                <option value="YYYY-MM-DD">2026-10-12</option>
              </select>
            </Field>
            <Field label="Time format" htmlFor="time-format">
              <select id="time-format" value={draft.timeFormat} onChange={(e) => set('timeFormat', e.target.value as TimeFormat)} className={selectClass}>
                <option value="12h">12-hour</option>
                <option value="24h">24-hour</option>
              </select>
            </Field>
            <Field label="Currency display" htmlFor="currency">
              <select id="currency" value={draft.currencyDisplay} onChange={(e) => set('currencyDisplay', e.target.value as CurrencyDisplay)} className={selectClass}>
                <option value="symbol">Symbol (₹)</option>
                <option value="code">Code (INR)</option>
              </select>
            </Field>
          </div>
          <p className="mt-3 rounded-md bg-faint px-3 py-2 text-[12.5px] text-muted">
            Preview:{' '}
            <span className="font-medium text-ink">
              {formatDate(SAMPLE_DATE, draft.dateFormat)}, {formatTime(SAMPLE_DATE, draft.timeFormat)} · {formatMoney(1240.5, draft.currencyDisplay)}
            </span>
          </p>
        </SettingsSection>

        <SettingsSection
          id="notifications"
          title="Notification Preferences"
          description="Saved to your preferences. Notification delivery isn't connected in this prototype.">
          
          <div className="divide-y divide-line">
            {notificationRows.map((row) =>
            <Toggle
              key={row.key}
              id={`notify-${row.key}`}
              checked={draft.notifications[row.key]}
              onChange={(v) => set('notifications', { ...draft.notifications, [row.key]: v })}
              label={row.label}
              description={row.description} />

            )}
          </div>
          <Field label="Email summaries to" htmlFor="notify-email" error={errors.notificationEmail} hint="Leave blank to turn off email summaries." className="mt-3">
            <input
              id="notify-email"
              type="email"
              value={draft.notificationEmail}
              onChange={(e) => set('notificationEmail', e.target.value)}
              aria-invalid={Boolean(errors.notificationEmail)}
              className={cn(inputClass, 'h-9')} />
            
          </Field>
        </SettingsSection>

        <SettingsSection id="security-settings" title="Security Settings" description="Session and password management.">
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-line bg-faint px-3 py-2.5">
            <MonitorIcon className="mt-0.5 h-4 w-4 text-muted" aria-hidden />
            <dl className="grid flex-1 gap-2 sm:grid-cols-2">
              <InfoItem label="Current session">This browser</InfoItem>
              <InfoItem label="Started">
                {formatDate(SESSION_STARTED, draft.dateFormat)}, {formatTime(SESSION_STARTED, draft.timeFormat)}
              </InfoItem>
            </dl>
          </div>
          <Field
            label="Sign out after inactivity (minutes)"
            htmlFor="session-timeout"
            error={errors.sessionTimeout}
            hint="Stored as a preference. Automatic sign-out isn't enforced in this prototype."
            className="mb-4 max-w-xs">
            
            <input
              id="session-timeout"
              type="number"
              min={5}
              max={240}
              value={Number.isFinite(draft.sessionTimeout) ? draft.sessionTimeout : ''}
              onChange={(e) => set('sessionTimeout', e.target.value === '' ? Number.NaN : Number(e.target.value))}
              aria-invalid={Boolean(errors.sessionTimeout)}
              className={cn(inputClass, 'h-9')} />
            
          </Field>
          <h3 className="mb-2 text-[13px] font-semibold text-ink">Change password</h3>
          <ChangePasswordForm idPrefix="settings-pw" />
        </SettingsSection>
      </div>

      <AnimatePresence>
        {dirty &&
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="sticky bottom-3 z-10 mt-4 flex flex-col gap-2 rounded-[10px] border border-line bg-navy px-4 py-3 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between"
          role="region"
          aria-label="Unsaved changes">
          
            <p className="text-[13px]">You have unsaved changes. They're kept if you leave this page.</p>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={discard} disabled={saving} className="text-white hover:bg-white/10 hover:text-white">
                Discard
              </Button>
              <Button size="sm" variant="primary" onClick={save} loading={saving} className="border-white/0">
                Save Changes
              </Button>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}