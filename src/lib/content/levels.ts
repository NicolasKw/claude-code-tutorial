import type { LevelContent } from '@/lib/types/tutorial';

export const LEVEL_CONTENT: LevelContent[] = [
  // ─── Level 0: Chatbot ────────────────────────────────────────────────────
  {
    level: 0,
    title: 'Chatbot',
    subtitle: 'Tu primera conversacion con Claude Code',
    summary:
      'Instalaste Claude Code, lo ejecutaste en modo chat, y verificaste que responde. Tenes una herramienta de IA corriendo en tu propia maquina.',
    steps: [
      {
        title: 'Instala Claude Code',
        explanation:
          'Claude Code es una herramienta de linea de comandos que se instala globalmente con npm. Solo tenes que hacerlo una vez en tu maquina.',
        codeBlock: {
          code: 'npm install -g @anthropic-ai/claude-code',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si ves este error',
            error: 'EACCES: permission denied',
            solution:
              'Tu npm global prefix no tiene permisos de escritura. Opciones: (1) usa sudo: sudo npm install -g @anthropic-ai/claude-code  (2) configura un npm prefix en tu home directory para no necesitar sudo.',
          },
        ],
      },
      {
        title: 'Autentica con tu cuenta Anthropic',
        explanation:
          'Claude Code necesita una clave de API de Anthropic para funcionar. El comando login abre el browser para que te autentiques con tu cuenta.',
        codeBlock: {
          code: 'claude login',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si el browser no se abre',
            error: 'La autenticacion no inicia automaticamente',
            solution:
              'Copia la URL que aparece en la terminal y pegala manualmente en el browser. La URL empieza con https://claude.ai/...',
          },
        ],
      },
      {
        title: 'Inicia una conversacion en modo chat',
        explanation:
          'Ejecuta claude sin argumentos para abrir el modo chat interactivo. Escribi cualquier pregunta para verificar que la conexion funciona.',
        codeBlock: {
          code: 'claude\n# Luego escribi: "Hola, podrias ayudarme a organizar mis tareas?"',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si ves este error',
            error: 'command not found: claude',
            solution:
              'npm no agrego el binario al PATH de tu terminal. Reinicia la terminal, o agrega el directorio bin de npm global al PATH: export PATH="$(npm config get prefix)/bin:$PATH"',
          },
        ],
      },
    ],
  },

  // ─── Level 1: Plan Mode ──────────────────────────────────────────────────
  {
    level: 1,
    title: 'Plan Mode',
    subtitle: 'Planifica antes de construir',
    summary:
      'Usaste el modo plan de Claude Code para disenar la estructura de tu bot antes de escribir codigo. Tenes un plan concreto que Claude va a ejecutar.',
    steps: [
      {
        title: 'Crea la carpeta de tu proyecto',
        explanation:
          'Antes de usar Claude Code para construir, necesitas un directorio de trabajo. Este sera el hogar de tu bot de gestion personal.',
        codeBlock: {
          code: 'mkdir mi-bot-personal && cd mi-bot-personal',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si ves este error',
            error: 'mkdir: mi-bot-personal: File exists',
            solution:
              'Ya existe una carpeta con ese nombre. Usa un nombre diferente (ej: mi-bot-v2) o elimina la carpeta existente si no la necesitas: rm -rf mi-bot-personal',
          },
        ],
      },
      {
        title: 'Inicia Claude Code en modo plan',
        explanation:
          'El modo plan le dice a Claude que piense la arquitectura ANTES de escribir codigo. Usas /plan al inicio de tu mensaje para activarlo.',
        codeBlock: {
          code: 'claude\n# Luego escribi: /plan Quiero un bot de gestion personal en Node.js que me ayude a organizar tareas, notas y recordatorios',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si Claude empieza a escribir codigo inmediatamente',
            error: 'Claude ignoro el modo plan',
            solution:
              'Asegurate de escribir /plan al inicio del mensaje (no en el medio). Si Claude ya empieza a codear, interrumpilo con Ctrl+C y empieza de nuevo con /plan al frente.',
          },
        ],
      },
      {
        title: 'Revisa y aprueba el plan',
        explanation:
          'Claude te muestra un plan detallado con la estructura del proyecto, los archivos que va a crear y las dependencias que va a instalar. Leelo con atencion, sugeri cambios si es necesario, y aprobalo cuando estes satisfecho.',
        errorCallouts: [
          {
            trigger: 'Si el plan parece demasiado complejo',
            error: 'El plan tiene demasiados pasos o dependencias',
            solution:
              'Pedile a Claude que simplifique: "Simplifica el plan, quiero empezar con lo minimo viable — solo guardar tareas en un archivo JSON y listarlas." Claude ajustara el alcance.',
          },
        ],
      },
      {
        title: 'Ejecuta el plan aprobado',
        explanation:
          'Una vez que apruebes el plan, Claude escribe el codigo automaticamente. Mira como crea archivos y carpetas segun el plan que acordaron. No tenes que escribir ni una linea de codigo.',
        errorCallouts: [
          {
            trigger: 'Si Claude pide confirmacion para cada archivo',
            error: 'Claude pregunta "Do you want to create this file?" repetidamente',
            solution:
              'Escribe "y" o "yes" para aprobar cada archivo. Si queres aprobar todos de una sola vez, escribe "yes to all" o "si a todo". Esto es un comportamiento normal de seguridad.',
          },
        ],
      },
    ],
  },

  // ─── Level 2: CLAUDE.md ──────────────────────────────────────────────────
  {
    level: 2,
    title: 'CLAUDE.md',
    subtitle: 'Dale memoria a tu proyecto',
    summary:
      'Creaste un archivo CLAUDE.md que le dice a Claude Code como trabajar en tu proyecto. Ahora cada sesion arranca con contexto, sin repetir instrucciones.',
    steps: [
      {
        title: 'Crea el archivo CLAUDE.md',
        explanation:
          'CLAUDE.md es el archivo de memoria de tu proyecto. Claude lo lee automaticamente al inicio de cada sesion. Crealo en la raiz de tu proyecto.',
        codeBlock: {
          code: 'touch CLAUDE.md',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si ves este error en Windows',
            error: 'touch: command not found',
            solution:
              'En Windows PowerShell usa: New-Item CLAUDE.md -ItemType File  O simplemente crea el archivo manualmente desde el explorador de archivos o tu editor de codigo.',
          },
        ],
      },
      {
        title: 'Escribe las instrucciones del proyecto',
        explanation:
          'Abre CLAUDE.md y agrega el contexto que Claude necesita saber sobre tu bot. Este contenido evita que tengas que repetir el contexto en cada sesion.',
        codeBlock: {
          code: '# Mi Bot Personal\n\nEste proyecto es un bot de gestion personal en Node.js.\n\n## Convenciones\n- Usar ES modules (import/export)\n- Archivos en espanol\n- Tests con vitest\n\n## Estructura\n- src/ — codigo fuente\n- tests/ — tests\n- data/ — archivos JSON de datos (tareas, notas)',
          language: 'markdown',
        },
        errorCallouts: [
          {
            trigger: 'Si Claude no parece leer CLAUDE.md',
            error: 'Claude responde sin mencionar el contexto del proyecto',
            solution:
              'Verifica que CLAUDE.md este en el directorio raiz del proyecto (el mismo directorio donde ejecutas el comando claude). No en una subcarpeta.',
          },
        ],
      },
      {
        title: 'Verifica que Claude lee el archivo',
        explanation:
          'Inicia una nueva sesion de Claude Code y preguntale sobre el proyecto. Deberia mencionar el contenido de CLAUDE.md sin que vos se lo digas.',
        codeBlock: {
          code: 'claude\n# Luego pregunta: "Que sabes sobre este proyecto?"',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si Claude dice "No tengo contexto sobre este proyecto"',
            error: 'Claude no encuentra el archivo CLAUDE.md',
            solution:
              'Verifica la ubicacion del archivo con: ls -la CLAUDE.md  Si no aparece, crealo de nuevo. Asegurate de estar en el directorio correcto al ejecutar claude.',
          },
        ],
      },
    ],
  },

  // ─── Level 3: Commands, Skills y Hooks ───────────────────────────────────
  {
    level: 3,
    title: 'Commands, Skills y Hooks',
    subtitle: 'Automatiza tareas repetitivas',
    summary:
      'Configuraste un comando personalizado, un skill file y un hook. Tu proyecto ahora tiene atajos y automatizaciones que aceleran el desarrollo.',
    steps: [
      {
        title: 'Crea un comando personalizado',
        explanation:
          'Los comandos personalizados son atajos que podes invocar con /commands/nombre. Se guardan como archivos Markdown en .claude/commands/ y pueden ser cualquier instruccion que le des a Claude.',
        codeBlock: {
          code: 'mkdir -p .claude/commands && echo "Revisa el codigo del proyecto y sugeri mejoras de calidad, performance y legibilidad. Genera un reporte con las sugerencias ordenadas por prioridad." > .claude/commands/revisar.md',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si Claude no reconoce el directorio .claude/commands',
            error: 'El comando /commands/revisar no aparece como opcion',
            solution:
              'Asegurate de estar en el directorio raiz del proyecto (donde esta CLAUDE.md) cuando ejecutas claude. Los comandos se buscan relativos al directorio actual.',
          },
        ],
      },
      {
        title: 'Prueba tu comando personalizado',
        explanation:
          'Abre Claude Code e invoca el comando que acabas de crear. Claude va a ejecutar las instrucciones del archivo Markdown como si las hubieras escrito manualmente.',
        codeBlock: {
          code: 'claude\n# Luego escribi: /commands/revisar',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si el comando no se encuentra',
            error: 'Unknown command: /commands/revisar',
            solution:
              'Verifica que el archivo este en la ruta exacta: .claude/commands/revisar.md (con extension .md). Comprueba con: ls .claude/commands/',
          },
        ],
      },
      {
        title: 'Crea un skill file',
        explanation:
          'Los skills son bloques de conocimiento reutilizable que Claude usa cuando son relevantes. Se guardan en .claude/skills/ y pueden describir patrones, formatos o reglas especificas del proyecto.',
        codeBlock: {
          code: 'mkdir -p .claude/skills && echo "# Skill: Gestionar Tareas\\n\\nCuando el usuario pide crear, listar o completar tareas, usa el archivo src/tasks.json como almacenamiento. Formato: [{id, titulo, completada, fecha}]" > .claude/skills/tareas.md',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si Claude no aplica el skill automaticamente',
            error: 'Claude no usa el formato de tasks.json',
            solution:
              'Menciona el skill explicitamente en tu prompt: "usando el skill de tareas, crea una nueva tarea". Los skills son sugerencias contextuales, no reglas absolutas.',
          },
        ],
      },
      {
        title: 'Configura un hook de pre-commit',
        explanation:
          'Los hooks son acciones que Claude ejecuta automaticamente en ciertos momentos del flujo de trabajo. Un hook de pre-commit corre los tests antes de cada commit, evitando que rompas el codigo.',
        codeBlock: {
          code: 'echo \'{\n  "hooks": {\n    "pre-commit": "npx vitest run --reporter=verbose"\n  }\n}\' > .claude/settings.json',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si el hook no se ejecuta',
            error: 'Claude no corre los tests antes del commit',
            solution:
              'Verifica que .claude/settings.json sea JSON valido (sin comas al final, sin comillas simples). Podes validarlo con: node -e "JSON.parse(require(\'fs\').readFileSync(\'.claude/settings.json\', \'utf8\'))" && echo "JSON valido"',
          },
        ],
      },
    ],
  },

  // ─── Level 4: MCP Servers ────────────────────────────────────────────────
  {
    level: 4,
    title: 'MCP Servers',
    subtitle: 'Conecta herramientas externas',
    summary:
      'Conectaste un servidor MCP a Claude Code. Tu bot ahora puede acceder a herramientas externas — leer archivos, hacer requests HTTP, y mas — sin que vos escribas el codigo de integracion.',
    steps: [
      {
        title: 'Entiende que es un MCP Server',
        explanation:
          'MCP (Model Context Protocol) permite que Claude Code use herramientas externas como si fueran nativas. Un MCP server expone herramientas que Claude puede invocar directamente desde la conversacion. No necesitas escribir codigo de integracion — solo conectar el servidor y Claude sabe como usarlo.',
        errorCallouts: [
          {
            trigger: 'Parece complicado',
            error: 'No entiendo para que sirve MCP',
            solution:
              'MCP es solo un protocolo de comunicacion. Pensa en los MCP servers como plugins que le dan superpoderes a Claude. El servidor de filesystem, por ejemplo, le da a Claude la capacidad de leer y escribir archivos en tu maquina.',
          },
        ],
      },
      {
        title: 'Configura el MCP server de filesystem',
        explanation:
          'Este MCP server le da a Claude Code la capacidad de leer y escribir archivos a traves de herramientas MCP. El flag --dir . limita el acceso al directorio actual de tu proyecto.',
        codeBlock: {
          code: 'claude mcp add filesystem -- npx -y @anthropic-ai/mcp-filesystem --dir .',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si ves este error',
            error: 'Error: MCP server failed to start',
            solution:
              'Verifica que tu version de Node.js sea 18 o superior: node --version  Los MCP servers requieren Node 18+. Si tenes una version anterior, actualiza con: nvm install 18 && nvm use 18',
          },
        ],
      },
      {
        title: 'Usa el MCP server en tu bot',
        explanation:
          'Ahora que el servidor esta configurado, Claude puede usar las herramientas MCP en cualquier conversacion. Proba pedirle que use el servidor explicitamente para ver la diferencia.',
        codeBlock: {
          code: 'claude\n# Luego escribi: "Usa el MCP de filesystem para listar todos los archivos del proyecto y decime cuales son de configuracion"',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si Claude no usa las herramientas MCP',
            error: 'Claude ignora el MCP server y responde sin usarlo',
            solution:
              'Verifica que el servidor este configurado correctamente con: claude mcp list  Deberia aparecer "filesystem" en la lista. Si no aparece, repite el paso anterior de configuracion.',
          },
        ],
      },
    ],
  },

  // ─── Level 5: GSD Framework ──────────────────────────────────────────────
  {
    level: 5,
    title: 'GSD Framework',
    subtitle: 'Estructura tu trabajo con Claude',
    summary:
      'Implementaste el framework GSD (Get Shit Done) en tu proyecto. Ahora tenes un flujo estructurado para planificar, ejecutar y verificar tareas con Claude Code.',
    steps: [
      {
        title: 'Instala el framework GSD',
        explanation:
          'GSD es un framework de workflows que le da a Claude Code un proceso repetible: planificar, ejecutar, verificar. No es una dependencia npm — es una estructura de carpetas y archivos de instrucciones que Claude lee.',
        codeBlock: {
          code: 'claude\n# Luego escribi: "Instala el framework GSD en este proyecto. Crea la estructura de carpetas .claude/get-shit-done/ con los workflows basicos."',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si Claude no sabe que es GSD',
            error: 'Claude dice que no conoce el framework GSD',
            solution:
              'Describiselo explicitamente: "GSD es un framework de workflows para Claude Code que organiza el trabajo en fases: planificar, ejecutar, verificar. Crea la carpeta .claude/get-shit-done/ con archivos README.md que describan cada fase."',
          },
        ],
      },
      {
        title: 'Crea tu primer plan con GSD',
        explanation:
          'El comando /gsd:plan crea un archivo de plan estructurado que Claude puede ejecutar paso a paso. Dale un objetivo en lenguaje natural y Claude lo convierte en tareas concretas.',
        codeBlock: {
          code: 'claude\n# Luego escribi: "/gsd:plan Quiero agregar un sistema de recordatorios a mi bot personal"',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si el comando no funciona',
            error: '/gsd:plan command not recognized',
            solution:
              'Asegurate de haber instalado GSD en el paso anterior. Verifica que la carpeta .claude/get-shit-done/ existe: ls .claude/get-shit-done/  Si no existe, repite el paso de instalacion.',
          },
        ],
      },
      {
        title: 'Ejecuta el plan',
        explanation:
          'Claude lee el plan generado y ejecuta cada tarea en orden, haciendo commits del progreso. Podes ver como avanza y detenerlo si algo no esta bien.',
        codeBlock: {
          code: 'claude\n# Luego escribi: "/gsd:execute"',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si Claude saltea tareas o las hace fuera de orden',
            error: 'El orden de ejecucion no corresponde al plan',
            solution:
              'El archivo de plan puede tener dependencias de tareas poco claras. Revisa el plan con Claude y pedile que replanifique: "Revisa el plan, algunas tareas tienen dependencias que no estan bien definidas. Replanifica con dependencias explicitas."',
          },
        ],
      },
      {
        title: 'Verifica el resultado',
        explanation:
          'La verificacion comprueba que el plan fue ejecutado correctamente y que todos los criterios de aceptacion se cumplen. Si algo falla, te dice exactamente que falta.',
        codeBlock: {
          code: 'claude\n# Luego escribi: "/gsd:verify"',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si la verificacion falla',
            error: 'Verification fails con lista de items pendientes',
            solution:
              'Lee el output de verificacion — te dice exactamente que esta faltando. Corrige los issues y corre verify de nuevo. La verificacion es iterativa: fix → verify → fix → verify hasta pasar.',
          },
        ],
      },
    ],
  },

  // ─── Level 6: Sub-agentes y Flujos Autonomos ─────────────────────────────
  {
    level: 6,
    title: 'Sub-agentes y Flujos Autonomos',
    subtitle: 'Delega y automatiza',
    summary:
      'Configuraste sub-agentes y un flujo autonomo completo. Tu bot de gestion personal ahora puede ejecutar tareas complejas en multiples pasos sin intervencion manual. Completaste el tutorial — sos un usuario avanzado de Claude Code.',
    steps: [
      {
        title: 'Entiende los sub-agentes',
        explanation:
          'Sub-agents son instancias de Claude Code que el agente principal puede lanzar para manejar subtareas especificas. Cada sub-agente recibe su propio contexto y puede trabajar de forma independiente. Esto permite paralelizar trabajo que de otro modo seria secuencial.',
        errorCallouts: [
          {
            trigger: 'Cuando uso sub-agentes?',
            error: 'No entiendo cuando tiene sentido usar sub-agentes vs una sola sesion',
            solution:
              'Usa sub-agentes cuando una tarea tiene partes independientes que se pueden hacer en paralelo — por ejemplo, actualizar tests mientras se refactoriza codigo, o revisar calidad mientras se actualiza documentacion.',
          },
        ],
      },
      {
        title: 'Crea un workflow con sub-agentes',
        explanation:
          'Claude puede crear y coordinar sub-agentes cuando le das un objetivo con partes claramente independientes. El agente principal actua como coordinador y los sub-agentes ejecutan cada parte.',
        codeBlock: {
          code: 'claude\n# Luego escribi: "Crea un workflow que use sub-agentes para: 1) revisar la calidad del codigo, 2) actualizar los tests, y 3) mejorar la documentacion. Los tres pueden correr en paralelo."',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si Claude hace todo en secuencia en lugar de paralelo',
            error: 'Claude no usa sub-agentes aunque se lo pedi',
            solution:
              'Se mas explicito en el prompt: "Usa la herramienta Task para crear sub-agentes que trabajen en paralelo, no en secuencia. Cada sub-agente debe tener su propio contexto y objetivo."',
          },
        ],
      },
      {
        title: 'Configura un flujo autonomo',
        explanation:
          'Un flujo autonomo es una secuencia de acciones que Claude ejecuta con minima interaccion. Le das un trigger (una frase o comando) y Claude maneja todos los pasos internamente sin pedirte confirmacion en cada uno.',
        codeBlock: {
          code: 'claude\n# Luego escribi: "Configura un flujo autonomo que cada vez que le pida \'organizar mi dia\', lea mis tareas pendientes, priorice por urgencia, y genere un plan del dia en formato markdown."',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si Claude hace demasiadas preguntas en lugar de actuar',
            error: 'Claude pide confirmacion en cada paso del flujo',
            solution:
              'Agrega una instruccion en CLAUDE.md: "Cuando el usuario pide organizar el dia, actua sin pedir confirmacion. Lee las tareas, priorizalas y genera el plan directamente."',
          },
        ],
      },
      {
        title: 'Ejecuta el flujo completo',
        explanation:
          'Proba el flujo autonomo con el trigger que configuraste. Mira como Claude ejecuta todos los pasos — leer tareas, priorizar, generar plan — sin interrumpirte en cada uno.',
        codeBlock: {
          code: 'claude\n# Luego escribi: "Organiza mi dia"',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'Si el resultado no es lo que esperabas',
            error: 'El plan generado no tiene el formato o el nivel de detalle que queria',
            solution:
              'Refina las instrucciones en CLAUDE.md y vuelve a probar. Los flujos autonomos mejoran con instrucciones mas especificas. Agrega ejemplos del formato esperado directamente en CLAUDE.md.',
          },
        ],
      },
      {
        title: 'Revisa lo que construiste',
        explanation:
          'Mira la carpeta de tu proyecto. Tenes un bot de gestion personal con: modo chat, planificacion con Plan Mode, memoria de proyecto en CLAUDE.md, comandos personalizados, skills, hooks de automatizacion, MCP servers para herramientas externas, flujos GSD estructurados, sub-agentes para trabajo paralelo y flujos autonomos. Todo corriendo en tu propia maquina. Estos son los mismos patrones que usan los desarrolladores profesionales con Claude Code.',
        errorCallouts: [
          {
            trigger: 'No puedo creer que hice todo esto',
            error: 'Siento que no entendi todo al 100%',
            solution:
              'Es real, y es normal no entender todo en el primer recorrido. Lo importante es que lo ejecutaste. La proxima vez que uses Claude Code, vas a reconocer estos patrones y usarlos con mas confianza. Eso es exactamente como se aprende.',
          },
        ],
      },
    ],
  },
];

export function getLevelContent(level: number): LevelContent | undefined {
  return LEVEL_CONTENT.find(l => l.level === level);
}
