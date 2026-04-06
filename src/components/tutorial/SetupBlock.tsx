'use client';

import { useState } from 'react';
import { Terminal, FolderOpen } from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { useLanguage } from '@/lib/i18n/context';
import { UI } from '@/lib/i18n/ui';
import type { SetupBlock as SetupBlockType } from '@/lib/types/tutorial';

export function SetupBlock({ terminalCode, manualInstructions, fileContents }: SetupBlockType) {
  const [mode, setMode] = useState<'terminal' | 'manual'>('terminal');
  const { lang } = useLanguage();
  const t = UI[lang];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Label + Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(26,15,46,0.4)', letterSpacing: '0.02em' }}>
          {t.setupLabel}
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setMode('terminal')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s',
              background: mode === 'terminal' ? '#1a1a1a' : 'transparent',
              color: mode === 'terminal' ? '#E2E8F0' : 'rgba(26,15,46,0.4)',
              border: mode === 'terminal' ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(26,15,46,0.15)',
            }}
          >
            <Terminal size={11} />
            {t.setupTerminal}
          </button>
          <button
            onClick={() => setMode('manual')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s',
              background: mode === 'manual' ? 'rgba(124,58,237,0.1)' : 'transparent',
              color: mode === 'manual' ? '#7C3AED' : 'rgba(26,15,46,0.4)',
              border: mode === 'manual' ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(26,15,46,0.15)',
            }}
          >
            <FolderOpen size={11} />
            {t.setupManual}
          </button>
        </div>
      </div>

      {/* Terminal mode: show only the creation commands */}
      {mode === 'terminal' && (
        <CodeBlock code={terminalCode} language="bash" />
      )}

      {/* Manual mode: show step-by-step instructions */}
      {mode === 'manual' && (
        <p style={{
          fontSize: '14px', lineHeight: 1.7,
          color: 'rgba(26,15,46,0.65)',
          padding: '12px 16px',
          background: 'rgba(124,58,237,0.04)',
          border: '1px solid rgba(124,58,237,0.12)',
          borderRadius: '10px',
          margin: 0,
        }}>
          {manualInstructions}
        </p>
      )}

      {/* File contents: always visible in both modes (when present) */}
      {fileContents && fileContents.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {fileContents.map((fc, i) => (
            <div key={i}>
              {fc.filename && (
                <p style={{
                  fontSize: '11px', fontWeight: 600,
                  color: 'rgba(26,15,46,0.35)',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}>
                  {t.setupFileContent}: {fc.filename}
                </p>
              )}
              <CodeBlock code={fc.code} language={fc.language} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
