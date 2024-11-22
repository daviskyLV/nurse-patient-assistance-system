import React from 'react';

interface CSVButtonProps {
  data: any[]; 
  fileName: string;
}

const CSVButton: React.FC<CSVButtonProps> = ({ data, fileName }) => {
  const headerMappings: Record<string, string> = {
    id: 'Request ID',
    name: 'Full Name',
    email: 'Email Address',
    createdAt: 'Creation Date',
  };
  
  const exportToCSV = () => {
    const originalHeaders = Object.keys(data[0]);
    const headers = originalHeaders.map(header => headerMappings[header] || header);

    const rows = data.map(item =>
      originalHeaders.map(header => item[header]).join(',')
    );
    
    // Create CSV content
    let csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n';
    csvContent += rows.join('\n');
    
    // Create a link to download the CSV file
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', fileName + '.csv');
    link.click();
  };

  return (
    <button onClick={exportToCSV} className="export-btn">
      Export to CSV
    </button>
  );
};

export default CSVButton;