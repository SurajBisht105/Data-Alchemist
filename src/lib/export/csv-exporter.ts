import Papa from 'papaparse';

export function exportToCSV(data: any[], filename: string): string {
  // Prepare data for CSV export
  const preparedData = data.map(item => {
    const row: any = {};
    
    Object.entries(item).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Convert arrays to comma-separated strings
        row[key] = value.join(',');
      } else if (typeof value === 'object' && value !== null) {
        // Convert objects to JSON strings
        row[key] = JSON.stringify(value);
      } else {
        row[key] = value;
      }
    });
    
    return row;
  });

  // Convert to CSV
  const csv = Papa.unparse(preparedData, {
    header: true,
    skipEmptyLines: true
  });

  // Create download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);

  return csv;
}