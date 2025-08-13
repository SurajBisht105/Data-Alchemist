import JSZip from 'jszip';
import { DataStore } from '@/types/data.types';
import { Rule } from '@/types/rules.types';

export class ExportManager {
  async exportAll(
    data: DataStore,
    rules: Rule[],
    priorities: Record<string, number>
  ): Promise<void> {
    const zip = new JSZip();
    
    // Create CSV content
    const clientsCSV = this.convertToCSV(data.clients, 'clients');
    const workersCSV = this.convertToCSV(data.workers, 'workers');
    const tasksCSV = this.convertToCSV(data.tasks, 'tasks');
    
    // Create rules JSON
    const rulesConfig = {
      rules: rules.map(rule => ({
        type: rule.type,
        parameters: rule.parameters,
        description: rule.description,
        createdAt: rule.createdAt
      })),
      priorities,
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
        totalRules: rules.length,
        totalClients: data.clients.length,
        totalWorkers: data.workers.length,
        totalTasks: data.tasks.length
      }
    };
    
    // Add files to zip
    zip.file('clients.csv', clientsCSV);
    zip.file('workers.csv', workersCSV);
    zip.file('tasks.csv', tasksCSV);
    zip.file('rules.json', JSON.stringify(rulesConfig, null, 2));
    zip.file('README.txt', this.generateReadme());
    
    // Generate and download zip
    const blob = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 }
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resource-allocation-${new Date().toISOString().split('T')[0]}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private convertToCSV(data: any[], type: string): string {
    if (!data || data.length === 0) {
      return `No ${type} data available`;
    }
    
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    
    const csvRows = data.map(item => {
      return headers.map(header => {
        const value = item[header];
        
        if (value === null || value === undefined) {
          return '';
        }
        
        if (Array.isArray(value)) {
          return `"${value.join(',')}"`;
        }
        
        if (typeof value === 'object') {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        
        return value;
      }).join(',');
    });
    
    return [csvHeaders, ...csvRows].join('\n');
  }

  private generateReadme(): string {
    return `AI Resource Allocation Export
Generated: ${new Date().toISOString()}

This export contains:
1. clients.csv - Client data with priority levels and requested tasks
2. workers.csv - Worker data with skills and availability
3. tasks.csv - Task data with requirements and constraints
4. rules.json - Business rules and priority configurations

Import Instructions:
- Use the cleaned CSV files in your resource allocation system
- Apply the rules from rules.json to configure business logic
- Priority weights in rules.json determine allocation preferences

For questions or support, visit: https://your-domain.com/support
`;
  }
}

export const exportManager = new ExportManager();