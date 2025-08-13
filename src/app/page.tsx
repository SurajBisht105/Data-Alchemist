'use client';

import { useState } from 'react';
import FileUploader from '@/components/upload/FileUploader';
import DataGrid from '@/components/data-grid/DataGrid';
import ValidationPanel from '@/components/validation/ValidationPanel';
import RuleBuilder from '@/components/rules/RuleBuilder';
import PrioritySliders from '@/components/prioritization/PrioritySliders';
import AISearchBar from '@/components/ai/AISearchBar';
import AISuggestions from '@/components/ai/AISuggestions';
import AIChat from '@/components/ai/AIChat';
import { useDataStore } from '@/hooks/useDataStore';
import { useValidation } from '@/hooks/useValidation';
import { useExport } from '@/hooks/useExport';
import { Button } from '@/components/common/Button';

export default function Home() {
  const { clients, workers, tasks, hasData, uploadData, updateData } = useDataStore();
  const { validationResults, runValidation } = useValidation();
  const { exportAll, isExporting } = useExport();
  const [activeTab, setActiveTab] = useState<'data' | 'rules' | 'priorities'>('data');

  // Create data object for components that expect it
  const data = {
    clients,
    workers,
    tasks,
    hasData
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              AI Resource Allocation Configurator
            </h1>
            {hasData && (
              <Button
                onClick={exportAll}
                loading={isExporting}
                variant="primary"
              >
                Export All
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!hasData ? (
          <FileUploader onUpload={uploadData} />
        ) : (
          <>
            <AISearchBar />
            
            <div className="mt-6 bg-white rounded-lg shadow">
              <div className="border-b">
                <nav className="flex space-x-8 px-6">
                  {['data', 'rules', 'priorities'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'data' && (
                  <>
                    <DataGrid 
                      data={data} 
                      onUpdate={updateData}
                      validationResults={validationResults}
                    />
                    <ValidationPanel 
                      results={validationResults}
                      onRunValidation={runValidation}
                    />
                  </>
                )}
                {activeTab === 'rules' && <RuleBuilder />}
                {activeTab === 'priorities' && <PrioritySliders />}
              </div>
            </div>
          </>
        )}
      </main>

      {/* AI Components */}
      {hasData && (
        <>
          <AISuggestions />
          <AIChat />
        </>
      )}
    </div>
  );
}