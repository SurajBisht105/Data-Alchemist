import { useState } from 'react';

interface Props {
  onFilterChange: (filter: string) => void;
  onExport: () => void;
}

export default function GridToolbar({ onFilterChange, onExport }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onFilterChange(value);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search data..."
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
        <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
          <span className="text-lg">🔍</span>
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onExport}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2"
        >
          <span>📥</span>
          Export
        </button>
      </div>
    </div>
  );
}