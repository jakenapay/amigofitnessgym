import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Pencil, Trash2, RotateCcw } from 'lucide-react';
import './AdminTable.css';

const PAGE_SIZE = 10;

export default function AdminTable({ columns, data, onEdit, onDelete, onRestore, showDeleted }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter(row =>
      columns.some(col => String(row[col.key] ?? '').toLowerCase().includes(q))
    );
  }, [data, search, columns]);

  const sorted = useMemo(() => {
    if (!sortCol) return filtered;
    return [...filtered].sort((a, b) => {
      const av = String(a[sortCol] ?? '');
      const bv = String(b[sortCol] ?? '');
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [filtered, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (key) => {
    if (sortCol === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(key); setSortDir('asc'); }
    setPage(1);
  };

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };

  return (
    <div className="at">
      <div className="at__toolbar">
        <div className="at__search-wrap">
          <Search size={13} className="at__search-icon" />
          <input
            className="at__search"
            placeholder="Search..."
            value={search}
            onChange={handleSearch}
          />
        </div>
        <span className="at__count">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="at__wrap">
        <table className="at__table">
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`at__th ${col.sortable !== false ? 'at__th--sort' : ''} ${sortCol === col.key ? 'at__th--active' : ''}`}
                  onClick={() => col.sortable !== false && toggleSort(col.key)}
                  style={{ width: col.width }}
                >
                  {col.label}
                  {col.sortable !== false && (
                    <span className="at__sort-icon">
                      {sortCol === col.key ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                    </span>
                  )}
                </th>
              ))}
              <th className="at__th at__th--actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={columns.length + 1} className="at__empty">No records found</td></tr>
            ) : paged.map((row, i) => (
              <tr key={row.id ?? i} className={row.is_deleted ? 'at__row--deleted' : ''}>
                {columns.map(col => (
                  <td key={col.key} className="at__td">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                <td className="at__td at__td--actions">
                  {row.is_deleted ? (
                    <button className="at__btn at__btn--restore" onClick={() => onRestore?.(row)} title="Restore">
                      <RotateCcw size={13} />
                    </button>
                  ) : (
                    <>
                      <button className="at__btn at__btn--edit" onClick={() => onEdit?.(row)} title="Edit">
                        <Pencil size={13} />
                      </button>
                      <button className="at__btn at__btn--del" onClick={() => onDelete?.(row)} title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="at__pagination">
          <span className="at__pag-info">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
          </span>
          <div className="at__pag-btns">
            <button className="at__pag-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft size={13} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              return (
                <button key={p} className={`at__pag-btn ${page === p ? 'at__pag-btn--active' : ''}`} onClick={() => setPage(p)}>
                  {p}
                </button>
              );
            })}
            <button className="at__pag-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
