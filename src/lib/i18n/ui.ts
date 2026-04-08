import type { Lang } from './context';

export const UI = {
  es: {
    // Landing
    badge: 'Tutorial interactivo',
    tagline: 'Aprende los 7 niveles de Claude Code construyendo tu propio agente de investigación de startups',
    duration: 'Completalo en menos de 1 hora',
    trust: ['7 niveles', '100% gratis', '< 1 hora'] as string[],
    // Registration
    nameLabel: 'Nombre *',
    namePlaceholder: 'Tu nombre completo',
    linkedinLabel: 'Perfil de LinkedIn *',
    linkedinPlaceholder: 'linkedin.com/in/tu-perfil',
    emailLabel: 'Email *',
    emailOptional: '',
    emailPlaceholder: 'tu@email.com',
    submitBtn: 'Comenzar Tutorial →',
    submitting: 'Registrando...',
    plansNote: 'Claude Code está disponible en los planes Pro, Max y Team de claude.ai',
    // Header
    prev: '← Anterior',
    next: 'Siguiente →',
    levelLabel: 'Niveles Completados',
    goToLevel: 'Ir al Nivel',
    // StepCard
    markDone: 'Listo, avanzar',
    // SetupBlock
    setupLabel: 'Crear los archivos:',
    setupTerminal: 'Usar la terminal',
    setupManual: 'Sin comandos',
    setupFileContent: 'Contenido del archivo',
    // Achievement
    masteredLabel: 'Lo que ya dominas',
    seeCertificate: 'Ver mi certificado →',
    // LevelPage
    officialDocs: 'Documentacion oficial ↗',
    // Locked
    lockedTitle: 'Este nivel está bloqueado',
    goBackPrefix: '← Volver al Nivel',
    completeFirstPrefix: 'Completá el Nivel',
    completeFirstSuffix: 'para desbloquearlo.',
    // Achievement dynamic
    levelUpPrefix: '¡Ya sos usuario Nivel',
    levelUpSuffix: '!',
    finalLevel: '¡Ya sos usuario experto de Claude Code!',
    nextLevelPrefix: 'Subir a Nivel',
    nextLevelSuffix: ' →',
    // LevelPage dynamic
    levelOfPrefix: 'Nivel',
    levelOfSeparator: 'de',
    // Certificate
    congratsPrefix: '¡Lo lograste,',
    congratsSuffix: '!',
    completedAll: 'Completaste los 7 niveles de Claude Code Mastery',
    downloadBtn: 'Descargar certificado',
    downloading: 'Descargando...',
    linkedinShare: 'Compartir en LinkedIn',
    postTextLabel: 'Texto para tu post',
    copyBtn: 'Copiar texto',
    copied: 'Copiado',
    certNotFound: 'Este certificado no existe o el usuario no completó el tutorial.',
    loadingCert: 'Cargando certificado...',
    certAltPrefix: 'Certificado de Claude Code Mastery de',
    downloadAlt: 'Descargar certificado como PNG',
    shareAlt: 'Compartir en LinkedIn',
    copyAlt: 'Copiar texto del post',
    copyAltDone: 'Texto copiado',
    cheatsheetBtn: 'Descargar guía de referencia',
    cheatsheetAlt: 'Descargar guía de referencia rápida como PNG',
  },
  en: {
    // Landing
    badge: 'Interactive Tutorial',
    tagline: 'Learn the 7 levels of Claude Code by building your own startup research agent',
    duration: 'Complete it in under 1 hour',
    trust: ['7 levels', '100% free', '< 1 hour'] as string[],
    // Registration
    nameLabel: 'Name *',
    namePlaceholder: 'Your full name',
    linkedinLabel: 'LinkedIn Profile *',
    linkedinPlaceholder: 'linkedin.com/in/your-profile',
    emailLabel: 'Email *',
    emailOptional: '',
    emailPlaceholder: 'you@email.com',
    submitBtn: 'Start Tutorial →',
    submitting: 'Registering...',
    plansNote: 'Claude Code is available on claude.ai Pro, Max and Team plans',
    // Header
    prev: '← Previous',
    next: 'Next →',
    levelLabel: 'Level',
    goToLevel: 'Go to Level',
    // StepCard
    markDone: 'Done, next',
    // SetupBlock
    setupLabel: 'Create the files:',
    setupTerminal: 'Use terminal',
    setupManual: 'No commands',
    setupFileContent: 'File content',
    // Achievement
    masteredLabel: "What you've mastered",
    seeCertificate: 'See my certificate →',
    // LevelPage
    officialDocs: 'Official docs ↗',
    // Locked
    lockedTitle: 'This level is locked',
    goBackPrefix: '← Back to Level',
    completeFirstPrefix: 'Complete Level',
    completeFirstSuffix: 'to unlock it.',
    // Achievement dynamic
    levelUpPrefix: "You're now a Level",
    levelUpSuffix: ' user!',
    finalLevel: "You're now a Claude Code expert!",
    nextLevelPrefix: 'Level',
    nextLevelSuffix: ' →',
    // LevelPage dynamic
    levelOfPrefix: 'Level',
    levelOfSeparator: 'of',
    // Certificate
    congratsPrefix: 'You did it,',
    congratsSuffix: '!',
    completedAll: 'You completed all 7 levels of Claude Code Mastery',
    downloadBtn: 'Download certificate',
    downloading: 'Downloading...',
    linkedinShare: 'Share on LinkedIn',
    postTextLabel: 'Post text',
    copyBtn: 'Copy text',
    copied: 'Copied',
    certNotFound: "This certificate doesn't exist or the user hasn't completed the tutorial.",
    loadingCert: 'Loading certificate...',
    certAltPrefix: 'Claude Code Mastery certificate for',
    downloadAlt: 'Download certificate as PNG',
    shareAlt: 'Share on LinkedIn',
    copyAlt: 'Copy post text',
    copyAltDone: 'Text copied',
    cheatsheetBtn: 'Download quick reference guide',
    cheatsheetAlt: 'Download quick reference guide as PNG',
  },
} as const satisfies Record<Lang, object>;

export type UIStrings = typeof UI.es;
