/**
 * Helper to export array of objects to downloadable CSV file.
 * Handles escaping quotes and comma separation safely.
 */
export function exportToCsv(filename, headers, data) {
  if (!data || !data.length) {
    return;
  }

  const csvRows = [];

  // Header Row
  csvRows.push(headers.map((h) => `"${h.label.replace(/"/g, '""')}"`).join(','));

  // Data Rows
  for (const item of data) {
    const row = headers.map((h) => {
      const val = h.accessor(item);
      const strVal = val !== undefined && val !== null ? String(val) : '';
      return `"${strVal.replace(/"/g, '""')}"`;
    });
    csvRows.push(row.join(','));
  }

  const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
