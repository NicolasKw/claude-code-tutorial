import type { ErrorCalloutContent } from '@/lib/types/tutorial';

export function ErrorCallout({ trigger, error, solution }: ErrorCalloutContent) {
  return (
    <details style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(234,179,8,0.25)' }}>
      <summary style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', cursor: 'pointer', userSelect: 'none', fontSize: '13px', fontWeight: 600, background: 'rgba(234,179,8,0.06)', color: '#92400E', listStyle: 'none' }}>
        <span style={{ fontSize: '9px', color: 'rgba(146,64,14,0.5)' }}>▶</span>
        {trigger} — {error}
      </summary>
      <div style={{ padding: '12px 14px', background: 'rgba(254,252,232,0.8)', borderTop: '1px solid rgba(234,179,8,0.15)' }}>
        <p style={{ fontSize: '13px', lineHeight: 1.65, color: 'rgba(26,15,46,0.65)', margin: 0 }}>
          {solution}
        </p>
      </div>
    </details>
  );
}
