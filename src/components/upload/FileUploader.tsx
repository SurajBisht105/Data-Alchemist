import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { parseFile } from '@/lib/parsers/file-parser';
import { validateUploadedData } from '@/lib/validators/upload-validator';

interface Props {
  onUpload: (data: any) => void;
}

interface FileStatus {
  name: string;
  type: 'clients' | 'workers' | 'tasks' | null;
  status: 'pending' | 'parsing' | 'success' | 'error';
  message?: string;
  data?: any;
}

export default function FileUploader({ onUpload }: Props) {
  const [files, setFiles] = useState<FileStatus[]>([]);
  const [useAIParsing, setUseAIParsing] = useState(true);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: FileStatus[] = acceptedFiles.map(file => ({
      name: file.name,
      type: detectFileType(file.name),
      status: 'pending' as const
    }));
    
    setFiles(prev => [...prev, ...newFiles]);

    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      const fileIndex = files.length + i;
      
      setFiles(prev => prev.map((f, idx) => 
        idx === fileIndex ? { ...f, status: 'parsing' } : f
      ));

      try {
        const data = await parseFile(file, useAIParsing);
        const fileType = detectFileType(file.name);
        
        setFiles(prev => prev.map((f, idx) => 
          idx === fileIndex 
            ? { ...f, status: 'success', data, type: fileType } 
            : f
        ));
      } catch (error) {
        setFiles(prev => prev.map((f, idx) => 
          idx === fileIndex 
            ? { ...f, status: 'error', message: error.message } 
            : f
        ));
      }
    }
  }, [files.length, useAIParsing]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: true
  });

  const detectFileType = (filename: string): 'clients' | 'workers' | 'tasks' | null => {
    const lower = filename.toLowerCase();
    if (lower.includes('client')) return 'clients';
    if (lower.includes('worker')) return 'workers';
    if (lower.includes('task')) return 'tasks';
    return null;
  };

  const handleProceed = () => {
    const successFiles = files.filter(f => f.status === 'success');
    const data = {
      clients: successFiles.find(f => f.type === 'clients')?.data || [],
      workers: successFiles.find(f => f.type === 'workers')?.data || [],
      tasks: successFiles.find(f => f.type === 'tasks')?.data || [],
      hasData: true
    };
    
    onUpload(data);
  };

  const allFilesReady = files.length >= 3 && 
    files.filter(f => f.status === 'success').length >= 3 &&
    ['clients', 'workers', 'tasks'].every(type => 
      files.some(f => f.type === type && f.status === 'success')
    );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Welcome to the Data Alchemist</h2>
        <p className="text-lg text-gray-600">
          Upload your CSV or Excel files to begin transforming chaos into order
        </p>
      </div>

      <div className="mb-4 flex items-center justify-center">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={useAIParsing}
            onChange={(e) => setUseAIParsing(e.target.checked)}
            className="rounded text-blue-600"
          />
          <span className="text-sm font-medium">
            Use AI-powered parsing (handles misnamed columns & formats)
          </span>
        </label>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="text-5xl">📁</div>
          <div>
            <p className="text-lg font-medium">
              {isDragActive 
                ? 'Drop your files here...' 
                : 'Drag & drop your files here'
              }
            </p>
            <p className="text-sm text-gray-500 mt-2">
              or click to browse. Support CSV and Excel files.
            </p>
          </div>
          <div className="text-sm text-gray-600">
            Upload files for: <span className="font-medium">Clients</span>, 
            <span className="font-medium"> Workers</span>, and 
            <span className="font-medium"> Tasks</span>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="font-semibold">Uploaded Files</h3>
          {files.map((file, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${
                file.status === 'success' ? 'bg-green-50 border-green-200' :
                file.status === 'error' ? 'bg-red-50 border-red-200' :
                file.status === 'parsing' ? 'bg-blue-50 border-blue-200' :
                'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {file.status === 'success' ? '✅' :
                     file.status === 'error' ? '❌' :
                     file.status === 'parsing' ? '⏳' : '📄'}
                  </div>
                  <div>
                    <div className="font-medium">{file.name}</div>
                    <div className="text-sm text-gray-600">
                      Type: {file.type || 'Auto-detecting...'}
                    </div>
                  </div>
                </div>
                {file.status === 'parsing' && (
                  <div className="text-sm text-blue-600">Parsing with AI...</div>
                )}
                {file.status === 'error' && (
                  <div className="text-sm text-red-600">{file.message}</div>
                )}
                {file.status === 'success' && file.data && (
                  <div className="text-sm text-green-600">
                    {file.data.length} records loaded
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {allFilesReady && (
        <div className="mt-8 text-center">
          <button
            onClick={handleProceed}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-medium"
          >
            Proceed to Data Configuration
          </button>
        </div>
      )}
    </div>
  );
}