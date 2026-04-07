import { Document, Page, View, Text, Image, Font, StyleSheet } from '@react-pdf/renderer';
import { renderToBuffer } from '@react-pdf/renderer';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';

export const dynamic = 'force-dynamic';

// Register fonts once at module level
Font.register({
  family: 'Inter',
  fonts: [
    { src: join(process.cwd(), 'public/fonts/Inter-Regular.ttf'), fontWeight: 400 },
    { src: join(process.cwd(), 'public/fonts/Inter-Bold.ttf'),    fontWeight: 700 },
  ],
});

// Content mirrors levels.ts — update both when tutorial content changes
const CONTENT = {
  es: {
    eyebrow: 'CLAUDE CODE MASTERY',
    title: 'GUÍA DE REFERENCIA RÁPIDA',
    subtitle: '7 niveles · Comandos y conceptos clave',
    levels: [
      {
        num: '00', title: 'Chatbot',
        desc: 'Interfaz conversacional de Claude Code en la terminal',
        cmds: [
          'claude  →  iniciar nueva sesión',
          'claude --resume  →  retomar última sesión con contexto',
          '! mkdir carpeta  →  ejecutar terminal sin salir de Claude',
          '/clear  →  limpiar contexto (antes de cambiar de tarea)',
          '/exit  →  salir (necesario al cambiar directorio o config)',
          '/help  →  ver todos los comandos disponibles',
        ],
        tip: 'Reiniciá claude al crear CLAUDE.md, commands, agents o MCPs nuevos',
      },
      {
        num: '01', title: 'Plan Mode',
        desc: 'Claude diseña la arquitectura antes de escribir código',
        cmds: [
          'Shift+Tab  →  activar / desactivar Plan Mode',
          'Describir objetivo  →  Claude planifica sin ejecutar nada',
          'Responder preguntas  →  refinar el plan antes de aprobar',
          'Shift+Tab  →  volver a modo normal (accept edits)',
          '"Ejecutá el plan aprobado"  →  dar luz verde',
          'Ctrl+C  →  interrumpir si Claude escribe sin esperar plan',
        ],
        tip: 'Activalo siempre antes de cambios grandes o destructivos',
      },
      {
        num: '02', title: 'CLAUDE.md',
        desc: 'Instrucciones persistentes que Claude lee al iniciar cada sesión',
        cmds: [
          'touch CLAUDE.md  →  crear en raíz del proyecto',
          '/init  →  generar CLAUDE.md base desde el repo existente',
          '~/.claude/CLAUDE.md  →  instrucciones globales (toda sesión)',
          'Máx. 30 instrucciones — legible en 60 segundos',
          '"don\'t dump": apunta a /docs/, no copia el contenido ahí',
          'Reiniciá claude después de editar para recargar instrucciones',
        ],
        tip: 'Verificá con: "¿Qué sabés sobre este proyecto y cómo trabajamos?"',
      },
      {
        num: '03', title: 'Commands, Skills & Hooks',
        desc: 'Tres capas de automatización complementarias para extender Claude Code',
        cmds: [
          '** COMMANDS',
          'Prompts reutilizables que vos invocás con /nombre $ARGUMENTS',
          'Archivo: .claude/commands/nombre.md',
          '** SKILLS',
          'Frameworks de pensamiento que Claude activa solo por contexto',
          'Archivo: .claude/skills/rol/skill.md  ·  frontmatter description: requerido',
          '** HOOKS',
          'Scripts de shell que el harness ejecuta ante eventos del ciclo',
          'Archivo: .claude/settings.json  ·  PreToolUse · PostToolUse · Stop',
        ],
        tip: 'Hooks no consumen tokens LLM — son validaciones mecánicas puras',
      },
      {
        num: '04', title: 'MCP Servers',
        desc: 'Conecta Claude a herramientas externas: Notion, Supabase, Slack...',
        cmds: [
          'claude mcp add <nombre> -- npx -y @pkg  →  agregar servidor',
          'claude mcp list  →  ver servidores activos en sesión',
          'claude mcp remove <nombre>  →  eliminar servidor',
          '.mcp.json en raíz  →  config compartida por proyecto (git)',
          'node --version  →  verificar Node.js ≥ 18 (requisito)',
          'github.com/modelcontextprotocol/servers  →  catálogo oficial',
        ],
        tip: 'Con .mcp.json commiteado, todo el equipo comparte los mismos MCPs',
      },
      {
        num: '05', title: 'GSD Framework',
        desc: 'Resuelve el context rot dividiendo proyectos en fases independientes',
        cmds: [
          'npx get-shit-done-cc@latest  →  instalar GSD en el proyecto',
          '/gsd:new-project  →  mapear codebase + generar roadmap',
          '/gsd:plan-phase  →  planificar fase actual (crea PLAN.md)',
          '/gsd:execute-phase  →  ejecutar tareas con commits atómicos',
          '/gsd:progress  →  ver estado del proyecto',
          '/gsd:next  →  avanzar a la siguiente fase automáticamente',
          '/clear  →  ejecutar entre comandos GSD para evitar drift',
        ],
        tip: 'Context rot = Claude olvida el inicio del chat a los ~10k tokens',
      },
      {
        num: '06', title: 'Sub-agentes',
        desc: 'Agentes especializados que trabajan en paralelo o en cadena',
        cmds: [
          '.claude/agents/nombre.md  →  definir agente con rol propio',
          'frontmatter tools:  →  declarar herramientas del agente',
          'frontmatter description:  →  cuándo Claude activa el agente',
          'claude --dangerously-skip-permissions  →  sin confirmaciones',
          'Secuencial: 1 terminal · output encadenado · más calidad',
          'Paralelo: N terminales simultáneas · velocidad 3×',
        ],
        tip: 'Ideal para tareas independientes: research, testing, builds en paralelo',
      },
      {
        num: '07', title: 'RALPH Loop',
        desc: 'Ejecutor batch autónomo con contexto fresco por cada iteración',
        cmds: [
          '/plugin install ralph-loop@claude-plugins-official',
          'touch prd.json  →  crear lista de tareas para RALPH',
          'prd.json: id · description · acceptance_criteria · status',
          'Criterios: "archivo en /output/" — no "reporte bueno"',
          '/ralph --max-iterations N  →  ejecutar (N ≈ 3× cant. de tareas)',
          'Monitorear: watch cat prd.json · revisar /output/ al terminar',
        ],
        tip: 'GSD = definís el alcance.  RALPH = ejecutás las tareas definidas.',
      },
    ],
  },
  en: {
    eyebrow: 'CLAUDE CODE MASTERY',
    title: 'QUICK REFERENCE GUIDE',
    subtitle: '7 levels · Key commands and concepts',
    levels: [
      {
        num: '00', title: 'Chatbot',
        desc: 'Claude Code conversational interface in the terminal',
        cmds: [
          'claude  →  start a new session',
          'claude --resume  →  resume last session with its context',
          '! mkdir folder  →  run terminal without leaving Claude',
          '/clear  →  clear context (before switching tasks)',
          '/exit  →  exit (required when changing directory or config)',
          '/help  →  see all available commands',
        ],
        tip: 'Restart claude after creating CLAUDE.md, commands, agents or MCPs',
      },
      {
        num: '01', title: 'Plan Mode',
        desc: 'Claude designs the architecture before writing any code',
        cmds: [
          'Shift+Tab  →  toggle Plan Mode on / off',
          'Describe your goal  →  Claude plans without executing',
          'Answer Claude\'s questions  →  refine before approving',
          'Shift+Tab  →  return to normal mode (accept edits)',
          '"Execute the approved plan"  →  give the green light',
          'Ctrl+C  →  interrupt if Claude starts coding without a plan',
        ],
        tip: 'Always activate it before large or destructive changes',
      },
      {
        num: '02', title: 'CLAUDE.md',
        desc: 'Persistent instructions Claude reads at the start of every session',
        cmds: [
          'touch CLAUDE.md  →  create in project root',
          '/init  →  auto-generate CLAUDE.md from existing repo',
          '~/.claude/CLAUDE.md  →  global instructions (every session)',
          'Max. 30 instructions — readable in 60 seconds',
          '"don\'t dump": point to /docs/, don\'t copy content inline',
          'Restart claude after editing to reload instructions',
        ],
        tip: 'Verify with: "What do you know about this project and how we work?"',
      },
      {
        num: '03', title: 'Commands, Skills & Hooks',
        desc: 'Three complementary automation layers to extend Claude Code',
        cmds: [
          '** COMMANDS',
          'Reusable prompts you invoke manually with /name $ARGUMENTS',
          'File: .claude/commands/name.md',
          '** SKILLS',
          'Thinking frameworks Claude activates automatically by context',
          'File: .claude/skills/role/skill.md  ·  frontmatter description: required',
          '** HOOKS',
          'Shell scripts the harness runs on lifecycle events (no LLM tokens)',
          'File: .claude/settings.json  ·  PreToolUse · PostToolUse · Stop',
        ],
        tip: 'Hooks consume zero LLM tokens — they are pure mechanical validations',
      },
      {
        num: '04', title: 'MCP Servers',
        desc: 'Connect Claude to external tools: Notion, Supabase, Slack...',
        cmds: [
          'claude mcp add <name> -- npx -y @pkg  →  add server',
          'claude mcp list  →  see active servers in session',
          'claude mcp remove <name>  →  remove server',
          '.mcp.json in root  →  shared project config (commit to git)',
          'node --version  →  verify Node.js ≥ 18 (requirement)',
          'github.com/modelcontextprotocol/servers  →  official catalog',
        ],
        tip: 'With .mcp.json committed, the whole team shares the same MCPs',
      },
      {
        num: '05', title: 'GSD Framework',
        desc: 'Solves context rot by splitting projects into independent phases',
        cmds: [
          'npx get-shit-done-cc@latest  →  install GSD in project',
          '/gsd:new-project  →  map codebase + generate roadmap',
          '/gsd:plan-phase  →  plan current phase (creates PLAN.md)',
          '/gsd:execute-phase  →  execute tasks with atomic commits',
          '/gsd:progress  →  see project status',
          '/gsd:next  →  advance to next phase automatically',
          '/clear  →  run between GSD commands to avoid context drift',
        ],
        tip: 'Context rot = Claude forgets the start of chat after ~10k tokens',
      },
      {
        num: '06', title: 'Sub-agents',
        desc: 'Specialized agents working in parallel or in chain',
        cmds: [
          '.claude/agents/name.md  →  define agent with its own role',
          'frontmatter tools:  →  declare agent\'s allowed tools',
          'frontmatter description:  →  when Claude activates the agent',
          'claude --dangerously-skip-permissions  →  no confirmations',
          'Sequential: 1 terminal · chained output · more quality',
          'Parallel: N simultaneous terminals · 3× speed',
        ],
        tip: 'Best for independent tasks: research, testing, parallel builds',
      },
      {
        num: '07', title: 'RALPH Loop',
        desc: 'Autonomous batch executor with fresh context per iteration',
        cmds: [
          '/plugin install ralph-loop@claude-plugins-official',
          'touch prd.json  →  create task list for RALPH',
          'prd.json: id · description · acceptance_criteria · status',
          'Criteria: "file in /output/" — not "good report"',
          '/ralph --max-iterations N  →  run (N ≈ 3× number of tasks)',
          'Monitor: watch cat prd.json · check /output/ when done',
        ],
        tip: 'GSD = you define the scope.  RALPH = executes the defined tasks.',
      },
    ],
  },
} as const;

