import { clsx } from '../../utils/cn';

/**
 * columns: [{ key, header, className, render?: (row) => node, align? }]
 */
export function Table({ columns, rows, keyField = 'id', onRowClick, empty, className = '' }) {
  if (!rows?.length) return empty ?? null;

  return (
    <div className={clsx('w-full overflow-x-auto', className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-sand-200">
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={clsx(
                  'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-500 whitespace-nowrap',
                  c.align === 'right' && 'text-right',
                  c.headerClassName
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row[keyField]}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={
                onRowClick
                  ? (e) => (e.key === 'Enter' ? onRowClick(row) : undefined)
                  : undefined
              }
              className={clsx(
                'border-b border-sand-100 last:border-0 transition-colors',
                onRowClick && 'cursor-pointer hover:bg-sand-50'
              )}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={clsx(
                    'px-4 py-3.5 text-ink-700 align-middle',
                    c.align === 'right' && 'text-right',
                    c.className
                  )}
                >
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
