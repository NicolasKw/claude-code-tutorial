import type { LevelContent } from '@/lib/types/tutorial';
import { LEVEL_CONTENT_EN } from './levels.en';

export const LEVEL_CONTENT: LevelContent[] = [
  // ─── Level 0: Chatbot ────────────────────────────────────────────────────
  {
    level: 0,
    title: 'Chatbot',
    subtitle: 'El punto de entrada. Claude Code como chat interactivo, sin estructura ni contexto previo.',
    summary:
      'Instalaste Claude Code, lo ejecutaste en modo chat, y verificaste que responde. Tenés un investigador de startups IA corriendo en tu propia máquina.',
    sourceUrl: 'https://code.claude.com/docs/en/overview',
    steps: [
      {
        title: 'Instala Claude Code',
        explanation:
          'Claude Code se instala con un comando nativo — no necesitás instalar npm ni ningún otro prerrequisito. Abrí la terminal de tu sistema y ejecutá:',
        codeBlock: {
          code: 'curl -fsSL https://claude.ai/install.sh | bash',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: '¿Cómo abro la terminal?',
            error: 'No sé qué es ni cómo abrirla',
            solution:
              'Mac: presioná Cmd+Espacio, escribí "Terminal" y presioná Enter. Windows: presioná la tecla Windows, escribí "PowerShell" y abrilo. Linux: buscá "Terminal" en tus aplicaciones.',
          },
          {
            trigger: 'Si estás en Windows',
            error: 'curl no funciona o el script .sh no es compatible',
            solution:
              'En Windows PowerShell ejecutá: irm https://claude.ai/install.ps1 | iex\n\nEn Windows CMD ejecutá: curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd',
          },
          {
            trigger: 'Si ves "curl: command not found"',
            error: 'curl no está instalado en tu sistema',
            solution:
              'En Ubuntu/Debian: sudo apt install curl\nEn macOS curl viene preinstalado — si falta, instalá Xcode Command Line Tools: xcode-select --install',
          },
        ],
      },
      {
        title: 'Instala Visual Studio Code',
        explanation:
          'La terminal funciona, pero Visual Studio Code es mucho más cómodo para trabajar con Claude Code. Te da un editor de código, explorador de archivos y terminal integrada en un solo lugar. Descargalo desde code.visualstudio.com, instalalo, y luego buscá la extensión "Claude Code" en el marketplace de VSC para tener Claude Code integrado directamente en el editor.',
        errorCallouts: [
          {
            trigger: '¿Ya tenés un editor instalado?',
            error: 'Uso otro editor como Cursor, Zed o WebStorm',
            solution:
              'Claude Code funciona desde cualquier terminal. Si ya tenés un editor con terminal integrada, podés saltar este paso. La extensión oficial de Claude Code existe para VS Code y JetBrains (WebStorm, IntelliJ, etc.).',
          },
        ],
      },
      {
        title: 'Autenticá con tu cuenta Anthropic',
        explanation:
          'Claude Code necesita una clave de API de Anthropic para funcionar. El comando login abre el browser para que te autentiques con tu cuenta.',
        codeBlock: {
          code: 'claude login',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si el browser no se abre',
            error: 'La autenticación no inicia automáticamente',
            solution:
              'Copiá la URL que aparece en la terminal y pegala manualmente en el browser. La URL empieza con https://claude.ai/...',
          },
        ],
      },
      {
        title: 'Iniciá Claude Code',
        explanation: 'Abrí una nueva sesión de Claude Code en la terminal.',
        codeBlock: {
          code: 'claude',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si ves este error',
            error: 'command not found: claude',
            solution:
              'El instalador nativo agrega claude al PATH automáticamente, pero a veces la terminal actual no lo refleja todavía. Cerrá y volvé a abrir la terminal, o ejecutá: source ~/.zshrc (Mac) / source ~/.bashrc (Linux).',
          },
        ],
      },
      {
        title: 'Iniciá una conversación en modo chat',
        explanation:
          'Escribí cualquier pregunta para verificar que la conexión funciona.',
        codeBlock: {
          code: '"¿Hay mercado para una app de gestión de inventario para restaurantes?"',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Aprendé los comandos esenciales de navegación',
        explanation:
          'Antes de avanzar, conocé los 4 comandos que más vas a usar en el resto del tutorial. Los comandos con `/` se escriben directamente en el prompt de Claude Code:',
        codeBlock: {
          code: '! mkdir mi-carpeta    # ejecutar terminal sin salir de Claude Code\n/clear                # limpiar el contexto — antes de empezar un task nuevo\n/exit                 # salir de Claude Code (también Ctrl+C)\n/resume               # retomar la sesión anterior con todo su contexto',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: '¿Cuándo uso /clear vs /exit?',
            error: '¿no es lo mismo?',
            solution:
              '/clear limpia el historial de la conversación pero Claude sigue corriendo — ideal para empezar un task nuevo sin que el contexto anterior interfiera. /exit (o Ctrl+C) cierra Claude Code completamente — lo necesitás cuando tenés que cambiar de directorio (cd no funciona con !) o cuando creaste nuevos archivos de configuración como CLAUDE.md, commands, agents o MCPs que Claude necesita cargar desde cero al reiniciar.',
          },
        ],
      },
    ],
  },

  // ─── Level 1: Plan Mode ──────────────────────────────────────────────────
  {
    level: 1,
    title: 'Plan Mode',
    subtitle: 'Claude diseña la arquitectura antes de escribir código. Vos revisás, pedís cambios, y recién ahí se ejecuta.',
    sourceUrl: 'https://code.claude.com/docs/en/common-workflows#use-plan-mode-for-safe-code-analysis',
    summary:
      'Usaste Plan Mode para diseñar la estructura de tu agente antes de escribir código. Aprendiste el workflow de Boris: planificar → aprobar → ejecutar de un solo shot.',
    steps: [
      {
        title: 'Creá la carpeta de tu proyecto',
        explanation:
          'Antes de usar Claude Code para construir, necesitás un directorio de trabajo. Este será el hogar de tu agente de investigación de startups.',
        setupBlock: {
          terminalCode: 'mkdir mi-agente-startup && cd mi-agente-startup',
          manualInstructions: 'Creá una nueva carpeta llamada "mi-agente-startup" desde el Finder (Mac) o el Explorador de Archivos (Windows). Luego abrila en VS Code: Archivo → Abrir Carpeta.',
        },
        errorCallouts: [
          {
            trigger: 'Si venís del Level 0 con Claude Code abierto',
            error: '¿necesito salir antes de ejecutar este comando?',
            solution:
              'Sí, en este caso necesitás salir. El comando cd cambia de directorio y no funciona con el prefijo ! desde dentro de Claude Code. Salí con /exit o Ctrl+C, ejecutá el comando en tu terminal del sistema, y volvé a iniciar Claude Code desde la nueva carpeta.',
          },
          {
            trigger: 'Si ves este error',
            error: 'mkdir: mi-agente-startup: File exists',
            solution:
              'Ya existe una carpeta con ese nombre. Usá un nombre diferente (ej: mi-agente-v2) o eliminá la carpeta existente si no la necesitás: rm -rf mi-agente-startup',
          },
        ],
      },
      {
        title: 'Iniciá Claude Code',
        explanation: 'Abrí una nueva sesión de Claude Code en la terminal.',
        codeBlock: {
          code: 'claude',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Activá Plan Mode con Shift+Tab',
        explanation:
          'Plan Mode no es un comando — es un modo de sesión. Presioná Shift+Tab para ciclarlo. En la parte inferior del terminal vas a ver el indicador cambiar de "accept edits" a "plan mode". En Plan Mode, Claude es de solo lectura: propone y pregunta, pero no escribe ni ejecuta nada hasta que vos lo aprobés.',
        errorCallouts: [
          {
            trigger: 'Si Shift+Tab no funciona',
            error: 'El modo no cambia al presionar Shift+Tab',
            solution:
              'Algunos terminales interceptan Shift+Tab. Probá en la terminal integrada de VS Code. También podés escribir /plan al inicio de tu mensaje para activarlo desde el chat.',
          },
        ],
      },
      {
        title: 'Describí tu objetivo',
        explanation:
          'Con Plan Mode activo, escribí tu objetivo en lenguaje natural. Sé claro sobre qué querés construir, pero no te preocupes por los detalles técnicos — Claude va a hacer las preguntas necesarias. Por ejemplo, escribí:',
        codeBlock: {
          code: '"Quiero una web app donde el usuario ingresa una idea de startup\ny recibe un reporte de mercado con competidores, TAM y oportunidades"',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si Claude empieza a escribir código inmediatamente',
            error: 'Claude ignoró Plan Mode y empezó a ejecutar',
            solution:
              'Verificá que el indicador en la parte inferior diga "plan mode" antes de enviar. Si ya ejecutó algo, interrumpilo con Ctrl+C, reiniciá con /clear y activá Plan Mode antes de describir el objetivo.',
          },
        ],
      },
      {
        title: 'Respondé las preguntas de Claude',
        explanation:
          'Claude tiene una herramienta interna llamada "ask user questions" que usa en Plan Mode para aclarar supuestos antes de planificar. Va a preguntarte cosas como: ¿qué lenguaje de programación preferís? ¿querés persistencia en base de datos? ¿cómo se van a entregar los reportes? Respondé con detalle — estas respuestas son lo que hace que la ejecución posterior sea precisa. Así es exactamente como trabaja Boris Churnney, el creador de Claude Code: no toma ninguna acción de ejecución hasta tener un plan claro.',
        errorCallouts: [
          {
            trigger: 'Si Claude no hace preguntas',
            error: 'Claude genera el plan directamente sin preguntar',
            solution:
              'Claude puede hacer esto si el objetivo era muy específico. Revisá el plan que generó — si parece completo y refleja tu intención, podés continuar. Si falta contexto, agregalo: "Antes de continuar, ¿podés preguntarme sobre X?"',
          },
        ],
      },
      {
        title: 'Aprobá el plan y ejecutá',
        explanation:
          'Una vez que el plan refleje lo que querés, salí de Plan Mode presionando Shift+Tab de nuevo (volvé a "accept edits"). Ahora dale a Claude un único prompt de ejecución. Este es el "one-shot pattern": con el plan claro, Claude puede ejecutar todo en un solo paso sin idas y vueltas. Escribí:',
        codeBlock: {
          code: '"Ejecutá el plan aprobado"',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si Claude pide confirmación para cada archivo',
            error: 'Claude pregunta "Do you want to create this file?" repetidamente',
            solution:
              'Escribí "y" o "yes" para aprobar cada archivo, o "yes to all" para aprobar todos de una vez. Este es un comportamiento normal de seguridad en la primera sesión.',
          },
        ],
      },
    ],
  },

  // ─── Level 2: CLAUDE.md ──────────────────────────────────────────────────
  {
    level: 2,
    title: 'CLAUDE.md',
    subtitle: 'Un archivo de instrucciones que Claude lee al inicio de cada sesión. Tu agente recuerda tu startup sin que se lo repitas cada vez.',
    sourceUrl: 'https://code.claude.com/docs/en/memory#claude-md-files',
    summary:
      'Creaste un CLAUDE.md con el framework de 5 preguntas. Claude ahora conoce tu startup, las reglas de investigación y las convenciones del proyecto desde el primer mensaje de cada sesión.',
    steps: [
      {
        title: 'Entendé el framework de 5 preguntas',
        explanation:
          'CLAUDE.md es el onboarding de tu agente — como el manual que le darías a un empleado nuevo. El contenido más efectivo responde estas 5 preguntas: (1) ¿Qué es esto? Una línea sobre qué hace el proyecto. (2) ¿Cómo funciona? Los pasos exactos del proceso. (3) ¿Cuáles son las reglas? Non-negotiables y formato de outputs. (4) ¿Qué errores no repetir? Edge cases y gotchas. (5) ¿Cómo trabajamos? Convenciones de archivos y carpetas. La regla de oro: mantenerlo corto. Si no se puede leer en 60 segundos, hay demasiado.',
        errorCallouts: [
          {
            trigger: '¿Cuánto es demasiado?',
            error: 'No sé cuánto contenido poner',
            solution:
              'Menos de 30 instrucciones totales. Si necesitás más detalle en algún punto, creá un archivo separado y referencialó: "Para el framework de análisis completo, ver /docs/research-framework.md". Esto se llama el "don\'t dump trick" — CLAUDE.md apunta a los detalles, no los contiene.',
          },
        ],
      },
      {
        title: 'Creá el archivo CLAUDE.md',
        explanation:
          'Creá CLAUDE.md en la raíz de tu proyecto. En el siguiente paso vas a completar su contenido. Si Claude Code está activo en tu sesión, podés ejecutarlo directamente con el prefijo `!`: `! touch CLAUDE.md`.',
        setupBlock: {
          terminalCode: 'touch CLAUDE.md',
          manualInstructions: 'En VS Code, clic derecho en el explorador de archivos (panel izquierdo) → New File → nombralo "CLAUDE.md". En Windows también podés ir a la carpeta del proyecto en el Explorador de Archivos, clic derecho → Nuevo → Documento de Texto → renombrarlo a "CLAUDE.md".',
        },
        errorCallouts: [],
      },
      {
        title: 'Escribí las instrucciones del proyecto',
        explanation:
          'Abrí CLAUDE.md y completá las 5 secciones con el contexto de tu agente de investigación de startups.',
        codeBlock: {
          code: '# Agente de Investigación de Startups\n\nEste proyecto analiza oportunidades de mercado para fundadores: competidores, TAM, tendencias y gaps.\n\n## Proceso\n1. Recibir idea o vertical de mercado del usuario\n2. Buscar competidores directos e indirectos\n3. Estimar tamaño de mercado (TAM/SAM/SOM)\n4. Identificar gaps y oportunidades\n5. Generar reporte en /output/[fecha]-[idea].md\n\n## Reglas\n- Siempre citar fuentes\n- Nunca inventar datos — si no encontrás info, decilo explícitamente\n- Para el framework de análisis completo, ver /docs/research-framework.md\n\n## Errores a evitar\n- No confundir TAM con SAM\n- Incluir siempre competidores indirectos, no solo directos\n\n## Convenciones\n- Reportes en /output/ con prefijo de fecha: YYYY-MM-DD-nombre.md\n- Datos crudos en /data/',
          language: 'markdown',
        },
        errorCallouts: [
          {
            trigger: 'Si Claude no parece leer CLAUDE.md',
            error: 'Claude responde sin mencionar el contexto del proyecto',
            solution:
              'Verificá que CLAUDE.md esté en el directorio raíz del proyecto (el mismo directorio donde ejecutás claude). Reiniciá la sesión con /clear para que Claude vuelva a cargar el archivo.',
          },
        ],
      },
      {
        title: 'Iniciá Claude Code',
        explanation:
          'Claude lee CLAUDE.md al inicio de cada sesión — necesitás reiniciar para que cargue el archivo que acabás de crear. Si tenés Claude Code activo, salí primero con `/exit` o Ctrl+C, y luego ejecutá:',
        codeBlock: {
          code: 'claude',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Verificá que Claude lee el archivo',
        explanation:
          'Preguntale sobre el proyecto. Debería mencionar el contenido de CLAUDE.md sin que vos se lo digas.',
        codeBlock: {
          code: '"¿Qué sabés sobre este proyecto y cómo trabajamos?"',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: '¿Qué hago cuando Claude comete un error?',
            error: 'Claude no siguió una regla del CLAUDE.md',
            solution:
              'Corregilo en el momento y luego actualizá CLAUDE.md para que no se repita. Podés pedirle directamente: "Agregá esta regla a CLAUDE.md: nunca usar X." Claude lo hará por vos. Este es el mismo proceso que usa Boris — arreglar errores en tiempo real y versionar el archivo en Git.',
          },
          {
            trigger: '¿Tengo un proyecto existente?',
            error: 'Quiero generar CLAUDE.md automáticamente desde mi código',
            solution:
              'Ejecutá /init dentro de Claude Code y va a leer tu repo para generar un CLAUDE.md automáticamente. Después solo tenés que revisar y eliminar lo que no corresponde.',
          },
        ],
      },
    ],
  },

  // ─── Level 3: Commands, Skills y Hooks ───────────────────────────────────
  {
    level: 3,
    title: 'Commands, Skills y Hooks',
    subtitle: 'Commands para atajos reutilizables, Skills para conocimiento especializado, y Hooks para automatización sin tokens.',
    sourceUrl: 'https://code.claude.com/docs/en/skills#create-your-first-skill',
    summary:
      'Configuraste un comando con argumentos dinámicos, un skill de análisis y un hook de validación. La distinción clave: Skills = cómo piensa Claude. Hooks = qué pasa automáticamente. Commands = lo que vos disparás.',
    steps: [
      {
        title: 'Creá un comando con argumentos dinámicos',
        explanation:
          'Los commands son prompts guardados que podés invocar con /nombre. Lo que los hace poderosos es `$ARGUMENTS` — un placeholder que reemplazás al invocar el comando. Así un mismo command sirve para cualquier startup o vertical de mercado. Si Claude Code está activo, podés crear los archivos desde el prompt: `! mkdir -p .claude/commands && touch .claude/commands/research.md`.',
        setupBlock: {
          terminalCode: 'mkdir -p .claude/commands\ntouch .claude/commands/research.md',
          manualInstructions: 'En VS Code, creá la carpeta ".claude/commands" dentro de tu proyecto (clic derecho en el explorador → New Folder). Luego creá el archivo "research.md" dentro de esa carpeta y pegá el contenido que se muestra abajo.',
          fileContents: [
            {
              filename: '.claude/commands/research.md',
              language: 'markdown',
              code: 'Investigá el mercado para: $ARGUMENTS\n\nAnalizá:\n1. Competidores directos e indirectos (mínimo 5)\n2. Tamaño de mercado (TAM/SAM/SOM con fuentes)\n3. Tendencias recientes del sector\n4. Gaps y oportunidades no cubiertas\n\nGuardá el reporte en /output/ con el formato de fecha del CLAUDE.md.',
            },
          ],
        },
        errorCallouts: [
          {
            trigger: 'Si Claude no reconoce el comando',
            error: '/research no aparece como opción al tipear /',
            solution:
              'Cerrá la sesión de Claude Code con Ctrl+C y reabrila con claude. Los commands se cargan al inicio de la sesión, no en tiempo real.',
          },
        ],
      },
      {
        title: 'Iniciá Claude Code',
        explanation:
          'Los commands se cargan al inicio de la sesión — necesitás reiniciar para que Claude reconozca el nuevo `/research`. Si tenés Claude Code activo, salí con `/exit` o Ctrl+C y luego ejecutá:',
        codeBlock: {
          code: 'claude',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Probá el comando con argumentos',
        explanation:
          'Invocá el comando pasando una idea de startup como argumento. Claude va a reemplazar $ARGUMENTS con lo que escribiste. Si venís de pasos anteriores con contexto acumulado, hacé `/clear` antes para que la investigación empiece con un contexto limpio.',
        codeBlock: {
          code: '/research "app de delivery para mascotas en LATAM"',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si el reporte no se guarda en /output/',
            error: 'Claude generó el análisis en el chat pero no creó el archivo',
            solution:
              'Agregá más especificidad al command: "Guardá el reporte en /output/[FECHA]-[nombre-idea].md usando la herramienta de escritura de archivos." Los commands mejoran con instrucciones más explícitas.',
          },
        ],
      },
      {
        title: 'Creá un Skill de análisis',
        explanation:
          'Los Skills son diferentes a los commands: Claude los carga automáticamente según el contexto, sin que vos los invoques. Son conocimiento especializado — un framework de análisis, una metodología, ejemplos de referencia. Creá un skill que define cómo tu agente debe estructurar el análisis de mercado. Si Claude Code está activo, usá: `! mkdir -p .claude/skills/startup-analyst && touch .claude/skills/startup-analyst/skill.md`.',
        setupBlock: {
          terminalCode: 'mkdir -p .claude/skills/startup-analyst\ntouch .claude/skills/startup-analyst/skill.md',
          manualInstructions: 'En VS Code, creá las carpetas ".claude/skills/startup-analyst" (anidadas). Luego creá el archivo "skill.md" dentro de "startup-analyst" y pegá el contenido que se muestra abajo.',
          fileContents: [
            {
              filename: '.claude/skills/startup-analyst/skill.md',
              language: 'markdown',
              code: '---\ndescription: Framework de análisis para investigación de mercados de startups. Usar cuando el usuario pide analizar un mercado, validar una idea o investigar competidores.\n---\n\n# Startup Analyst\n\nSiempre estructurá el análisis en este orden:\n1. **Mapa de competidores**: directos (mismo problema, misma solución), indirectos (mismo problema, distinta solución), sustitutos (comportamiento alternativo)\n2. **Jobs to be done**: ¿qué trabajo está tratando de hacer el usuario final?\n3. **TAM/SAM/SOM**: de arriba hacia abajo con fuentes, no inventar cifras\n4. **Gaps**: qué no cubre ningún competidor actual\n5. **Señales de mercado**: financiamiento reciente, tendencias de búsqueda, cambios regulatorios',
            },
          ],
        },
        errorCallouts: [
          {
            trigger: 'Si Claude no aplica el skill automáticamente',
            error: 'Claude analiza sin seguir el framework del skill',
            solution:
              'La clave es la descripción en el frontmatter — "usar cuando..." tiene que ser preciso para que Claude entienda cuándo activarlo. También podés invocarlo manualmente: "usá el skill startup-analyst para esto."',
          },
          {
            trigger: '¿Querés más skills?',
            error: 'Quiero skills que ya existen para no crearlos desde cero',
            solution:
              'Explorá skillsmp.com — una comunidad de skills para Claude Code. Podés clonar cualquier skill directamente: git clone [url] .claude/skills/[nombre]. Hay skills para humanizar texto, revisar código, hacer SEO y mucho más.',
          },
        ],
      },
      {
        title: 'Configurá un Hook de validación',
        explanation:
          'Los Hooks son triggers automáticos que se ejecutan cuando Claude hace algo. No usan tokens LLM — son scripts puros, mecánicos. Perfectos para validaciones que siempre deben cumplirse. Creá un hook que verifica que cada reporte de investigación tenga las secciones obligatorias. Si Claude Code está activo, creá el archivo con: `! touch .claude/settings.json`.',
        setupBlock: {
          terminalCode: 'touch .claude/settings.json',
          manualInstructions: 'En VS Code, creá el archivo "settings.json" dentro de la carpeta ".claude/" de tu proyecto y pegá el contenido que se muestra abajo.',
          fileContents: [
            {
              filename: '.claude/settings.json',
              language: 'json',
              code: '{\n  "hooks": {\n    "PostToolUse": [\n      {\n        "matcher": "Write",\n        "hooks": [\n          {\n            "type": "command",\n            "command": "python3 -c \\"import sys,json; d=json.load(sys.stdin); p=d.get(\'tool_input\',{}).get(\'path\',\'\'); c=open(p).read() if \'/output/\' in p else None; missing=[s for s in [\'Competidores\',\'TAM\',\'Gaps\'] if s not in c] if c else []; print(\'Secciones faltantes:\', missing) if missing else (print(\'Reporte completo\') if c else None)\\" 2>/dev/null || true"\n          }\n        ]\n      }\n    ]\n  }\n}',
            },
          ],
        },
        errorCallouts: [
          {
            trigger: 'Si el hook parece muy complejo',
            error: 'No entiendo la sintaxis del settings.json',
            solution:
              'No necesitás escribir los hooks manualmente. Pedile a Claude: "Creá un hook en .claude/settings.json que después de escribir cualquier archivo en /output/ verifique que el archivo contenga las palabras Competidores, TAM y Gaps." Claude lo escribe por vos.',
          },
        ],
      },
      {
        title: 'Entendé la distinción clave',
        explanation:
          'La diferencia entre los tres es fundamental. Skills = cómo piensa Claude: conocimiento cargado automáticamente según relevancia, sin que vos lo invoques. Hooks = qué pasa automáticamente después de que Claude actúa: sin tokens LLM, pura mecánica, siempre consistente. Commands = lo que vos disparás manualmente: atajos para tareas repetitivas con $ARGUMENTS para inputs dinámicos.',
        errorCallouts: [
          {
            trigger: '¿Cuándo uso cada uno?',
            error: 'No sé si algo debería ser un skill, un hook o un command',
            solution:
              '¿Necesitás que Claude lo sepa siempre sin pedírselo? → Skill. ¿Es una validación mecánica que no requiere razonamiento? → Hook. ¿Es una tarea que vos iniciás manualmente cuando la necesitás? → Command.',
          },
        ],
      },
    ],
  },

  // ─── Level 4: MCP Servers ────────────────────────────────────────────────
  {
    level: 4,
    title: 'MCP Servers',
    subtitle: 'Claude conectado a tus herramientas externas. Lee datos de Notion, busca en la web, y escribe los resultados de vuelta — sin que vos escribas el código de integración.',
    sourceUrl: 'https://code.claude.com/docs/en/mcp#installing-mcp-servers',
    summary:
      'Conectaste MCP servers a Claude Code. Tu agente ahora puede buscar en internet para enriquecer el análisis y guardar reportes directamente en Notion — bidireccional, sin código de integración.',
    steps: [
      {
        title: 'Entendé qué es un MCP Server',
        explanation:
          'MCP (Model Context Protocol) es el protocolo que convierte a Claude en un agente que actúa en tus apps. Un MCP server es un bridge entre Claude Code y una herramienta externa. Hay miles de MCP servers disponibles — Notion, Slack, Google, HubSpot, bases de datos, y más. La clave: MCP no es solo lectura. Claude puede leer datos y escribir de vuelta a tus apps.',
        errorCallouts: [
          {
            trigger: 'Parece complicado',
            error: 'No entiendo para qué sirve MCP',
            solution:
              'Pensá en MCP servers como plugins que le dan superpoderes a Claude. El servidor de filesystem le da capacidad de leer/escribir archivos. Un servidor de Notion le permite leer páginas y crear nuevas. Claude sabe cómo usarlos automáticamente — vos solo los conectás.',
          },
        ],
      },
      {
        title: 'Iniciá Claude Code',
        explanation:
          'Si ya tenés Claude Code activo desde el nivel anterior, podés limpiar el contexto con `/clear` en lugar de salir y volver a entrar. Si preferís empezar completamente desde cero, salí con `/exit` y ejecutá:',
        codeBlock: {
          code: 'claude',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Agregá el MCP de filesystem',
        explanation:
          'Para agregar MCP servers usás el comando `claude mcp add` desde la terminal. Como Claude ya está corriendo, abrí una nueva pestaña de terminal y ejecutá el comando de abajo. Después reiniciá Claude para que tome los cambios. Empezamos con el servidor de filesystem — da acceso a archivos del proyecto y es el punto de entrada más simple.',
        codeBlock: {
          code: '# En una nueva pestaña de terminal (no en el chat de Claude):\nclaude mcp add filesystem -- npx -y @anthropic-ai/mcp-filesystem --dir .\n\n# Verificá que quedó configurado:\nclaude mcp list',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si ves este error',
            error: 'Error: MCP server failed to start',
            solution:
              'Verificá que tu versión de Node.js sea 18 o superior: node --version  Los MCP servers requieren Node 18+. Si tenés una versión anterior, actualizá con: nvm install 18 && nvm use 18',
          },
        ],
      },
      {
        title: 'Iniciá Claude Code',
        explanation:
          'Los MCP servers se cargan al inicio de la sesión — necesitás reiniciar para que Claude tenga acceso al filesystem. Si tenés Claude Code activo, salí con `/exit` o Ctrl+C y luego ejecutá:',
        codeBlock: {
          code: 'claude',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Probá la lectura de datos',
        explanation:
          'Verificá que el MCP de filesystem funciona pidiéndole a Claude que use las herramientas MCP explícitamente.',
        codeBlock: {
          code: '"Usá el MCP de filesystem para listar todos los reportes\nen /output/ y decime cuáles análisis ya hice"',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si Claude no usa las herramientas MCP',
            error: 'Claude responde sin invocar el MCP server',
            solution:
              'Verificá que el servidor esté configurado correctamente con: claude mcp list  Debería aparecer "filesystem" en la lista. Si no aparece, repetí el paso anterior de configuración.',
          },
        ],
      },
      {
        title: 'Agregá un MCP de Notion para guardar research',
        explanation:
          'Acá es donde MCP se vuelve realmente poderoso: la conexión es bidireccional. Claude puede leer tu base de datos de ideas en Notion, hacer el análisis, y escribir el reporte directamente en una nueva página — sin que vos copies ni pegues nada. Creá un archivo `.mcp.json` en la raíz del proyecto con tu Personal Access Token, y después reiniciá Claude Code. Si Claude Code está activo, creá el archivo con: `! touch .mcp.json`.',
        setupBlock: {
          terminalCode: 'touch .mcp.json',
          manualInstructions: 'En VS Code, creá el archivo ".mcp.json" en la carpeta principal del proyecto (clic derecho en el explorador → New File). Pegá el contenido de abajo y reemplazá "tu-notion-integration-token" con tu token real.',
          fileContents: [
            {
              filename: '.mcp.json',
              language: 'json',
              code: '{\n  "mcpServers": {\n    "notion": {\n      "command": "npx",\n      "args": ["-y", "@anthropic-ai/mcp-notion"],\n      "env": {\n        "NOTION_TOKEN": "tu-notion-integration-token"\n      }\n    }\n  }\n}',
            },
          ],
        },
        errorCallouts: [
          {
            trigger: '¿Dónde consigo el token de Notion?',
            error: 'No sé cómo obtener un NOTION_TOKEN',
            solution:
              'En Notion: Settings → Integrations → Create new integration. Dale acceso a las páginas que quieras. Copiá el "Internal Integration Secret" y usalo como NOTION_TOKEN. Luego conectá la integración a las páginas específicas desde Notion.',
          },
          {
            trigger: '¿Hay otros MCP servers?',
            error: 'Quiero conectar otras apps además de Notion',
            solution:
              'Hay miles de MCP servers disponibles. Buscá en github.com/modelcontextprotocol/servers para el repositorio oficial con servidores para Slack, Google Drive, HubSpot, bases de datos y más. También podés pedirle a Claude: "/mcp add [nombre-del-servicio]" y lo configura por vos.',
          },
        ],
      },
      {
        title: 'Iniciá Claude Code',
        explanation:
          'El MCP de Notion se carga al inicio de la sesión — necesitás reiniciar para que Claude lo reconozca. Si tenés Claude Code activo, salí con `/exit` o Ctrl+C y luego ejecutá:',
        codeBlock: {
          code: 'claude',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Creá la base de datos de Ideas en Notion',
        explanation:
          'Ya tenés el MCP de Notion conectado — pedile a Claude que cree la base de datos por vos. Claude va a usar el MCP para crear la página, definir las columnas y agregar una idea de ejemplo:',
        codeBlock: {
          code: '"Usá el MCP de Notion para crear una base de datos llamada\n\'Ideas\' con estas columnas: Idea (título), Estado (select\ncon opciones: Pendiente, En proceso, Completado).\nAgregá una fila de ejemplo con una idea de startup\ny estado Pendiente."',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si Claude dice que no tiene acceso a Notion',
            error: 'Error de permisos aunque el token esté configurado',
            solution:
              'La integración necesita estar habilitada en la página específica de Notion. En Notion, abrí la página donde querés la base de datos → "..." (arriba a la derecha) → Connections → seleccioná tu integración. Sin este paso, el token existe pero Claude no tiene acceso a esa página.',
          },
        ],
      },
      {
        title: 'Ejecutá un flujo de investigación completo',
        explanation:
          'Ahora combiná todo: Claude lee una idea de tu Notion, investiga el mercado, y escribe el reporte de vuelta en Notion. Este es el loop completo: leer datos → analizar → escribir resultados.',
        codeBlock: {
          code: '"Leé las ideas de la base de datos Ideas en Notion,\ntomá la primera que tenga estado Pendiente,\ninvestigá el mercado usando el command /research,\ny guardá el reporte en la página de Notion de esa idea"',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si Claude solo lee pero no escribe de vuelta',
            error: 'Claude hace el análisis pero no actualiza Notion',
            solution:
              'Sé explícito: "después de hacer el análisis, usá el MCP de Notion para crear una nueva página con el reporte." MCP es bidireccional, pero Claude necesita que le digas cuándo escribir de vuelta.',
          },
        ],
      },
    ],
  },

  // ─── Level 5: GSD Framework ──────────────────────────────────────────────
  {
    level: 5,
    title: 'GSD Framework',
    subtitle: 'La solución al "context rot". Un framework que divide proyectos complejos en fases independientes, cada una con su propio plan, ejecución y verificación.',
    sourceUrl: 'https://code.claude.com/docs/en/best-practices#explore-first-then-plan-then-code',
    summary:
      'Usaste GSD para agregar historial de búsquedas a tu web app por fases con plan, ejecución y verificación. Entendiste el problema de context rot y cómo GSD lo resuelve guardando el estado en archivos.',
    steps: [
      {
        title: 'El problema: context rot',
        explanation:
          'Claude tiene una ventana de contexto limitada. A partir de ~10,000 tokens (unas 7,500 palabras de conversación), Claude empieza a "olvidar" el principio — esto se llama context rot. Podés verlo en la barra de contexto en la parte inferior del terminal: cuando llega al 95%, Claude comprime todo en resúmenes y la precisión cae. GSD resuelve esto guardando el contexto en archivos en lugar de mantenerlo en memoria. Cada fase tiene su propio archivo de plan, ejecución y verificación — Claude nunca necesita tener todo en contexto al mismo tiempo.',
        errorCallouts: [
          {
            trigger: '¿Cuándo necesito GSD?',
            error: 'No sé si mi proyecto es suficientemente grande para GSD',
            solution:
              'Usá GSD cuando tu proyecto requiere más de una sesión o cuando tenés más de 3 pasos interdependientes. Para tareas simples como "investigá esta startup", alcanza con el command /research. Para proyectos como "armá una estrategia de investigación para Q2 con 20 mercados", necesitás GSD.',
          },
        ],
      },
      {
        title: 'Iniciá Claude Code',
        explanation:
          'Si ya tenés Claude Code activo desde el nivel anterior, podés limpiar el contexto con `/clear` en lugar de salir y volver a entrar. Si preferís empezar desde cero, salí con `/exit` y ejecutá:',
        codeBlock: {
          code: 'claude',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Instalá GSD',
        explanation:
          'GSD se instala con npx desde tu terminal (no dentro de Claude Code). Ejecutá este comando en la carpeta de tu proyecto:',
        codeBlock: {
          code: 'npx get-shit-done-cc@latest',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si npx get-shit-done-cc@latest falla',
            error: 'Versión desactualizada en npm',
            solution:
              'Instalalo directamente desde GitHub: npx github:gsd-build/get-shit-done — esto instala la última versión desde el código fuente y funciona en Mac, Windows y Linux.',
          },
        ],
      },
      {
        title: 'Reiniciá Claude Code',
        explanation:
          'GSD carga sus skills al inicio de la sesión — necesitás reiniciar para que los comandos `/gsd:*` estén disponibles. Si tenés Claude Code activo, salí con `/exit` o Ctrl+C y luego ejecutá:',
        codeBlock: {
          code: 'claude',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Iniciá el framework GSD',
        explanation:
          'Ejecutá /gsd:new-project. GSD va a preguntar si querés mapear el codebase — respondé que sí. Luego de mapear, te va a pedir que hagas /clear y ejecutes /gsd:new-project nuevamente. En esa segunda ejecución te va a preguntar "¿Qué querés construir?" — describí una extensión concreta de tu app, por ejemplo: "quiero agregar historial de búsquedas — guardar cada reporte generado en una base de datos y mostrarlo en un dashboard". GSD va a crear la estructura de fases para eso.',
        codeBlock: {
          code: '/gsd:new-project',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Después de mapear, GSD pide hacer /clear y volver a ejecutar',
            error: 'Es parte del flujo normal',
            solution:
              'Hacé /clear en Claude Code y ejecutá /gsd:new-project de nuevo. Esta segunda ejecución ya tiene el contexto del codebase y te va a preguntar directamente qué querés construir.',
          },
          {
            trigger: 'Si Claude no reconoce /gsd:new-project',
            error: 'El comando no existe',
            solution:
              'Asegurate de haber reiniciado Claude Code después de instalar GSD. Si el problema persiste, reinstalá con: npx get-shit-done-cc@latest',
          },
        ],
      },
      {
        title: 'Planeá la primera fase',
        explanation:
          'Una vez que GSD creó la estructura del proyecto, usá /gsd:plan-phase para planificar la primera fase de desarrollo. GSD va a hacer preguntas, definir tareas concretas y crear el archivo PLAN.md con los criterios de aceptación.',
        codeBlock: {
          code: '/gsd:plan-phase',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si GSD pide que describas la fase',
            error: 'No sé qué escribir',
            solution:
              'Describí la primera etapa lógica. Para el historial del ejemplo: "Fase 1: schema de base de datos y guardado automático — tabla de reportes con startup, fecha y resultado, guardando cada reporte nuevo que se genere."',
          },
        ],
      },
      {
        title: 'Iniciá Claude Code',
        explanation:
          'Si todavía tenés la sesión del paso anterior activa, podés limpiar el contexto con `/clear` y ejecutar directamente desde ahí. Si saliste, volvé a iniciar:',
        codeBlock: {
          code: 'claude',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Ejecutá y verificá',
        explanation:
          'GSD ejecuta cada fase y luego verifica que los criterios de aceptación se cumplieron antes de pasar a la siguiente. El archivo STATE en .planning/ se actualiza con el progreso — si interrumpís el trabajo, podés retomarlo en otra sesión y GSD sabe exactamente dónde quedó. Primero ejecutá la fase, luego verificá:',
        codeBlock: {
          code: '"/gsd:execute-phase"\n\n"/gsd:verify-work"',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si la verificación falla',
            error: 'Verification fails con lista de items pendientes',
            solution:
              'Leé el output — te dice exactamente qué está faltando. Corregí los issues y corré verify de nuevo. La verificación es iterativa: fix → verify → fix → verify hasta pasar. Esto es lo que diferencia GSD de ejecutar todo sin control.',
          },
          {
            trigger: 'Si interrumpís y retomás después',
            error: 'Claude no recuerda dónde estaba el proyecto',
            solution:
              'Ejecutá /gsd:progress — GSD lee el archivo STATE y te dice exactamente en qué fase estás y qué falta. No necesitás re-explicar todo el contexto.',
          },
        ],
      },
    ],
  },

  // ─── Level 6: Sub-agentes ─────────────────────────────────────────────────
  {
    level: 6,
    title: 'Sub-agentes',
    subtitle: 'Un equipo de agentes especializados que trabajan en paralelo. Cada uno con su propio contexto, herramientas y rol — como contratar especialistas en lugar de un generalista.',
    sourceUrl: 'https://code.claude.com/docs/en/sub-agents#quickstart-create-your-first-subagent',
    summary:
      'Configuraste un equipo de sub-agentes de research: uno por dimensión de análisis. Entendiste la diferencia entre secuencial (calidad) y paralelo (velocidad), y cómo --dangerously-skip-permissions habilita la autonomía real.',
    steps: [
      {
        title: 'Entendé cuándo usar sub-agentes',
        explanation:
          'Sub-agentes resuelven dos problemas distintos. Primero: calidad — un agente especializado en análisis de mercado va a ser mejor que un generalista. Segundo: velocidad — si tenés tareas independientes, podés correrlas en paralelo en múltiples terminales y terminar 3x más rápido. Hay dos modos: Secuencial (un terminal, sub-agentes en cadena): el researcher pasa el brief al analyst, el analyst pasa al writer. Mejor para calidad y colaboración. Paralelo (múltiples terminales): tres terminales investigando tres mercados al mismo tiempo. Mejor para velocidad cuando las tareas son independientes.',
        errorCallouts: [
          {
            trigger: '¿Cuándo NO usar sub-agentes?',
            error: 'No sé si necesito sub-agentes o alcanza con una sesión',
            solution:
              'Para una investigación simple de un mercado, una sola sesión alcanza. Los sub-agentes valen la pena cuando tenés múltiples investigaciones independientes, o cuando querés que un agente se especialice (research) y otro se enfoque en otra cosa (escribir el reporte final).',
          },
        ],
      },
      {
        title: 'Creá la carpeta de agentes',
        explanation:
          'Los sub-agentes se definen en archivos .md dentro de .claude/agents/. Cada archivo tiene una descripción (cuándo Claude usa este agente), las herramientas permitidas y el prompt especializado. Si Claude Code está activo, usá: `! mkdir -p .claude/agents && touch .claude/agents/competitor-researcher.md && touch .claude/agents/market-sizer.md`.',
        setupBlock: {
          terminalCode: 'mkdir -p .claude/agents\ntouch .claude/agents/competitor-researcher.md\ntouch .claude/agents/market-sizer.md',
          manualInstructions: 'En VS Code, creá la carpeta ".claude/agents" dentro de tu proyecto. Luego creá los dos archivos dentro de esa carpeta y pegá el contenido de cada uno desde abajo.',
          fileContents: [
            {
              filename: '.claude/agents/competitor-researcher.md',
              language: 'markdown',
              code: '---\ndescription: Investigador especializado en análisis competitivo. Usar cuando se necesita mapear el landscape de competidores de un mercado.\ntools: WebSearch, Read, Write\n---\n\nEres un analista de mercado especializado en investigación competitiva.\nCuando te asignen un mercado:\n1. Identificá al menos 5 competidores directos y 3 indirectos\n2. Para cada uno: funding, modelo de negocios, pricing, fortalezas y debilidades\n3. Guardá el análisis en /output/competitors-[mercado].md',
            },
            {
              filename: '.claude/agents/market-sizer.md',
              language: 'markdown',
              code: '---\ndescription: Especialista en estimación de tamaño de mercado (TAM/SAM/SOM). Usar cuando se necesita cuantificar el tamaño de una oportunidad de mercado.\ntools: WebSearch, Read, Write\n---\n\nEres un analista cuantitativo especializado en market sizing.\nSiempre usá el método top-down con fuentes verificables.\nNunca inventes cifras — si no encontrás datos, decilo con el rango de incertidumbre.',
            },
          ],
        },
        errorCallouts: [
          {
            trigger: 'Si Claude no usa los agentes automáticamente',
            error: 'Claude hace todo él en lugar de delegar a sub-agentes',
            solution:
              'Sé explícito en el prompt: "Usá el sub-agente competitor-researcher para analizar los competidores." Los sub-agentes también se pueden invocar cuando le decís a Claude que delegue una parte específica del trabajo.',
          },
        ],
      },
      {
        title: 'Iniciá Claude Code',
        explanation:
          'Los sub-agentes se cargan al inicio de la sesión — necesitás reiniciar para que Claude los reconozca. Si tenés Claude Code activo, salí con `/exit` o Ctrl+C y luego ejecutá:',
        codeBlock: {
          code: 'claude',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Ejecutá sub-agentes en secuencia',
        explanation:
          'Primero probá el modo secuencial: le pedís a Claude principal que coordine los sub-agentes, uno después del otro. El resultado de uno alimenta al siguiente.',
        codeBlock: {
          code: '"Investigá el mercado de fintech para freelancers en LATAM:\n1. Usá el sub-agente competitor-researcher para mapear competidores\n2. Usá el sub-agente market-sizer para estimar el TAM\n3. Con los resultados de ambos, generá un reporte ejecutivo en /output/"',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si los sub-agentes no acceden a archivos del otro',
            error: 'El market-sizer no puede leer el output del competitor-researcher',
            solution:
              'Los sub-agentes comparten el sistema de archivos. Asegurate de que el primer agente guarda su output con una ruta específica y el segundo la lee explícitamente. Podés coordinarlo en el prompt principal.',
          },
        ],
      },
      {
        title: 'Iniciá Claude Code en cada terminal',
        explanation:
          'Abrí múltiples terminales y ejecutá Claude Code con el flag --dangerously-skip-permissions en cada una. Este flag evita que Claude pida confirmación en cada acción — necesario cuando no estás mirando las terminales.',
        codeBlock: {
          code: 'claude --dangerously-skip-permissions',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Corré sub-agentes en paralelo',
        explanation:
          'Para velocidad máxima, corré investigaciones independientes en paralelo. Con Claude corriendo en cada terminal, escribí un comando de investigación diferente en cada una al mismo tiempo.',
        codeBlock: {
          code: '# Terminal 1:\n"/research \'fintech para freelancers en Argentina\'"\n\n# Terminal 2 (simultáneamente):\n"/research \'fintech para freelancers en México\'"\n\n# Terminal 3:\n"/research \'fintech para freelancers en Colombia\'"',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Sobre --dangerously-skip-permissions',
            error: '¿Es seguro usar este flag?',
            solution:
              'El flag hace exactamente lo que dice: omite las confirmaciones de seguridad. Usalo solo en proyectos donde confíes en lo que Claude va a hacer — y siempre dentro de una carpeta de proyecto específica, no en tu home directory. Con el contexto bien definido en CLAUDE.md y los agentes bien especificados, el riesgo es mínimo.',
          },
        ],
      },
    ],
  },

  // ─── Level 7: RALPH Loop ─────────────────────────────────────────────────
  {
    level: 7,
    title: 'RALPH Loop',
    subtitle: 'Le das una lista de investigaciones. RALPH las ejecuta todas de forma autónoma, con contexto fresco en cada iteración. Vos llegás y encontrás los reportes listos.',
    sourceUrl: 'https://code.claude.com/docs/en/overview',
    summary:
      'Corriste tu primer pipeline autónomo con RALPH. Claude ejecutó todas tus investigaciones de mercado en batch, evaluando criterios de aceptación en cada una y pasando a la siguiente con contexto fresco. Completaste los 8 niveles de Claude Code.',
    steps: [
      {
        title: 'GSD vs RALPH: cuándo usar cada uno',
        explanation:
          'GSD y RALPH resuelven problemas distintos. GSD es un planificador y ejecutor para proyectos complejos donde el alcance no está totalmente definido — necesitás un humano supervisando las fases. RALPH es un ejecutor puro para tareas bien definidas en batch — corre solo hasta terminar todo, sin intervención humana. Para "investigar 10 mercados con criterios claros", RALPH es la herramienta correcta. Para "armar la estrategia de investigación de Q2", necesitás GSD primero. RALPH también resuelve context rot automáticamente: cada tarea corre en una ventana de contexto fresca, sin arrastrar el historial de las anteriores.',
        errorCallouts: [
          {
            trigger: '¿Cuándo NO usar RALPH?',
            error: 'No sé si mis tareas son adecuadas para RALPH',
            solution:
              'RALPH funciona cuando las tareas son independientes, tienen criterios de aceptación claros y verificables, y no requieren decisiones creativas entre pasos. Si tus tareas dependen entre sí o necesitan tu input a mitad del proceso, usá GSD o sub-agentes secuenciales.',
          },
        ],
      },
      {
        title: 'Iniciá Claude Code',
        explanation:
          'Si ya tenés Claude Code activo desde el nivel anterior, podés limpiar el contexto con `/clear` en lugar de salir y volver a entrar. Si preferís empezar desde cero, salí con `/exit` y ejecutá:',
        codeBlock: {
          code: 'claude',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Instalá RALPH',
        explanation:
          'RALPH se instala como un plugin de Claude Code. Ejecutá el comando de instalación.',
        codeBlock: {
          code: '/plugin install ralph',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si el plugin no se reconoce',
            error: '/plugin install ralph falla o no existe',
            solution:
              'Verificá que estés usando una versión reciente de Claude Code: claude --version. Si está desactualizado, actualizalo con: claude update. También podés instalar RALPH desde skillsmp.com siguiendo las instrucciones del repositorio.',
          },
        ],
      },
      {
        title: 'Creá tu prd.json',
        explanation:
          'prd.json es la lista de tareas que RALPH va a ejecutar. Cada tarea tiene: una descripción (qué hacer), criterios de aceptación (cómo Claude verifica que terminó) y un estado (pending → done). Los criterios deben ser objetivos y verificables — evitá cosas como "el reporte es bueno". Usá cosas como "el archivo existe en /output/" o "incluye la sección TAM". Si Claude Code está activo, creá el archivo con: `! touch prd.json`.',
        setupBlock: {
          terminalCode: 'touch prd.json',
          manualInstructions: 'En VS Code, creá el archivo "prd.json" en la carpeta principal del proyecto. Pegá el contenido de abajo y modificá las tareas con tus investigaciones.',
          fileContents: [
            {
              filename: 'prd.json',
              language: 'json',
              code: '{\n  "tasks": [\n    {\n      "id": 1,\n      "description": "Investigar el mercado de herramientas de gestión para freelancers en LATAM",\n      "acceptance_criteria": [\n        "Reporte creado en /output/ con nombre que incluye la fecha",\n        "Incluye al menos 5 competidores directos",\n        "Incluye estimación de TAM con fuentes",\n        "Incluye sección de Gaps y Oportunidades"\n      ],\n      "status": "pending"\n    },\n    {\n      "id": 2,\n      "description": "Investigar el mercado de e-commerce para artesanos en Argentina",\n      "acceptance_criteria": [\n        "Reporte creado en /output/ con nombre que incluye la fecha",\n        "Incluye análisis de canales de distribución (Mercado Libre, Instagram, etc.)",\n        "Incluye benchmarks de comisiones y fees del mercado"\n      ],\n      "status": "pending"\n    },\n    {\n      "id": 3,\n      "description": "Investigar el mercado de software de facturación para PyMEs en México",\n      "acceptance_criteria": [\n        "Reporte creado en /output/ con nombre que incluye la fecha",\n        "Incluye análisis del contexto regulatorio (SAT, CFDI)",\n        "Incluye al menos 3 competidores con comparativa de precios"\n      ],\n      "status": "pending"\n    }\n  ]\n}',
            },
          ],
        },
        errorCallouts: [
          {
            trigger: 'Si los criterios son difíciles de definir',
            error: 'No sé cómo escribir criterios verificables',
            solution:
              'Preguntate: ¿puede Claude responder sí o no a esto sin razonamiento subjetivo? "El reporte existe" → sí. "El reporte es completo" → no (¿qué es completo?). "El reporte incluye la sección Competidores" → sí. Cuanto más objetivo, más confiable es la ejecución autónoma.',
          },
        ],
      },
      {
        title: 'Iniciá Claude Code',
        explanation:
          'Antes de correr RALPH, hacé `/clear` para empezar con contexto limpio — RALPH va a manejar todo él solo, sin necesitar el historial de pasos anteriores. Si ya saliste de Claude Code, volvé a iniciar:',
        codeBlock: {
          code: 'claude',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Ejecutá RALPH con límite de iteraciones',
        explanation:
          'Siempre corré RALPH con --max-iterations como safeguard. Sin este límite, si algo sale mal podría correr indefinidamente y consumir muchos tokens. Una buena regla: ~3x la cantidad de tareas. Con 3 tareas, usá max-iterations 10.',
        codeBlock: {
          code: '/ralph --max-iterations 10',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si RALPH termina antes de completar todas las tareas',
            error: 'RALPH para con algunas tareas en "pending"',
            solution:
              'Revisá el prd.json — RALPH actualiza los estados en tiempo real. Si una tarea quedó en pending, verificá que los criterios sean verificables. Podés correr RALPH de nuevo y va a retomar desde las tareas pendientes.',
          },
          {
            trigger: 'Si querés ver el progreso en tiempo real',
            error: 'No sé si RALPH está trabajando o se colgó',
            solution:
              'Abrí otra terminal y ejecutá: watch cat prd.json — vas a ver los estados cambiar de "pending" a "done" en tiempo real. Los reportes también van apareciendo en /output/ a medida que se completan.',
          },
        ],
      },
      {
        title: 'Revisá lo que construiste',
        explanation:
          'Mirá tu carpeta /output/. Tenés reportes de mercado completos, generados de forma completamente autónoma, con contexto fresco por cada uno. Completaste los 8 niveles de Claude Code. Pasaste de chatear con Claude hasta tener pipelines de investigación que corren solos mientras hacés otra cosa. Modo chat → Plan Mode → CLAUDE.md → Commands, Skills y Hooks → MCP Servers → GSD Framework → Sub-agentes → RALPH autónomo. Estos son los mismos patrones que usan los equipos de investigación y los developers profesionales con Claude Code.',
        errorCallouts: [
          {
            trigger: 'No puedo creer que llegué hasta acá',
            error: 'Siento que no entendí todo al 100%',
            solution:
              'Es completamente normal. Lo importante es que lo ejecutaste y que ahora reconocés los patrones. La próxima vez que enfrentes un problema con Claude Code, vas a saber qué nivel de herramienta necesitás. Eso es exactamente lo que separa a alguien que "usa Claude Code" de alguien que lo domina.',
          },
        ],
      },
    ],
  },
];

export function getLevelContent(level: number, lang: 'es' | 'en' = 'es'): LevelContent | undefined {
  const content = lang === 'en' ? LEVEL_CONTENT_EN : LEVEL_CONTENT;
  return content.find(l => l.level === level);
}
