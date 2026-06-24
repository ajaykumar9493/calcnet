interface DataTableProps {
  columns: string[];
  rows: Array<Record<string, string | number>>;
  caption?: string;
}

export function DataTable({ columns, rows, caption }: DataTableProps) {
  if (!rows.length) return null;
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            {columns.map((col) => (
              <th key={col} scope="col" className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800">
              {columns.map((col) => (
                <td key={col} className="px-3 py-2 text-zinc-900 dark:text-zinc-100">
                  {row[col] ?? row[col.charAt(0).toUpperCase() + col.slice(1)] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