// ── Styles ────────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  page: {
    backgroundColor: '#0B0920',
    paddingTop: 28,
    paddingBottom: 36,
    paddingLeft: 26,
    paddingRight: 26,
    fontFamily: 'Inter',
  },
  // Header
  header: {
    alignItems: 'center',
    marginBottom: 14,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoDivider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(167,139,250,0.4)',
    marginLeft: 9,
    marginRight: 9,
  },
  eyebrow: {
    fontSize: 7,
    fontWeight: 700,
    color: 'rgba(235,225,255,0.6)',
    letterSpacing: 3,
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 9,
    fontWeight: 400,
    color: 'rgba(196,181,253,0.65)',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  headerDivider: {
    width: 280,
    height: 1,
    backgroundColor: 'rgba(196,181,253,0.4)',
  },
  // Grid
  grid: {
    flex: 1,
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: 7,
  },
  // Card
  card: {
    flex: 1,
    backgroundColor: '#110D26',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.18)',
    borderRadius: 8,
    padding: 12,
  },
  cardRight: {
    marginLeft: 7,
  },
  // Level header
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  levelPill: {
    backgroundColor: 'rgba(109,40,217,0.5)',
    borderRadius: 3,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 5,
    paddingRight: 5,
    marginRight: 7,
  },
  levelNum: {
    fontSize: 7,
    fontWeight: 700,
    color: '#C4B5FD',
    letterSpacing: 1,
  },
  levelTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#FFFFFF',
    letterSpacing: -0.1,
  },
  // Description
  levelDesc: {
    fontSize: 8.5,
    fontWeight: 400,
    color: 'rgba(196,181,253,0.5)',
    marginBottom: 8,
    lineHeight: 1.4,
  },
  // Commands
  cmdList: {
    marginBottom: 8,
  },
  cmdPill: {
    backgroundColor: 'rgba(99,102,241,0.12)',
    borderRadius: 3,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 7,
    paddingRight: 7,
    marginBottom: 3,
  },
  cmdPillHeader: {
    backgroundColor: 'rgba(109,40,217,0.35)',
    borderRadius: 3,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 7,
    paddingRight: 7,
    marginBottom: 3,
    marginTop: 5,
  },
  cmdPillHeaderFirst: {
    backgroundColor: 'rgba(109,40,217,0.35)',
    borderRadius: 3,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 7,
    paddingRight: 7,
    marginBottom: 3,
  },
  cmdText: {
    fontSize: 8.5,
    fontWeight: 400,
    color: '#A5B4FC',
  },
  cmdTextHeader: {
    fontSize: 7.5,
    fontWeight: 700,
    color: '#C4B5FD',
    letterSpacing: 1.2,
  },
  // Tip
  tip: {
    flexDirection: 'row',
    backgroundColor: 'rgba(150,195,145,0.07)',
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(150,195,145,0.55)',
    borderRadius: 3,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 7,
    paddingRight: 7,
  },
  tipText: {
    fontSize: 8,
    fontWeight: 400,
    color: 'rgba(150,195,145,0.85)',
    lineHeight: 1.4,
    flex: 1,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 18,
    left: 26,
    right: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 7,
    fontWeight: 400,
    color: 'rgba(167,139,250,0.45)',
    letterSpacing: 1.5,
  },
  // Decorative top bar
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#7C3AED',
  },
});

