import React from 'react';

export function PersonCell({ name, secondary }: {name: string;secondary?: string;}) {
  return (
    <div className="min-w-0">
      <p className="truncate font-medium text-ink">{name}</p>
      {secondary && <p className="truncate text-[11.5px] text-muted">{secondary}</p>}
    </div>);

}