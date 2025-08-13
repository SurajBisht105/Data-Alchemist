export function exportToJSON(data: any, filename: string): string {
  const json = JSON.stringify(data, null, 2);
  
  // Create download
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  link.click();
  URL.revokeObjectURL(url);

  return json;
}