// ── PDF Document ──────────────────────────────────────────────────────────────

function CheatsheetDoc({
  content,
  claudeLogoSrc,
  logoSrc,
}: {
  content: typeof CONTENT[keyof typeof CONTENT];
  claudeLogoSrc: string;
  logoSrc: string;
}) {
  const rows = [
    [content.levels[0], content.levels[1]],
    [content.levels[2], content.levels[3]],
    [content.levels[4], content.levels[5]],
    [content.levels[6], content.levels[7]],
  ] as const;

  return (
    <Document>
      <Page size={[595, 1490]} style={S.page}>
        {/* Decorative top bar */}
        <View style={S.topBar} />

        {/* Header */}
        <View style={S.header}>
          <View style={S.logoRow}>
            <Image src={claudeLogoSrc} style={{ width: 18, height: 18 }} />
            <View style={S.logoDivider} />
            <Image src={logoSrc} style={{ width: 96, height: 23 }} />
          </View>
          <Text style={S.eyebrow}>{content.eyebrow}</Text>
          <Text style={S.title}>{content.title}</Text>
          <Text style={S.subtitle}>{content.subtitle}</Text>
          <View style={S.headerDivider} />
        </View>

        {/* Grid */}
        <View style={S.grid}>
          {rows.map((row, rowIdx) => (
            <View key={rowIdx} style={S.gridRow}>
              {row.map((level, colIdx) => (
                <View key={colIdx} style={colIdx === 1 ? [S.card, S.cardRight] : S.card}>
                  {/* Level header */}
                  <View style={S.levelHeader}>
                    <View style={S.levelPill}>
                      <Text style={S.levelNum}>{level.num}</Text>
                    </View>
                    <Text style={S.levelTitle}>{level.title}</Text>
                  </View>

                  {/* Description */}
                  <Text style={S.levelDesc}>{level.desc}</Text>

                  {/* Commands */}
                  <View style={S.cmdList}>
                    {level.cmds.map((cmd, cmdIdx) => {
                      const isHeader = cmd.startsWith('** ');
                      const text = isHeader ? cmd.slice(3) : cmd;
                      return (
                        <View
                          key={cmdIdx}
                          style={isHeader ? (cmdIdx === 0 ? S.cmdPillHeaderFirst : S.cmdPillHeader) : S.cmdPill}
                        >
                          <Text style={isHeader ? S.cmdTextHeader : S.cmdText}>{text}</Text>
                        </View>
                      );
                    })}
                  </View>

                  {/* Tip */}
                  <View style={S.tip}>
                    <Text style={S.tipText}>{level.tip}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={S.footer} fixed>
          <Text style={S.footerText}>zalesmachine.com</Text>
          <Text style={S.footerText}>claude.ai/code</Text>
        </View>
      </Page>
    </Document>
  );
}

// ── Route Handler ─────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') === 'en' ? 'en' : 'es';
    const content = CONTENT[lang];

    const logoData      = await readFile(join(process.cwd(), 'public/zalesmachine-logo.png'));
    const logoSrc       = `data:image/png;base64,${logoData.toString('base64')}`;
    const claudeLogoData = await readFile(join(process.cwd(), 'public/claude-logo.png'));
    const claudeLogoSrc  = `data:image/png;base64,${claudeLogoData.toString('base64')}`;

    const buffer = await renderToBuffer(
      <CheatsheetDoc content={content} claudeLogoSrc={claudeLogoSrc} logoSrc={logoSrc} />
    );

    const filename = lang === 'en' ? 'claude-code-cheatsheet.pdf' : 'guia-claude-code.pdf';

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    });
  } catch (e) {
    console.error('[cheatsheet route error]', e);
    return new Response('Internal server error', { status: 500 });
  }
}
