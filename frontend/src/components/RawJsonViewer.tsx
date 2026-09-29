import React, { useState } from 'react';

interface RawJsonProps {
  payload: any;
}

export const RawJsonViewer: React.FC<RawJsonProps> = ({ payload }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ruled-box">
      <div className="ruled-box-header">
        <span className="ruled-box-title">RAW METEOROLOGICAL TELEMETRY PAYLOAD (JSON)</span>
        <button className="btn-action-accent" onClick={handleCopy} style={{ padding: '2px 8px', fontSize: '10px' }}>
          {copied ? 'COPIED TO CLIPBOARD' : 'COPY JSON PAYLOAD'}
        </button>
      </div>
      <pre className="code-dump-box">
        {JSON.stringify(payload, null, 2)}
      </pre>
    </div>
  );
};
