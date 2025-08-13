import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
// import { exportRateLimiter } from '@/lib/utils/rate-limiter';

export async function POST(request: NextRequest) {
  // Rate limiting - COMMENTED OUT
  // const clientIp = request.headers.get('x-forwarded-for') || 'anonymous';
  // const { allowed } = exportRateLimiter.check(clientIp);
  
  // if (!allowed) {
  //   return NextResponse.json(
  //     { error: 'Export rate limit exceeded' },
  //     { status: 429 }
  //   );
  // }

  try {
    const { data, rules, priorities } = await request.json();
    
    const zip = new JSZip();
    
    // Add CSV files
    const csvData = {
      clients: convertToCSV(data.clients),
      workers: convertToCSV(data.workers),
      tasks: convertToCSV(data.tasks)
    };
    
    zip.file('clients.csv', csvData.clients);
    zip.file('workers.csv', csvData.workers);
    zip.file('tasks.csv', csvData.tasks);
    
    // Add rules.json
    const rulesConfig = {
      rules,
      priorities,
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };
    zip.file('rules.json', JSON.stringify(rulesConfig, null, 2));
    
    // Generate zip
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    
    return new NextResponse(zipBlob, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="resource-allocation-${Date.now()}.zip"`
      }
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const rows = data.map(item => 
    headers.map(header => {
      const value = item[header];
      if (Array.isArray(value)) {
        return value.join(',');
      } else if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value);
      }
      return value;
    })
  );
  
  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
}
