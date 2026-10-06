import { Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';

const ICON_BTN =
  'inline-flex size-7 items-center justify-center rounded-md border border-line bg-white text-ink-muted transition-colors duration-150';

export const AdminCard = ({ children, className = '' }) => (
  <div className={`rounded-xl border border-line bg-white ${className}`}>
    {children}
  </div>
);

export const FilterBar = ({ children, className = '' }) => (
  <div className={`flex flex-col items-center justify-between gap-3 border-b border-line p-4 md:flex-row ${className}`}>
    {children}
  </div>
);

export const PageHeader = ({ title, children, className = '' }) => (
  <div className={`mb-4 flex flex-wrap items-end justify-between gap-3 ${className}`}>
    <h2 className="edu-h2">{title}</h2>
    {children}
  </div>
);

export const AddButton = ({ onClick, label = 'Add New', icon = true }) => (
  <button
    onClick={onClick}
    className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand px-3.5 py-2 text-[0.8125rem] font-semibold text-white transition-colors duration-150 hover:bg-brand-dark"
  >
    {icon && <Plus size={15} />}
    {label}
  </button>
);

export const ViewBtn = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="View"
    className={`${ICON_BTN} hover:border-brand-border hover:bg-brand-softest hover:text-brand`}
  >
    <Eye size={14} />
  </button>
);

export const EditBtn = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Edit"
    className={`${ICON_BTN} hover:border-brand-border hover:bg-brand-softest hover:text-brand`}
  >
    <Edit2 size={14} />
  </button>
);

export const DeleteBtn = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Delete"
    className={`${ICON_BTN} hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive`}
  >
    <Trash2 size={14} />
  </button>
);

export const StatusBadge = ({ status }) => {
  const normalized = String(status).toLowerCase();

  const isPublishedOrActive = [
    'active',
    'published',
    'approved',
    'valid',
    'true',
  ].includes(normalized);

  if (isPublishedOrActive) {
    return (
      <span className="edu-chip">
        {String(status)}
      </span>
    );
  }

  const isNegative = ['revoked', 'rejected', 'expired', 'suspended'].includes(
    normalized
  );

  if (isNegative) {
    return (
      <span className="inline-flex items-center rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-0.5 text-[0.6875rem] font-semibold uppercase text-destructive">
        {String(status)}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[0.6875rem] font-semibold uppercase text-amber-700">
      {String(status)}
    </span>
  );
};

export const EmptyRow = ({ colSpan, message = 'No records found.' }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="py-10 text-center text-ink-muted">
      {message}
    </TableCell>
  </TableRow>
);
