'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="relative rounded-lg bg-[#171717] p-4"
      data-language={language}
    >
      <button
        className="absolute top-2 right-2 text-[#D9ADFF] hover:opacity-80"
        onClick={handleCopy}
        aria-label={copied ? 'Código copiado' : 'Copiar código'}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <pre className="font-mono text-sm leading-relaxed text-white overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}
