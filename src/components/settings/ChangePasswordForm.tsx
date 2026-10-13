import React, { useState } from 'react';
import { toast } from 'sonner';
import { CheckIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Field, inputClass } from '../ui/Field';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

type FieldKey = 'current' | 'next' | 'confirm';

export function ChangePasswordForm({ idPrefix }: {idPrefix: string;}) {
  const [values, setValues] = useState<Record<FieldKey, string>>({ current: '', next: '', confirm: '' });
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);

  const rules = [
  { label: 'At least 8 characters', ok: values.next.length >= 8 },
  { label: 'Contains a letter and a number', ok: /[a-zA-Z]/.test(values.next) && /\d/.test(values.next) },
  { label: 'Different from current password', ok: Boolean(values.next) && values.next !== values.current }];


  const set = (key: FieldKey, v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!values.current) next.current = 'Enter your current password.';
    if (!rules.every((r) => r.ok)) next.next = 'New password does not meet the requirements below.';
    if (values.confirm !== values.next || !values.confirm) next.confirm = 'Passwords do not match.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    setValues({ current: '', next: '', confirm: '' });
    toast.success('Password change validated', { description: 'Prototype only — no account credentials were changed.' });
  };

  const inputType = show ? 'text' : 'password';

  return (
    <form onSubmit={submit} noValidate className="grid gap-3 md:grid-cols-3">
      {(
      [
      ['current', 'Current password', 'current-password'],
      ['next', 'New password', 'new-password'],
      ['confirm', 'Confirm new password', 'new-password']] as
      Array<[FieldKey, string, string]>).
      map(([key, label, autoComplete]) =>
      <Field key={key} label={label} htmlFor={`${idPrefix}-${key}`} required error={errors[key]}>
          <input
          id={`${idPrefix}-${key}`}
          type={inputType}
          autoComplete={autoComplete}
          value={values[key]}
          onChange={(e) => set(key, e.target.value)}
          aria-invalid={Boolean(errors[key])}
          className={cn(inputClass, 'h-9')} />
        
        </Field>
      )}
      <ul className="flex flex-wrap gap-x-4 gap-y-1 md:col-span-3" aria-label="Password requirements">
        {rules.map((r) =>
        <li key={r.label} className={cn('flex items-center gap-1 text-[12px]', r.ok ? 'text-success-ink' : 'text-muted')}>
            <CheckIcon className={cn('h-3.5 w-3.5', !r.ok && 'opacity-40')} aria-hidden />
            {r.label}
            <span className="sr-only">{r.ok ? '(met)' : '(not met)'}</span>
          </li>
        )}
      </ul>
      <div className="flex items-center justify-between gap-2 md:col-span-3">
        <Button size="sm" variant="ghost" icon={show ? EyeOffIcon : EyeIcon} onClick={() => setShow((s) => !s)} aria-pressed={show}>
          {show ? 'Hide passwords' : 'Show passwords'}
        </Button>
        <Button type="submit" variant="primary" loading={saving}>
          Update password
        </Button>
      </div>
    </form>);

}