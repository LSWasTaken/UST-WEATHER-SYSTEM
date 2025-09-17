import React from 'react';

interface Props {
  targetId: string; // element id to snapshot
}

const ExportButton: React.FC<Props> = ({ targetId }) => {
  const handleExport = async () => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const svg = el.querySelector('svg');
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${targetId}.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <button onClick={handleExport} className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-200 hover:bg-gray-600">Export</button>
  );
};

export default ExportButton;


