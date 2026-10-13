import React, { useState } from 'react';
import { toast } from 'sonner';
import { PencilIcon, ShieldAlertIcon } from 'lucide-react';
import { useAppState } from '../contexts/AppStateContext';
import { useFormatters } from '../hooks/useFormatters';
import { PageHeader } from '../components/ui/PageHeader';
import { Avatar } from '../components/ui/Avatar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { InfoItem } from '../components/ui/InfoItem';
import { Field, inputClass } from '../components/ui/Field';
import { SettingsSection } from '../components/settings/SettingsSection';
import { ChangePasswordForm } from '../components/settings/ChangePasswordForm';
import { errorMessage } from '../utils/format';
import { cn } from '../utils/cn';
import type { PharmacistProfile } from '../types/pharmacist';

type EditableKey = 'name' | 'email' | 'phone';

function validate(p: PharmacistProfile): Partial<Record<EditableKey, string>> {
  const errors: Partial<Record<EditableKey, string>> = {};
  if (p.name.trim().length < 2) errors.name = 'Enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim())) errors.email = 'Enter a valid email address, e.g. name@caresure.example.';
  if (!/^\+?[0-9][0-9\s-]{8,15}$/.test(p.phone.trim())) errors.phone = 'Enter a valid phone number with country code.';
  return errors;
}

export function Profile() {
  const { profile, updateProfile } = useAppState();
  const fmt = useFormatters();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<PharmacistProfile>(profile);
  const [errors, setErrors] = useState<Partial<Record<EditableKey, string>>>({});
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setDraft(profile);
    setErrors({});
    setEditing(true);
  };

  const cancel = () => {
    setDraft(profile);
    setErrors({});
    setEditing(false);
  };

  const save = async () => {
    const next = validate(draft);
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error('Fix the highlighted fields to save.');
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ ...draft, name: draft.name.trim(), email: draft.email.trim(), phone: draft.phone.trim() });
      setEditing(false);
      toast.success('Profile updated');
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const field = (key: EditableKey, label: string, type = 'text') =>
  <Field label={label} htmlFor={`profile-${key}`} required error={errors[key]}>
      <input
      id={`profile-${key}`}
      type={type}
      value={draft[key]}
      onChange={(e) => {
        setDraft((d) => ({ ...d, [key]: e.target.value }));
        setErrors((er) => ({ ...er, [key]: undefined }));
      }}
      aria-invalid={Boolean(errors[key])}
      className={cn(inputClass, 'h-9')} />
    
    </Field>;


  return (
    <div>
      <PageHeader
        title="Profile"
        description="Your account details as they appear to colleagues and in order history."
        actions={
        editing ?
        <>
              <Button onClick={cancel} disabled={saving}>
                Cancel Changes
              </Button>
              <Button variant="primary" onClick={save} loading={saving}>
                Save Changes
              </Button>
            </> :

        <Button icon={PencilIcon} onClick={startEdit}>
              Edit Profile
            </Button>

        } />
      

      <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="h-fit rounded-[10px] border border-line bg-white p-5">
          <div className="flex flex-col items-center text-center">
            <Avatar name={profile.name} size="lg" />
            <p className="mt-3 text-[16px] font-semibold text-ink">{profile.name}</p>
            <p className="text-[13px] text-muted">{profile.role}</p>
            <StatusBadge status={profile.status} className="mt-2" />
          </div>
          <dl className="mt-5 space-y-3 border-t border-line pt-4">
            <InfoItem label="Employee ID">{profile.employeeId}</InfoItem>
            <InfoItem label="Branch">{profile.branch}</InfoItem>
            <InfoItem label="Shift">{profile.shift}</InfoItem>
          </dl>
        </aside>

        <div className="space-y-4">
          <SettingsSection id="personal" title="Personal Information" description="Used for sign-in notifications and colleague contact.">
            {editing ?
            <div className="grid gap-3 md:grid-cols-3">
                {field('name', 'Full name')}
                {field('email', 'Email', 'email')}
                {field('phone', 'Phone number', 'tel')}
              </div> :

            <dl className="grid gap-3 sm:grid-cols-3">
                <InfoItem label="Full name">{profile.name}</InfoItem>
                <InfoItem label="Email">{profile.email}</InfoItem>
                <InfoItem label="Phone number">{profile.phone}</InfoItem>
              </dl>
            }
          </SettingsSection>

          <SettingsSection id="professional" title="Professional Information" description="Managed by your pharmacy administrator.">
            <dl className="grid gap-3 sm:grid-cols-3">
              <InfoItem label="Employee ID">{profile.employeeId}</InfoItem>
              <InfoItem label="Assigned branch">{profile.branch}</InfoItem>
              <InfoItem label="Pharmacist registration no.">
                <span className="tabular-nums">{profile.registrationNumber}</span>
                <span className="mt-1 flex items-center gap-1 text-[11.5px] text-warning-ink">
                  <ShieldAlertIcon className="h-3.5 w-3.5" aria-hidden />
                  Sample value — not verified
                </span>
              </InfoItem>
            </dl>
          </SettingsSection>

          <SettingsSection id="account" title="Account Information">
            <dl className="grid gap-3 sm:grid-cols-3">
              <InfoItem label="Account role">{profile.role}</InfoItem>
              <InfoItem label="Account created">{fmt.date(profile.accountCreated)}</InfoItem>
              <InfoItem label="Last sign-in">{fmt.dateTime(profile.lastSignIn)}</InfoItem>
            </dl>
          </SettingsSection>

          <SettingsSection id="security" title="Security" description="Password changes are validated in this prototype but not sent to an account service.">
            <ChangePasswordForm idPrefix="profile-pw" />
          </SettingsSection>
        </div>
      </div>
    </div>);

}