import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { FileXIcon, XIcon } from 'lucide-react';
import type { OrderType, PrescriptionDocument } from '../../types/order';
import { Panel } from '../ui/Panel';
import { Skeleton } from '../ui/Skeleton';
import { ErrorState } from '../ui/ErrorState';
import { EmptyState } from '../ui/EmptyState';
import { DocumentToolbar } from './DocumentToolbar';
import { useFormatters } from '../../hooks/useFormatters';
import { downloadFile } from '../../utils/download';
import { cn } from '../../utils/cn';

interface PrescriptionViewerProps {
  document?: PrescriptionDocument;
  orderType: OrderType;
  className?: string;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const STEP = 0.25;

export function PrescriptionViewer({ document: doc, orderType, className }: PrescriptionViewerProps) {
  const fmt = useFormatters();
  const [zoom, setZoom] = useState(1);
  const [page, setPage] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [imgState, setImgState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setPage(0);
    setZoom(1);
  }, [doc?.id]);

  useEffect(() => {
    setImgState('loading');
  }, [doc?.id, page, attempt]);

  useEffect(() => {
    if (!fullscreen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFullscreen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [fullscreen]);

  const pageCount = doc?.pages.length ?? 0;
  const src = doc ? `${doc.pages[page]}${attempt ? `?retry=${attempt}` : ''}` : '';

  const handleDownload = async () => {
    if (!doc) return;
    setDownloading(true);
    const ext = doc.pages[page].split('.').pop() ?? 'jpg';
    const base = doc.fileName.replace(/\.[^.]+$/, '');
    const ok = await downloadFile(doc.pages[page], `${base}${pageCount > 1 ? `_page${page + 1}` : ''}.${ext}`);
    setDownloading(false);
    if (ok) toast.success('Prescription downloaded', { description: `Page ${page + 1} of ${pageCount}` });else
    toast.message('Opened the original file in a new tab');
  };

  const toolbar = (withFullscreen: boolean) =>
  <DocumentToolbar
    zoom={zoom}
    minZoom={MIN_ZOOM}
    maxZoom={MAX_ZOOM}
    onZoomIn={() => setZoom((z) => Math.min(MAX_ZOOM, z + STEP))}
    onZoomOut={() => setZoom((z) => Math.max(MIN_ZOOM, z - STEP))}
    onResetZoom={() => setZoom(1)}
    page={page}
    pageCount={pageCount}
    onPrev={() => setPage((p) => Math.max(0, p - 1))}
    onNext={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
    onFullscreen={withFullscreen ? () => setFullscreen(true) : undefined}
    onDownload={handleDownload}
    downloading={downloading}
    disabled={!doc} />;



  const canvas = (large: boolean) =>
  <div className="h-full overflow-auto bg-viewer p-3">
      {imgState === 'error' ?
    <div className="flex h-full items-center justify-center rounded-md bg-white">
          <ErrorState compact title="Couldn't load document" message="The prescription image failed to load." onRetry={() => setAttempt((a) => a + 1)} />
        </div> :

    <div className="mx-auto" style={{ width: `${zoom * 100}%`, maxWidth: large ? `${zoom * 820}px` : undefined }}>
          {imgState === 'loading' && <Skeleton className="aspect-[3/4] w-full rounded-sm" />}
          <img
        src={src}
        alt={`Customer-uploaded prescription, page ${page + 1} of ${pageCount}`}
        onLoad={() => setImgState('loaded')}
        onError={() => setImgState('error')}
        draggable={false}
        className={cn('block h-auto w-full rounded-sm bg-white shadow-sm', imgState !== 'loaded' && 'invisible absolute h-0')} />
      
        </div>
    }
    </div>;


  const empty = {
    OTC: { title: 'No prescription required', message: "OTC orders don't include a prescription upload." },
    'Add Rx': { title: 'No customer upload', message: 'This Add Rx order was raised without an uploaded prescription. Review the doctor-generated prescription.' },
    'Upload Prescription': { title: 'No prescription available', message: 'The customer upload could not be found for this order.' }
  }[orderType];

  return (
    <>
      <Panel
        title="Customer-Uploaded Prescription"
        description={doc ? `${doc.fileName} · Uploaded ${fmt.dateTime(doc.uploadedAt)}` : 'Original document from the customer'}
        className={className}
        bodyClassName="flex flex-col"
        actions={
        doc &&
        <span className="rounded border border-line px-1.5 py-0.5 text-[11px] font-medium text-muted" title="OCR extraction status">
              OCR: {doc.ocrStatus}
            </span>

        }>
        
        {doc ?
        <>
            {toolbar(true)}
            <div className="relative min-h-[360px] flex-1">{canvas(false)}</div>
          </> :

        <div className="flex flex-1 items-center justify-center bg-faint">
            <EmptyState icon={FileXIcon} title={empty.title} message={empty.message} compact />
          </div>
        }
      </Panel>

      <AnimatePresence>
        {fullscreen && doc &&
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Prescription full-screen preview"
          className="fixed inset-0 z-50 flex flex-col bg-navy/95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}>
          
            <div className="flex items-center gap-3 border-b border-line bg-white px-3 py-1.5">
              <p className="hidden min-w-0 flex-1 truncate text-[13px] font-medium text-ink sm:block">{doc.fileName}</p>
              <div className="flex-1 sm:flex-none">{toolbar(false)}</div>
              <button
              ref={closeRef}
              type="button"
              onClick={() => setFullscreen(false)}
              aria-label="Close full-screen preview"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted transition-colors duration-150 hover:bg-canvas hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              
                <XIcon className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <div className="min-h-0 flex-1">{canvas(true)}</div>
          </motion.div>
        }
      </AnimatePresence>
    </>);

}