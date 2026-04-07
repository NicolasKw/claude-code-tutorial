import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getUserForCertificate } from '@/lib/certificate';
import { TOTAL_LEVELS } from '@/lib/types/tutorial';
import type { TutorialProgress } from '@/lib/types/tutorial';

const LEVEL_TITLES = [
  'Chatbot',
  'Plan Mode',
  'CLAUDE.md',
  'Commands, Skills & Hooks',
  'MCP Servers',
  'GSD Framework',
  'Sub-agentes',
  'RALPH Loop Autónomo',
];

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const userData = await getUserForCertificate(userId);
    if (!userData) return new Response('Not found', { status: 404 });

    const progressData = userData.progressData as TutorialProgress | null;
    const completedLevels = progressData?.completedLevels?.length ?? 0;

    const completionDate = progressData?.completedAt
      ? new Date(progressData.completedAt)
      : userData.progressUpdatedAt ?? new Date();

    const formattedDate = completionDate.toLocaleDateString('es-AR', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

    const fontBold      = await readFile(join(process.cwd(), 'public/fonts/Inter-Bold.ttf'));
    const fontRegular   = await readFile(join(process.cwd(), 'public/fonts/Inter-Regular.ttf'));
    const logoData      = await readFile(join(process.cwd(), 'public/zalesmachine-logo.png'));
    const logoSrc       = `data:image/png;base64,${logoData.toString('base64')}`;
    const claudeLogoData = await readFile(join(process.cwd(), 'public/claude-logo.png'));
    const claudeLogoSrc  = `data:image/png;base64,${claudeLogoData.toString('base64')}`;

    const row1 = LEVEL_TITLES.slice(0, 4).join('  ·  ');
    const row2 = LEVEL_TITLES.slice(4).join('  ·  ');

    const dots = Array.from({ length: TOTAL_LEVELS }, (_, i) => i < completedLevels);

    return new ImageResponse(
      (
        <div style={{
          width: '100%', height: '100%',
          display: 'flex', position: 'relative',
          backgroundColor: '#0B0920',
          fontFamily: 'Inter', overflow: 'hidden',
        }}>

          {/* ── DEEP BACKGROUND ORBS ────────────────────────────────── */}

          {/* Far background — top right deep violet */}
          <div style={{ position: 'absolute', top: -300, right: -300, width: 700, height: 700, borderRadius: '50%', backgroundColor: 'rgba(91,33,182,0.38)', display: 'flex' }} />
          {/* Mid — bottom left deep blue */}
          <div style={{ position: 'absolute', bottom: -200, left: -200, width: 560, height: 560, borderRadius: '50%', backgroundColor: 'rgba(29,78,216,0.3)', display: 'flex' }} />
          {/* Subtle — top left */}
          <div style={{ position: 'absolute', top: -80, left: -80, width: 300, height: 300, borderRadius: '50%', backgroundColor: 'rgba(109,40,217,0.2)', display: 'flex' }} />
          {/* Subtle — bottom right */}
          <div style={{ position: 'absolute', bottom: -100, right: -80, width: 320, height: 320, borderRadius: '50%', backgroundColor: 'rgba(37,99,235,0.18)', display: 'flex' }} />

          {/* ── HERO GLOW — centered behind the name ────────────────── */}
          {/* This is the key "luxury tech" element: a studio-light halo */}

          <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -220, marginLeft: -380, width: 760, height: 440, borderRadius: '50%', backgroundColor: 'rgba(109,40,217,0.26)', display: 'flex' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -160, marginLeft: -280, width: 560, height: 320, borderRadius: '50%', backgroundColor: 'rgba(124,58,237,0.2)', display: 'flex' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -100, marginLeft: -180, width: 360, height: 200, borderRadius: '50%', backgroundColor: 'rgba(139,92,246,0.15)', display: 'flex' }} />

          {/* ── EDGE ACCENTS ────────────────────────────────────────── */}

          {/* Top bar — electric violet + one gold peak in the center */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 2, background: 'linear-gradient(90deg, transparent 0%, #6D28D9 25%, #A78BFA 48%, #C9A86C 50%, #A78BFA 52%, #6D28D9 75%, transparent 100%)', display: 'flex' }} />
          {/* Bottom bar */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3) 50%, transparent)', display: 'flex' }} />
          {/* Left edge glow */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: '100%', background: 'linear-gradient(180deg, transparent, rgba(109,40,217,0.4) 40%, rgba(109,40,217,0.4) 60%, transparent)', display: 'flex' }} />
          {/* Right edge glow */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: 1, height: '100%', background: 'linear-gradient(180deg, transparent, rgba(29,78,216,0.3) 40%, rgba(29,78,216,0.3) 60%, transparent)', display: 'flex' }} />

          {/* ── PRECISION FRAME ─────────────────────────────────────── */}

          <div style={{ position: 'absolute', top: 14, left: 14, width: 1172, height: 602, border: '1px solid rgba(139,92,246,0.18)', borderRadius: 12, display: 'flex' }} />

          {/* ── CORNER BRACKETS — violet ────────────────────────────── */}

          {/* Top-left */}
          <div style={{ position: 'absolute', top: 28, left: 28, width: 30, height: 30, borderTop: '1.5px solid rgba(167,139,250,0.7)', borderLeft: '1.5px solid rgba(167,139,250,0.7)', display: 'flex' }} />
          <div style={{ position: 'absolute', top: 25, left: 63, width: 4, height: 4, borderRadius: '50%', backgroundColor: 'rgba(167,139,250,0.5)', display: 'flex' }} />
          <div style={{ position: 'absolute', top: 63, left: 25, width: 4, height: 4, borderRadius: '50%', backgroundColor: 'rgba(167,139,250,0.5)', display: 'flex' }} />

          {/* Top-right */}
          <div style={{ position: 'absolute', top: 28, right: 28, width: 30, height: 30, borderTop: '1.5px solid rgba(167,139,250,0.7)', borderRight: '1.5px solid rgba(167,139,250,0.7)', display: 'flex' }} />
          <div style={{ position: 'absolute', top: 25, right: 63, width: 4, height: 4, borderRadius: '50%', backgroundColor: 'rgba(167,139,250,0.5)', display: 'flex' }} />
          <div style={{ position: 'absolute', top: 63, right: 25, width: 4, height: 4, borderRadius: '50%', backgroundColor: 'rgba(167,139,250,0.5)', display: 'flex' }} />

          {/* Bottom-left */}
          <div style={{ position: 'absolute', bottom: 28, left: 28, width: 30, height: 30, borderBottom: '1.5px solid rgba(99,102,241,0.7)', borderLeft: '1.5px solid rgba(99,102,241,0.7)', display: 'flex' }} />
          <div style={{ position: 'absolute', bottom: 25, left: 63, width: 4, height: 4, borderRadius: '50%', backgroundColor: 'rgba(99,102,241,0.5)', display: 'flex' }} />
          <div style={{ position: 'absolute', bottom: 63, left: 25, width: 4, height: 4, borderRadius: '50%', backgroundColor: 'rgba(99,102,241,0.5)', display: 'flex' }} />

          {/* Bottom-right */}
          <div style={{ position: 'absolute', bottom: 28, right: 28, width: 30, height: 30, borderBottom: '1.5px solid rgba(99,102,241,0.7)', borderRight: '1.5px solid rgba(99,102,241,0.7)', display: 'flex' }} />
          <div style={{ position: 'absolute', bottom: 25, right: 63, width: 4, height: 4, borderRadius: '50%', backgroundColor: 'rgba(99,102,241,0.5)', display: 'flex' }} />
          <div style={{ position: 'absolute', bottom: 63, right: 25, width: 4, height: 4, borderRadius: '50%', backgroundColor: 'rgba(99,102,241,0.5)', display: 'flex' }} />

          {/* ── DIAMOND MIDPOINTS ───────────────────────────────────── */}

          <div style={{ position: 'absolute', top: 17, left: '50%', marginLeft: -7, width: 12, height: 12, transform: 'rotate(45deg)', border: '1px solid rgba(167,139,250,0.55)', backgroundColor: 'rgba(109,40,217,0.2)', display: 'flex' }} />
          <div style={{ position: 'absolute', bottom: 17, left: '50%', marginLeft: -7, width: 12, height: 12, transform: 'rotate(45deg)', border: '1px solid rgba(99,102,241,0.55)', backgroundColor: 'rgba(79,70,229,0.2)', display: 'flex' }} />
          <div style={{ position: 'absolute', top: '50%', left: 16, marginTop: -6, width: 10, height: 10, transform: 'rotate(45deg)', border: '1px solid rgba(139,92,246,0.4)', display: 'flex' }} />
          <div style={{ position: 'absolute', top: '50%', right: 16, marginTop: -6, width: 10, height: 10, transform: 'rotate(45deg)', border: '1px solid rgba(139,92,246,0.4)', display: 'flex' }} />

          {/* ── FINE PARTICLE DOTS ──────────────────────────────────── */}

          <div style={{ position: 'absolute', top: 108, left: 200, width: 2, height: 2, borderRadius: '50%', backgroundColor: 'rgba(167,139,250,0.4)', display: 'flex' }} />
          <div style={{ position: 'absolute', top: 185, left: 148, width: 1.5, height: 1.5, borderRadius: '50%', backgroundColor: 'rgba(167,139,250,0.25)', display: 'flex' }} />
          <div style={{ position: 'absolute', top: 68, left: 395, width: 2, height: 2, borderRadius: '50%', backgroundColor: 'rgba(196,181,253,0.35)', display: 'flex' }} />
          <div style={{ position: 'absolute', top: 145, right: 215, width: 2, height: 2, borderRadius: '50%', backgroundColor: 'rgba(167,139,250,0.35)', display: 'flex' }} />
          <div style={{ position: 'absolute', top: 88, right: 395, width: 1.5, height: 1.5, borderRadius: '50%', backgroundColor: 'rgba(196,181,253,0.28)', display: 'flex' }} />
          <div style={{ position: 'absolute', bottom: 145, left: 188, width: 2, height: 2, borderRadius: '50%', backgroundColor: 'rgba(165,180,252,0.35)', display: 'flex' }} />
          <div style={{ position: 'absolute', bottom: 112, right: 258, width: 1.5, height: 1.5, borderRadius: '50%', backgroundColor: 'rgba(167,139,250,0.3)', display: 'flex' }} />
          <div style={{ position: 'absolute', bottom: 190, right: 185, width: 2, height: 2, borderRadius: '50%', backgroundColor: 'rgba(196,181,253,0.28)', display: 'flex' }} />

          {/* ── BOTTOM META ─────────────────────────────────────────── */}

          <div style={{ position: 'absolute', bottom: 36, left: 70, fontSize: 10, fontWeight: 400, color: 'rgba(167,139,250,0.55)', letterSpacing: 2.5, display: 'flex' }}>
            {`ID · ${userId.slice(0, 8).toUpperCase()}`}
          </div>
          <div style={{ position: 'absolute', bottom: 36, right: 70, fontSize: 10, fontWeight: 400, color: 'rgba(167,139,250,0.55)', letterSpacing: 2.5, display: 'flex' }}>
            CLAUDE CODE · 2026
          </div>

          {/* Progress dots — violet */}
          <div style={{ position: 'absolute', bottom: 38, left: '50%', marginLeft: -60, display: 'flex', alignItems: 'center', gap: 8 }}>
            {dots.map((filled, i) => (
              <div key={i} style={{
                width: filled ? 8 : 5, height: filled ? 8 : 5,
                borderRadius: '50%',
                backgroundColor: filled ? '#A78BFA' : 'rgba(255,255,255,0.07)',
                border: filled ? 'none' : '1px solid rgba(167,139,250,0.2)',
                display: 'flex',
              }} />
            ))}
          </div>

          {/* ── MAIN CONTENT ────────────────────────────────────────── */}

          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            width: '100%', height: '100%',
            padding: '0 110px',
          }}>

            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <div style={{ width: 28, height: 1, background: 'linear-gradient(90deg, transparent, rgba(210,195,255,0.85))', display: 'flex' }} />
              <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(235,225,255,1.0)', letterSpacing: 4, display: 'flex' }}>
                CERTIFICADO DE FINALIZACIÓN
              </div>
              <div style={{ width: 28, height: 1, background: 'linear-gradient(90deg, rgba(210,195,255,0.85), transparent)', display: 'flex' }} />
            </div>

            {/* Logos */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={claudeLogoSrc} alt="Claude" width={28} height={28}
                style={{ objectFit: 'contain', opacity: 0.95 }} />
              <div style={{ width: 1, height: 22, background: 'rgba(167,139,250,0.35)', display: 'flex' }} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoSrc} alt="ZalesMachine" width={148} height={36}
                style={{ objectFit: 'contain', opacity: 0.95 }} />
            </div>

            {/* Separator — violet fading to gold in center (one luxe touch) */}
            <div style={{ width: 500, height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.5) 25%, rgba(196,181,253,0.9) 45%, rgba(201,168,108,0.8) 50%, rgba(196,181,253,0.9) 55%, rgba(139,92,246,0.5) 75%, transparent 100%)', marginBottom: 22, display: 'flex' }} />

            {/* Name */}
            <div style={{ fontSize: 64, fontWeight: 700, color: '#FFFFFF', marginBottom: 22, letterSpacing: -1.5, display: 'flex' }}>
              {userData.name}
            </div>

            {/* Separator — mirror */}
            <div style={{ width: 500, height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.5) 25%, rgba(167,139,250,0.9) 45%, rgba(201,168,108,0.8) 50%, rgba(167,139,250,0.9) 55%, rgba(99,102,241,0.5) 75%, transparent 100%)', marginBottom: 18, display: 'flex' }} />

            {/* Course name */}
            <div style={{ fontSize: 19, fontWeight: 700, color: '#DDD6FE', marginBottom: 18, letterSpacing: 2, display: 'flex' }}>
              CLAUDE CODE MASTERY
            </div>

            {/* Concepts label */}
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(210,195,255,0.9)', letterSpacing: 3.5, marginBottom: 10, display: 'flex' }}>
              TEMAS CUBIERTOS
            </div>

            {/* Concepts row 1 */}
            {row1 ? (
              <div style={{ fontSize: 12, fontWeight: 400, color: 'rgba(235,228,255,0.95)', letterSpacing: 0.2, marginBottom: row2 ? 4 : 0, display: 'flex' }}>
                {row1}
              </div>
            ) : null}

            {/* Concepts row 2 */}
            {row2 ? (
              <div style={{ fontSize: 12, fontWeight: 400, color: 'rgba(235,228,255,0.95)', letterSpacing: 0.2, display: 'flex' }}>
                {row2}
              </div>
            ) : null}

            {/* Date */}
            <div style={{ fontSize: 11, fontWeight: 400, color: 'rgba(210,195,255,0.9)', letterSpacing: 1.5, marginTop: 18, display: 'flex' }}>
              {formattedDate}
            </div>

          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: 'Inter', data: fontBold,    weight: 700, style: 'normal' },
          { name: 'Inter', data: fontRegular, weight: 400, style: 'normal' },
        ],
      }
    );
  } catch (e) {
    console.error('[certificate route error]', e);
    return new Response('Internal server error', { status: 500 });
  }
}
