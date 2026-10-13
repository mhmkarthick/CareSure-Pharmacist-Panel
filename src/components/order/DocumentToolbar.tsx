import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon, Maximize2Icon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { Button } from '../ui/Button';

interface DocumentToolbarProps {
  zoom: number;
  minZoom: number;
  maxZoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  page: number;
  pageCount: number;
  onPrev: () => void;
  onNext: () => void;
  onFullscreen?: () => void;
  onDownload: () => void;
  downloading: boolean;
  disabled?: boolean;
}

export function DocumentToolbar({
  zoom,
  minZoom,
  maxZoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  page,
  pageCount,
  onPrev,
  onNext,
  onFullscreen,
  onDownload,
  downloading,
  disabled = false
}: DocumentToolbarProps) {
  return (
    <div role="toolbar" aria-label="Document controls" className="flex items-center justify-between gap-1 border-b border-line bg-white px-2 py-1.5">
      <div className="flex items-center gap-0.5">
        <IconButton size="sm" label="Zoom out" icon={ZoomOutIcon} onClick={onZoomOut} disabled={disabled || zoom <= minZoom} />
        <button
          type="button"
          onClick={onResetZoom}
          disabled={disabled}
          aria-label={`Zoom ${Math.round(zoom * 100)}%. Reset to 100%`}
          className="h-7 min-w-[46px] rounded px-1 text-[12px] font-medium tabular-nums text-ink transition-colors duration-150 hover:bg-canvas disabled:opacity-40">
          
          {Math.round(zoom * 100)}%
        </button>
        <IconButton size="sm" label="Zoom in" icon={ZoomInIcon} onClick={onZoomIn} disabled={disabled || zoom >= maxZoom} />
      </div>
      {pageCount > 1 &&
      <div className="flex items-center gap-0.5">
          <IconButton size="sm" label="Previous page" icon={ChevronLeftIcon} onClick={onPrev} disabled={page <= 0} />
          <span className="px-1 text-[12px] tabular-nums text-muted" aria-live="polite">
            {page + 1} / {pageCount}
          </span>
          <IconButton size="sm" label="Next page" icon={ChevronRightIcon} onClick={onNext} disabled={page >= pageCount - 1} />
        </div>
      }
      <div className="flex items-center gap-0.5">
        {onFullscreen &&
        <IconButton size="sm" label="Open full-screen preview" icon={Maximize2Icon} onClick={onFullscreen} disabled={disabled} />
        }
        <Button size="sm" variant="ghost" icon={DownloadIcon} loading={downloading} onClick={onDownload} disabled={disabled} className="h-7 px-2">
          Download
        </Button>
      </div>
    </div>);

}