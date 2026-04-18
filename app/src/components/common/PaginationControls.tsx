interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({ page, totalPages, onPageChange }: PaginationControlsProps) {
  const canGoBack = page > 1;
  const canGoForward = page < totalPages;

  return (
    <div className="mt-4 flex items-center justify-end gap-3 text-sm">
      <button
        type="button"
        className="rounded-md border border-slate-300 px-3 py-1.5 text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!canGoBack}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <span className="text-slate-600">Page {page} of {Math.max(totalPages, 1)}</span>
      <button
        type="button"
        className="rounded-md border border-slate-300 px-3 py-1.5 text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!canGoForward}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
