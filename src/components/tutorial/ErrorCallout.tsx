import type { ErrorCalloutContent } from '@/lib/types/tutorial';

export function ErrorCallout({ trigger, error, solution }: ErrorCalloutContent) {
  return (
    <details className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3">
      <summary className="cursor-pointer text-sm font-semibold text-amber-800 select-none">
        {trigger} — {error}
      </summary>
      <p className="mt-2 text-sm text-amber-900 leading-relaxed">{solution}</p>
    </details>
  );
}
