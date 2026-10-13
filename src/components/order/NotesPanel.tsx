import React, { useId, useState } from 'react';
import { toast } from 'sonner';
import { StickyNoteIcon } from 'lucide-react';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { inputClass } from '../ui/Field';
import { useFormatters } from '../../hooks/useFormatters';
import { errorMessage } from '../../utils/format';
import { cn } from '../../utils/cn';

export interface NoteItem {
  id: string;
  at: string;
  author: string;
  role?: string;
  text: string;
}

interface NotesPanelProps {
  title?: string;
  notes: NoteItem[];
  onAdd: (text: string) => Promise<void>;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
  className?: string;
}

export function NotesPanel({ title = 'Notes', notes, onAdd, placeholder = 'Add an internal note…', inputRef, className }: NotesPanelProps) {
  const fmt = useFormatters();
  const id = useId();
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed.length < 3) {
      setError('Enter at least 3 characters.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onAdd(trimmed);
      setText('');
      toast.success('Note added');
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const ordered = [...notes].sort((a, b) => b.at.localeCompare(a.at));

  return (
    <Panel title={title} description={`${notes.length} note${notes.length === 1 ? '' : 's'}`} className={className}>
      <form onSubmit={submit} className="border-b border-line p-4">
        <label htmlFor={id} className="sr-only">
          New note
        </label>
        <textarea
          id={id}
          ref={inputRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError('');
          }}
          rows={2}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(inputClass, 'resize-y py-2')} />
        
        <div className="mt-2 flex items-center justify-between gap-2">
          {error ?
          <p id={`${id}-error`} className="text-[12px] text-danger-ink" role="alert">
              {error}
            </p> :

          <span className="text-[11.5px] text-muted">Visible to internal staff only.</span>
          }
          <Button type="submit" size="sm" variant="primary" loading={saving}>
            Add note
          </Button>
        </div>
      </form>
      {ordered.length === 0 ?
      <p className="flex items-center gap-2 px-4 py-5 text-[13px] text-muted">
          <StickyNoteIcon className="h-4 w-4" aria-hidden />
          No notes yet.
        </p> :

      <ul className="divide-y divide-line">
          {ordered.map((n) =>
        <li key={n.id} className="px-4 py-3">
              <p className="text-[11.5px] text-muted">
                <span className="font-medium text-ink">{n.author}</span>
                {n.role ? ` · ${n.role}` : ''} · <time dateTime={n.at}>{fmt.dateTime(n.at)}</time>
              </p>
              <p className="mt-1 whitespace-pre-line text-[13px] text-ink">{n.text}</p>
            </li>
        )}
        </ul>
      }
    </Panel>);

}