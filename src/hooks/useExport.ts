import { useState } from 'react';
import { useDataStore } from './useDataStore';
import { useRules } from './useRules';
import { usePriorities } from './usePriorities';
import { exportManager } from '@/lib/export/export-manager';
import toast from 'react-hot-toast';

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);
  const { getDataForExport } = useDataStore();
  const { rules } = useRules();
  const { priorities } = usePriorities();

  const exportAll = async () => {
    setIsExporting(true);
    
    try {
      const data = getDataForExport();
      
      // Validate data before export
      if (!data.clients.length && !data.workers.length && !data.tasks.length) {
        toast.error('No data to export');
        return;
      }
      
      await exportManager.exportAll(
        { ...data, hasData: true },
        rules,
        priorities
      );
      
      toast.success('Export completed successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportCSV = async (entityType: 'clients' | 'workers' | 'tasks') => {
    try {
      const data = getDataForExport();
      const entityData = data[entityType];
      
      if (!entityData.length) {
        toast.error(`No ${entityType} data to export`);
        return;
      }
      
      // Implementation for individual CSV export
      const csvContent = exportManager['convertToCSV'](entityData, entityType);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${entityType}-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success(`${entityType} exported successfully!`);
    } catch (error) {
      console.error('CSV export failed:', error);
      toast.error('Failed to export CSV');
    }
  };

  return {
    exportAll,
    exportCSV,
    isExporting
  };
}