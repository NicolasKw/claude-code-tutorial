'use client';

import { useState, useEffect } from 'react';
import { Download, ExternalLink, Copy, Check } from 'lucide-react';
import { TutorialHeader } from '@/components/tutorial/TutorialHeader';
import { useLanguage } from '@/lib/i18n/context';
import { UI } from '@/lib/i18n/ui';

interface CertificatePageProps {
  userId: string;
  userName: string;
  certificateUrl: string;
  postText: string;
  tutorialUrl: string;
}

export function CertificatePage({
  userId,
  userName,
  certificateUrl,
  postText,
  tutorialUrl,
}: CertificatePageProps) {
  const { lang } = useLanguage();
  const t = UI[lang];
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const activePostText = lang === 'en'
    ? `I just completed the Claude Code Mastery tutorial by ZalesMachine and built a startup research agent from scratch. Learn how to use Claude Code for real projects: ${tutorialUrl} — ${userName}`
    : postText;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch(`/api/certificate/${userId}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = lang === 'en' ? 'claude-code-certificate.png' : 'certificado-claude-code.png';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Error handling — could show toast but keeping simple for v1
    } finally {
      setTimeout(() => setDownloading(false), 500);
    }
  }

  function handleLinkedInShare() {
    const encoded = encodeURIComponent(certificateUrl);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
      '_blank',
      'noopener,noreferrer,width=600,height=600'
    );
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(activePostText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent fail — user can select text manually
    }
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <TutorialHeader level={7} currentLevel={8} />
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Hero */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🏆</div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{
              background: 'linear-gradient(135deg, #9333EA 0%, #6366F1 50%, #3B82F6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {t.congratsPrefix} {userName}{t.congratsSuffix}
          </h1>
          <p className="text-sm" style={{ color: 'rgba(26,15,46,0.45)' }}>
            {t.completedAll}
          </p>
        </div>

        {/* Certificate preview */}
        <div
          className="rounded-2xl overflow-hidden mb-6"
          style={{ border: '1px solid rgba(217,173,255,0.15)', background: 'rgba(255,255,255,0.03)' }}
        >
          {imageError ? (
            <p className="text-sm py-12 text-center" style={{ color: 'rgba(26,15,46,0.4)' }}>
              {t.certNotFound}
            </p>
          ) : (
            <>
              {!imageLoaded && (
                <div
                  role="img"
                  aria-label={t.loadingCert}
                  className="w-full animate-pulse aspect-[1200/630]"
                  style={{ background: 'rgba(147,51,234,0.05)' }}
                />
              )}
              <img
                src={`/api/certificate/${userId}`}
                alt={`${t.certAltPrefix} ${userName}`}
                className={`w-full aspect-[1200/630] cursor-zoom-in${imageLoaded ? '' : ' hidden'}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => { setImageError(true); setImageLoaded(false); }}
                onClick={() => setLightbox(true)}
              />
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 mb-8">
          <button
            aria-label={t.downloadAlt}
            onClick={handleDownload}
            disabled={downloading}
            className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-85 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #D9ADFF 0%, #70B5FF 100%)',
              color: '#0C0A14',
            }}
          >
            <Download size={15} />
            {downloading ? t.downloading : t.downloadBtn}
          </button>

          <button
            aria-label={t.shareAlt}
            onClick={handleLinkedInShare}
            className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-85"
            style={{
              background: 'rgba(112,181,255,0.15)',
              border: '1px solid rgba(112,181,255,0.3)',
              color: '#70B5FF',
            }}
          >
            <ExternalLink size={15} />
            {t.linkedinShare}
          </button>
        </div>

        {/* Post copy block */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(147,51,234,0.1)',
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(26,15,46,0.35)' }}>
            {t.postTextLabel}
          </p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(26,15,46,0.65)' }}>
            {activePostText}
          </p>
          <button
            aria-label={copied ? t.copyAltDone : t.copyAlt}
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={
              copied
                ? { background: 'rgba(163,230,53,0.12)', border: '1px solid rgba(163,230,53,0.25)', color: '#A3E635' }
                : { background: 'rgba(217,173,255,0.1)', border: '1px solid rgba(217,173,255,0.2)', color: '#D9ADFF' }
            }
          >
            {copied ? (
              <><Check size={14} /><span aria-live="polite">{t.copied}</span></>
            ) : (
              <><Copy size={14} />{t.copyBtn}</>
            )}
          </button>
        </div>
      </div>
      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
          onClick={() => setLightbox(false)}
        >
          <img
            src={`/api/certificate/${userId}`}
            alt={`${t.certAltPrefix} ${userName}`}
            className="rounded-2xl shadow-2xl"
            style={{ maxWidth: '90vw', maxHeight: '90vh', width: '100%', objectFit: 'contain', cursor: 'zoom-out' }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
