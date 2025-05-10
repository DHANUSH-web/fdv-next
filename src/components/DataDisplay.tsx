'use client';

import { useState } from 'react';

interface DataDisplayProps {
  data: any;
  fileType: string | null;
}

export default function DataDisplay({ data, fileType }: DataDisplayProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (path: string) => {
    const newExpandedNodes = new Set(expandedNodes);
    if (newExpandedNodes.has(path)) {
      newExpandedNodes.delete(path);
    } else {
      newExpandedNodes.add(path);
    }
    setExpandedNodes(newExpandedNodes);
  };

  const renderJsonNode = (node: any, path: string = 'root', level: number = 0): JSX.Element => {
    if (node === null) return <span className="text-gray-500">null</span>;
    
    if (typeof node !== 'object') {
      return (
        <span className={
          typeof node === 'string' 
            ? 'text-green-600' 
            : typeof node === 'number' 
              ? 'text-blue-600' 
              : typeof node === 'boolean' 
                ? 'text-purple-600' 
                : 'text-gray-600'
        }>
          {JSON.stringify(node)}
        </span>
      );
    }

    const isArray = Array.isArray(node);
    const isEmpty = Object.keys(node).length === 0;
    
    if (isEmpty) {
      return <span className="text-gray-500">{isArray ? '[]' : '{}'}</span>;
    }

    const isExpanded = expandedNodes.has(path);
    
    return (
      <div className="ml-4">
        <span 
          className="cursor-pointer hover:text-blue-500 select-none"
          onClick={() => toggleNode(path)}
        >
          {isExpanded ? '▼' : '►'} {isArray ? '[' : '{'} 
          {!isExpanded && <span className="text-gray-500">...</span>}
          {!isExpanded && (isArray ? ']' : '}')}
        </span>
        
        {isExpanded && (
          <div className="ml-4">
            {Object.entries(node).map(([key, value], index) => (
              <div key={`${path}-${key}`} className="my-1">
                <span className="text-red-600">{isArray ? index : `"${key}"`}</span>: {' '}
                {renderJsonNode(value, `${path}-${key}`, level + 1)}
              </div>
            ))}
            <div className="ml-[-1rem]">{isArray ? ']' : '}'}</div>
          </div>
        )}
      </div>
    );
  };

  const renderExcelTable = (data: any[]): JSX.Element => {
    if (!data || data.length === 0) {
      return <p className="text-gray-500">No data available</p>;
    }

    // Get all unique keys from all objects
    const allKeys = new Set<string>();
    data.forEach(row => {
      Object.keys(row).forEach(key => allKeys.add(key));
    });
    const headers = Array.from(allKeys);

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {headers.map((header, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row[header] !== undefined ? String(row[header]) : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderContent = () => {
    if (!data) return <p>No data to display</p>;

    // Check if data contains an error
    if (data.error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>{data.message}</p>
          {data.originalData && (
            <div className="mt-2">
              <p className="font-bold">Data Preview:</p>
              <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                {data.originalData}
              </pre>
            </div>
          )}
        </div>
      );
    }

    if (fileType === 'json' || fileType === 'xml') {
      return (
        <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto font-mono text-sm">
          <div className="mb-2 text-xs text-gray-500">
            {fileType === 'xml' ? 'XML data converted to JSON format for display' : 'JSON data'}
          </div>
          {renderJsonNode(data)}
        </div>
      );
    } else if (fileType === 'xlsx' || fileType === 'xls' || fileType === 'csv') {
      return (
        <div>
          {fileType === 'csv' && (
            <div className="mb-2 text-xs text-gray-500">
              CSV data displayed as table
            </div>
          )}
          {renderExcelTable(data)}
        </div>
      );
    }

    return <p>Unsupported file type</p>;
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {fileType && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
              {fileType.toUpperCase()}
            </span>
          )}
          Data Preview
        </h3>
        
        <button
          onClick={() => setExpandedNodes(new Set(['root']))}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Expand All
        </button>
      </div>
      
      {renderContent()}
    </div>
  );
}