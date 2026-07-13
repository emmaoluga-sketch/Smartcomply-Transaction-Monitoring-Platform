import React from 'react';

interface Column<T> {
  header: string;
  accessor: string | ((row: T) => React.ReactNode);
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

export default function Table<T>({ columns, data, onRowClick }: TableProps<T>) {
  return (
    <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
      <table className="min-w-full bg-white">
        <thead className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
          <tr>
            {columns.map((col: Column<T>, idx: number) => (
              <th key={idx} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row: T, rowIdx: number) => (
            <tr
              key={rowIdx}
              onClick={() => onRowClick?.(row)}
              className={`${rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${
                onRowClick ? 'cursor-pointer hover:bg-indigo-50 transition-colors' : ''
              }`}
            >
              {columns.map((col: Column<T>, colIdx: number) => (
                <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {typeof col.accessor === 'function'
                    ? col.accessor(row)
                    : String((row as any)[col.accessor] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}