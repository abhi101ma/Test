import React from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';

interface ExportPanelProps {
  onExportCSV: () => void;
  onExportPDF: () => void;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ onExportCSV, onExportPDF }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Download className="w-5 h-5 text-blue-500" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Export Data</h3>
      </div>
      
      <div className="space-y-3">
        <button
          onClick={onExportCSV}
          className="w-full flex items-center justify-between p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
        >
          <div className="flex items-center space-x-2 sm:space-x-3">
            <FileSpreadsheet className="w-5 h-5 text-green-500" />
            <div className="text-left">
              <p className="font-medium text-gray-900 text-sm sm:text-base">Export to CSV</p>
              <p className="text-sm text-gray-500">Download campaign data as spreadsheet</p>
            </div>
          </div>
          <Download className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
        </button>
        
        <button
          onClick={onExportPDF}
          className="w-full flex items-center justify-between p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
        >
          <div className="flex items-center space-x-2 sm:space-x-3">
            <FileText className="w-5 h-5 text-red-500" />
            <div className="text-left">
              <p className="font-medium text-gray-900 text-sm sm:text-base">Export to PDF</p>
              <p className="text-sm text-gray-500">Generate insights report</p>
            </div>
          </div>
          <Download className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
        </button>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> Exports include filtered data based on your current selections.
        </p>
      </div>
    </div>
  );
};

export default ExportPanel;