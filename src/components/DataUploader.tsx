import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';

interface DataUploaderProps {
  onDataUploaded: (data: any[], dataType: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const DataUploader: React.FC<DataUploaderProps> = ({ onDataUploaded, isOpen, onClose }) => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [selectedDataType, setSelectedDataType] = useState<string>('influencers');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [uploadedCount, setUploadedCount] = useState<number>(0);

  const dataTypes = [
    { value: 'influencers', label: 'Influencers', description: 'Upload influencer profiles and demographics' },
    { value: 'campaigns', label: 'Campaigns', description: 'Upload campaign information and budgets' },
    { value: 'posts', label: 'Posts', description: 'Upload post data and engagement metrics' },
    { value: 'tracking_data', label: 'Tracking Data', description: 'Upload order and attribution data' },
    { value: 'payouts', label: 'Payouts', description: 'Upload payout information and status' }
  ];

  const parseCSV = (csvText: string): any[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      if (values.length === headers.length) {
        const row: any = {};
        headers.forEach((header, index) => {
          let value: any = values[index];
          
          // Try to parse numbers
          if (!isNaN(Number(value)) && value !== '') {
            value = Number(value);
          }
          
          // Try to parse booleans
          if (value === 'true') value = true;
          if (value === 'false') value = false;
          
          // Try to parse JSON objects (for complex fields)
          if (value.startsWith('{') && value.endsWith('}')) {
            try {
              value = JSON.parse(value);
            } catch (e) {
              // Keep as string if JSON parsing fails
            }
          }
          
          // Try to parse arrays
          if (value.startsWith('[') && value.endsWith(']')) {
            try {
              value = JSON.parse(value);
            } catch (e) {
              // Keep as string if JSON parsing fails
            }
          }
          
          row[header] = value;
        });
        data.push(row);
      }
    }

    return data;
  };

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus('uploading');
    setErrorMessage('');

    try {
      const text = await file.text();
      let parsedData: any[] = [];

      if (file.name.endsWith('.csv')) {
        parsedData = parseCSV(text);
      } else if (file.name.endsWith('.json')) {
        parsedData = JSON.parse(text);
      } else {
        throw new Error('Unsupported file format. Please upload CSV or JSON files.');
      }

      if (parsedData.length === 0) {
        throw new Error('No valid data found in the file.');
      }

      // Validate data structure based on selected type
      const isValid = validateDataStructure(parsedData, selectedDataType);
      if (!isValid) {
        throw new Error(`Invalid data structure for ${selectedDataType}. Please check the format.`);
      }

      setUploadedCount(parsedData.length);
      setUploadStatus('success');
      onDataUploaded(parsedData, selectedDataType);

      // Auto-close after 2 seconds
      setTimeout(() => {
        setUploadStatus('idle');
        onClose();
      }, 2000);

    } catch (error) {
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
    }

    // Reset file input
    event.target.value = '';
  }, [selectedDataType, onDataUploaded, onClose]);

  const validateDataStructure = (data: any[], dataType: string): boolean => {
    if (!Array.isArray(data) || data.length === 0) return false;

    const sample = data[0];
    
    switch (dataType) {
      case 'influencers':
        return sample.hasOwnProperty('name') && sample.hasOwnProperty('platform');
      case 'campaigns':
        return sample.hasOwnProperty('campaign_name') && sample.hasOwnProperty('brand');
      case 'posts':
        return sample.hasOwnProperty('post_url') && sample.hasOwnProperty('influencer_id');
      case 'tracking_data':
        return sample.hasOwnProperty('order_id') && sample.hasOwnProperty('revenue');
      case 'payouts':
        return sample.hasOwnProperty('influencer_id') && sample.hasOwnProperty('total_payout');
      default:
        return false;
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Upload className="w-5 h-5 text-gray-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Upload Data</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Data Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Type
          </label>
          <select
            value={selectedDataType}
            onChange={(e) => setSelectedDataType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={uploadStatus === 'uploading'}
          >
            {dataTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {dataTypes.find(t => t.value === selectedDataType)?.description}
          </p>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload File
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept=".csv,.json"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={uploadStatus === 'uploading'}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              {getStatusIcon()}
              <span className="text-sm text-gray-600">
                {uploadStatus === 'uploading' ? 'Uploading...' :
                 uploadStatus === 'success' ? `Successfully uploaded ${uploadedCount} records` :
                 uploadStatus === 'error' ? 'Upload failed' :
                 'Click to upload CSV or JSON file'}
              </span>
            </label>
          </div>
          
          {uploadStatus === 'error' && (
            <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
          )}
        </div>

        {/* Format Guidelines */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Format Guidelines</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• CSV files should have headers in the first row</li>
            <li>• JSON files should contain an array of objects</li>
            <li>• Complex fields (demographics) should be JSON strings</li>
            <li>• Date format: YYYY-MM-DD</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DataUploader;