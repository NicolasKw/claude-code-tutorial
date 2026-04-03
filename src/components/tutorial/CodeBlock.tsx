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
    <div
      className="relative bg-[#171717] rounded-lg p-4 font-mono text-sm leading-relaxed"
      data-language={language}
    >
      <pre>
        <code className="font-[family-name:var(--font-geist-mono)] text-white">
          {code}
        </code>
      </pre>
      <button
        onClick={handleCopy}
        aria-label={copied ? 'Código copiado' : 'Copiar código'}
        className="absolute top-2 right-2 text-brand-primary"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </div>
  );
}
