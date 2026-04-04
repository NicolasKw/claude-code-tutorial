'use client';

import { useState } from 'react';
import { Download, ExternalLink, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TutorialHeader } from '@/components/tutorial/TutorialHeader';

interface CertificatePageProps {
  userId: string;
  userName: string;
  certificateUrl: string;
  postText: string;
}

export function CertificatePage({
  userId,
  userName,
  certificateUrl,
  postText,
}: CertificatePageProps) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch(`/api/certificate/${userId}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'certificado-claude-code.png';
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
      await navigator.clipboard.writeText(postText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent fail — user can select text manually
    }
  }

  return (
    <div className="bg-[#171717] min-h-screen">
      <TutorialHeader currentLevel={7} />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-[28px] font-semibold text-[#E9FFB9]">¡Lo lograste!</h1>
        <p className="text-base text-white mt-2">
          Completaste los 7 niveles de Claude Code Mastery.
        </p>

        {/* Certificate preview */}
        <div className="mt-6">
          <Card className="bg-[#1F1F1F] p-4">
            <CardContent className="p-0">
              {imageError ? (
                <p className="text-base text-white py-8 text-center">
                  Este certificado no existe o el usuario no completó el tutorial.
                </p>
              ) : (
                <>
                  {!imageLoaded && (
                    <div
                      role="img"
                      aria-label="Cargando certificado..."
                      className="w-full rounded-lg bg-[#2A2A2A]"
                      style={{ aspectRatio: '1200 / 630' }}
                    />
                  )}
                  <img
                    src={`/api/certificate/${userId}`}
                    alt={`Certificado de Claude Code Mastery de ${userName}`}
                    className="w-full rounded-lg"
                    style={{
                      aspectRatio: '1200 / 630',
                      display: imageLoaded ? 'block' : 'none',
                    }}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action buttons */}
        <div className="max-w-sm mx-auto flex flex-col gap-3 mt-6">
          <Button
            className="h-11 w-full font-semibold bg-[#D9ADFF] text-[#171717] hover:opacity-80"
            aria-label="Descargar certificado como PNG"
            onClick={handleDownload}
            disabled={downloading}
          >
            <Download size={16} className="mr-2" />
            {downloading ? 'Descargando...' : 'Descargar certificado'}
          </Button>

          <Button
            className="h-11 w-full font-semibold bg-[#70B5FF] text-[#171717] hover:opacity-80"
            aria-label="Compartir en LinkedIn"
            onClick={handleLinkedInShare}
          >
            <ExternalLink size={16} className="mr-2" />
            Compartir en LinkedIn
          </Button>
        </div>

        {/* Post copy block */}
        <div className="max-w-sm mx-auto mt-8">
          <Card className="bg-[#1F1F1F]">
            <CardContent className="p-4">
              <p className="text-sm font-normal text-[#A3A3A3] mb-3">Texto para tu post</p>
              <p className="text-base text-white leading-relaxed">{postText}</p>
              <Button
                variant="outline"
                className="h-11 w-full mt-3 border-[#D9ADFF] text-[#D9ADFF]"
                aria-label={copied ? 'Texto copiado' : 'Copiar texto del post'}
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check size={16} className="mr-2" />
                    <span aria-live="polite">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} className="mr-2" />
                    Copiar texto
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
