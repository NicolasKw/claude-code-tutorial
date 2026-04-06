'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: '#1a1a1a' }}>
      {/* Terminal bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: '#111111', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F57' }} />
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FEBC2E' }} />
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28C840' }} />
        </div>
        {language && (
          <span style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.05em' }}>
            {language}
          </span>
        )}
        <button
          onClick={handleCopy}
          aria-label={copied ? 'Código copiado' : 'Copiar código'}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s', color: copied ? '#A3E635' : 'rgba(255,255,255,0.75)', background: copied ? 'rgba(163,230,53,0.1)' : 'rgba(255,255,255,0.08)', border: copied ? '1px solid rgba(163,230,53,0.2)' : '1px solid rgba(255,255,255,0.12)' }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>

      {/* Code */}
      <div style={{ padding: '20px', overflowX: 'auto' }}>
        <pre style={{ margin: 0 }}>
          <code style={{ fontFamily: 'var(--font-geist-mono, "Fira Code", monospace)', fontSize: '13px', lineHeight: 1.7, color: '#E2E8F0' }}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}
