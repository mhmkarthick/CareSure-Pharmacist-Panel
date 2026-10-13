import React from 'react';

interface SettingsSectionProps {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function SettingsSection({ id, title, description, children, actions }: SettingsSectionProps) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className="rounded-[10px] border border-line bg-white">
      <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-3.5">
        <div>
          <h2 id={id ? `${id}-title` : undefined} className="text-[15px] font-semibold text-ink">
            {title}
          </h2>
          {description && <p className="mt-0.5 text-[12.5px] text-muted">{description}</p>}
        </div>
        {actions}
      </header>
      <div className="px-5 py-4">{children}</div>
    </section>);

}