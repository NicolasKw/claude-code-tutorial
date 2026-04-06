import type { LevelContent } from '@/lib/types/tutorial';

export const LEVEL_CONTENT_EN: LevelContent[] = [
  // ─── Level 0: Chatbot ────────────────────────────────────────────────────
  {
    level: 0,
    title: 'Chatbot',
    subtitle: 'The entry point. Claude Code as an interactive chat — no structure, no prior context.',
    summary:
      'You installed Claude Code, ran it in chat mode, and verified it responds. You have an AI startup researcher running on your own machine.',
    sourceUrl: 'https://code.claude.com/docs/en/overview',
    steps: [
      {
        title: 'Install Claude Code',
        explanation:
          'Claude Code installs with a single native command — no npm or other prerequisites needed. Open your system terminal and run:',
        codeBlock: {
          code: 'curl -fsSL https://claude.ai/install.sh | bash',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'How do I open the terminal?',
            error: "I don't know what it is or how to open it",
            solution:
              'Mac: press Cmd+Space, type "Terminal" and press Enter. Windows: press the Windows key, type "PowerShell" and open it. Linux: search for "Terminal" in your applications.',
          },
          {
            trigger: "If you're on Windows",
            error: "curl doesn't work or the .sh script isn't compatible",
            solution:
              'In Windows PowerShell run: irm https://claude.ai/install.ps1 | iex\n\nIn Windows CMD run: curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd',
          },
          {
            trigger: 'If you see "curl: command not found"',
            error: 'curl is not installed on your system',
            solution:
              "On Ubuntu/Debian: sudo apt install curl\nmacOS comes with curl pre-installed — if it's missing, install Xcode Command Line Tools: xcode-select --install",
          },
        ],
      },
      {
        title: 'Install Visual Studio Code',
        explanation:
          'The terminal works, but Visual Studio Code is much more comfortable for working with Claude Code. It gives you a code editor, file explorer, and integrated terminal all in one place. Download it from code.visualstudio.com, install it, then search for the "Claude Code" extension in the VS Code marketplace to have Claude Code integrated directly in the editor.',
        errorCallouts: [
          {
            trigger: 'Already have an editor?',
            error: 'I use another editor like Cursor, Zed, or WebStorm',
            solution:
              'Claude Code works from any terminal. If you already have an editor with an integrated terminal, you can skip this step. The official Claude Code extension exists for VS Code and JetBrains (WebStorm, IntelliJ, etc.).',
          },
        ],
      },
      {
        title: 'Authenticate with your Anthropic account',
        explanation:
          'Claude Code needs an Anthropic API key to work. The login command opens the browser so you can authenticate with your account.',
        codeBlock: {
          code: 'claude login',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: "If the browser doesn't open",
            error: 'Authentication does not start automatically',
            solution:
              'Copy the URL that appears in the terminal and paste it manually into the browser. The URL starts with https://claude.ai/...',
          },
        ],
      },
      {
        title: 'Open Claude Code',
        explanation: 'Open a new Claude Code session in the terminal.',
        codeBlock: {
          code: 'claude',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'If you see this error',
            error: 'command not found: claude',
            solution:
              "The native installer adds claude to PATH automatically, but sometimes the current terminal session doesn't reflect it yet. Close and reopen the terminal, or run: source ~/.zshrc (Mac) / source ~/.bashrc (Linux).",
          },
        ],
      },
      {
        title: 'Start a conversation in chat mode',
        explanation:
          'Type any question to verify the connection works.',
        codeBlock: {
          code: '"Is there a market for an inventory management app for restaurants?"',
          language: 'bash',
        },
        errorCallouts: [],
      },
    ],
  },

  // ─── Level 1: Plan Mode ──────────────────────────────────────────────────
  {
    level: 1,
    title: 'Plan Mode',
    subtitle: 'Claude designs the architecture before writing code. You review, request changes, then execute.',
    sourceUrl: 'https://code.claude.com/docs/en/common-workflows#use-plan-mode-for-safe-code-analysis',
    summary:
      "You used Plan Mode to design your agent's structure before writing code. You learned the Boris workflow: plan → approve → one-shot execute.",
    steps: [
      {
        title: 'Create your project folder',
        explanation:
          'Before using Claude Code to build, you need a working directory. This will be the home of your startup research agent.',
        setupBlock: {
          terminalCode: 'mkdir my-startup-agent && cd my-startup-agent',
          manualInstructions: 'Create a new folder called "my-startup-agent" from Finder (Mac) or File Explorer (Windows). Then open it in VS Code: File → Open Folder.',
        },
        errorCallouts: [
          {
            trigger: 'If you see this error',
            error: 'mkdir: my-startup-agent: File exists',
            solution:
              "A folder with that name already exists. Use a different name (e.g. my-agent-v2) or delete the existing folder if you don't need it: rm -rf my-startup-agent",
          },
        ],
      },
      {
        title: 'Open Claude Code',
        explanation: 'Open a new Claude Code session in the terminal.',
        codeBlock: {
          code: 'claude',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Activate Plan Mode with Shift+Tab',
        explanation:
          "Plan Mode is not a command — it's a session mode. Press Shift+Tab to cycle through it. At the bottom of the terminal you'll see the indicator change from \"accept edits\" to \"plan mode\". In Plan Mode, Claude is read-only: it proposes and asks, but doesn't write or execute anything until you approve.",
        errorCallouts: [
          {
            trigger: "If Shift+Tab doesn't work",
            error: "The mode doesn't change when pressing Shift+Tab",
            solution:
              'Some terminals intercept Shift+Tab. Try the VS Code integrated terminal. You can also type /plan at the start of your message to activate it from chat.',
          },
        ],
      },
      {
        title: 'Describe your goal',
        explanation:
          "With Plan Mode active, write your goal in natural language. Be clear about what you want to build, but don't worry about technical details — Claude will ask the necessary questions. For example, type:",
        codeBlock: {
          code: '"I want a web app where the user enters a startup idea\nand gets a market report with competitors, TAM, and opportunities"',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'If Claude starts writing code immediately',
            error: 'Claude ignored Plan Mode and started executing',
            solution:
              'Verify the indicator at the bottom says "plan mode" before sending. If it already executed something, interrupt it with Ctrl+C, restart with /clear, and activate Plan Mode before describing the goal.',
          },
        ],
      },
      {
        title: "Answer Claude's questions",
        explanation:
          'Claude has an internal tool called "ask user questions" that it uses in Plan Mode to clarify assumptions before planning. It will ask things like: what programming language do you prefer? do you want database persistence? how will reports be delivered? Answer in detail — these responses are what makes the subsequent execution precise. This is exactly how Boris Churnney, the creator of Claude Code, works: no execution until there\'s a clear plan.',
        errorCallouts: [
          {
            trigger: "If Claude doesn't ask questions",
            error: 'Claude generates the plan directly without asking',
            solution:
              "Claude may do this if the goal was very specific. Review the plan it generated — if it seems complete and reflects your intent, you can continue. If context is missing, add it: \"Before continuing, can you ask me about X?\"",
          },
        ],
      },
      {
        title: 'Approve the plan and execute',
        explanation:
          'Once the plan reflects what you want, exit Plan Mode by pressing Shift+Tab again (back to "accept edits"). Now give Claude a single execution prompt. This is the "one-shot pattern": with a clear plan, Claude can execute everything in one step without back-and-forth. Type:',
        codeBlock: {
          code: '"Execute the approved plan"',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'If Claude asks for confirmation for each file',
            error: 'Claude asks "Do you want to create this file?" repeatedly',
            solution:
              'Type "y" or "yes" to approve each file, or "yes to all" to approve all at once. This is normal security behavior in the first session.',
          },
        ],
      },
    ],
  },

  // ─── Level 2: CLAUDE.md ──────────────────────────────────────────────────
  {
    level: 2,
    title: 'CLAUDE.md',
    subtitle:
      "An instruction file that Claude reads at the start of every session. Your agent remembers your startup without you repeating it every time.",
    sourceUrl: 'https://code.claude.com/docs/en/memory#claude-md-files',
    summary:
      'You created a CLAUDE.md with the 5-question framework. Claude now knows your startup, the research rules, and project conventions from the very first message of each session.',
    steps: [
      {
        title: 'Understand the 5-question framework',
        explanation:
          "CLAUDE.md is your agent's onboarding — like the manual you'd give a new employee. The most effective content answers these 5 questions: (1) What is this? One line about what the project does. (2) How does it work? The exact process steps. (3) What are the rules? Non-negotiables and output format. (4) What mistakes not to repeat? Edge cases and gotchas. (5) How do we work? File and folder conventions. The golden rule: keep it short. If it can't be read in 60 seconds, there's too much.",
        errorCallouts: [
          {
            trigger: 'How much is too much?',
            error: "I don't know how much content to put",
            solution:
              "Less than 30 total instructions. If you need more detail on a point, create a separate file and reference it: \"For the complete analysis framework, see /docs/research-framework.md\". This is the \"don't dump trick\" — CLAUDE.md points to details, doesn't contain them.",
          },
        ],
      },
      {
        title: 'Create the CLAUDE.md file',
        explanation:
          "Create CLAUDE.md at the root of your project. In the next step you'll fill in its content.",
        setupBlock: {
          terminalCode: 'touch CLAUDE.md',
          manualInstructions: 'In VS Code, right-click in the file explorer (left panel) → New File → name it "CLAUDE.md". On Windows you can also open your project folder in File Explorer, right-click → New → Text Document → rename it to "CLAUDE.md".',
        },
        errorCallouts: [],
      },
      {
        title: 'Write the project instructions',
        explanation:
          "Open CLAUDE.md and fill in the 5 sections with your startup research agent's context.",
        codeBlock: {
          code: "# Startup Research Agent\n\nThis project analyzes market opportunities for founders: competitors, TAM, trends, and gaps.\n\n## Process\n1. Receive idea or market vertical from user\n2. Search for direct and indirect competitors\n3. Estimate market size (TAM/SAM/SOM)\n4. Identify gaps and opportunities\n5. Generate report in /output/[date]-[idea].md\n\n## Rules\n- Always cite sources\n- Never invent data — if you can't find info, say so explicitly\n- For the complete analysis framework, see /docs/research-framework.md\n\n## Mistakes to avoid\n- Don't confuse TAM with SAM\n- Always include indirect competitors, not just direct ones\n\n## Conventions\n- Reports in /output/ with date prefix: YYYY-MM-DD-name.md\n- Raw data in /data/",
          language: 'markdown',
        },
        errorCallouts: [
          {
            trigger: "If Claude doesn't seem to read CLAUDE.md",
            error: 'Claude responds without mentioning the project context',
            solution:
              'Verify that CLAUDE.md is in the root directory of the project (the same directory where you run claude). Restart the session with /clear so Claude reloads the file.',
          },
        ],
      },
      {
        title: 'Open Claude Code',
        explanation: 'Open a new Claude Code session in the terminal.',
        codeBlock: {
          code: 'claude',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Verify Claude reads the file',
        explanation:
          'Ask it about the project. It should mention the CLAUDE.md content without you telling it.',
        codeBlock: {
          code: '"What do you know about this project and how do we work?"',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'What do I do when Claude makes a mistake?',
            error: "Claude didn't follow a CLAUDE.md rule",
            solution:
              "Correct it in the moment and then update CLAUDE.md so it doesn't repeat. You can ask directly: \"Add this rule to CLAUDE.md: never use X.\" Claude will do it for you. This is the same process Boris uses — fix errors in real time and version the file in Git.",
          },
          {
            trigger: 'Have an existing project?',
            error: 'I want to auto-generate CLAUDE.md from my code',
            solution:
              "Run /init inside Claude Code and it will read your repo to generate a CLAUDE.md automatically. Then you just review and remove what doesn't apply.",
          },
        ],
      },
    ],
  },

  // ─── Level 3: Commands, Skills & Hooks ───────────────────────────────────
  {
    level: 3,
    title: 'Commands, Skills & Hooks',
    subtitle:
      'Commands for reusable shortcuts, Skills for specialized knowledge, and Hooks for token-free automation.',
    sourceUrl: 'https://code.claude.com/docs/en/skills#create-your-first-skill',
    summary:
      'You configured a command with dynamic arguments, an analysis skill, and a validation hook. The key distinction: Skills = how Claude thinks. Hooks = what happens automatically. Commands = what you trigger.',
    steps: [
      {
        title: 'Create a command with dynamic arguments',
        explanation:
          'Commands are saved prompts you can invoke with /name. What makes them powerful is `$ARGUMENTS` — a placeholder you replace when invoking the command. This way, one command works for any startup or market vertical.',
        setupBlock: {
          terminalCode: 'mkdir -p .claude/commands\ntouch .claude/commands/research.md',
          manualInstructions: 'In VS Code, create the ".claude/commands" folder inside your project (right-click in the file explorer → New Folder). Then create the file "research.md" inside that folder and paste the content shown below.',
          fileContents: [
            {
              filename: '.claude/commands/research.md',
              language: 'markdown',
              code: 'Research the market for: $ARGUMENTS\n\nAnalyze:\n1. Direct and indirect competitors (minimum 5)\n2. Market size (TAM/SAM/SOM with sources)\n3. Recent sector trends\n4. Gaps and uncovered opportunities\n\nSave the report in /output/ with the date format from CLAUDE.md.',
            },
          ],
        },
        errorCallouts: [
          {
            trigger: "If Claude doesn't recognize the command",
            error: "/research doesn't appear as an option when typing /",
            solution:
              'Close the Claude Code session with Ctrl+C and reopen it with claude. Commands are loaded at the start of a session, not in real time.',
          },
        ],
      },
      {
        title: 'Open Claude Code',
        explanation: 'Open a new Claude Code session in the terminal.',
        codeBlock: {
          code: 'claude',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Test the command with arguments',
        explanation:
          'Invoke the command passing a startup idea as an argument. Claude will replace $ARGUMENTS with what you typed.',
        codeBlock: {
          code: '/research "pet delivery app in LATAM"',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'If the report is not saved in /output/',
            error: "Claude generated the analysis in chat but didn't create the file",
            solution:
              'Add more specificity to the command: "Save the report in /output/[DATE]-[idea-name].md using the file writing tool." Commands improve with more explicit instructions.',
          },
        ],
      },
      {
        title: 'Create an analysis Skill',
        explanation:
          "Skills are different from commands: Claude loads them automatically based on context, without you invoking them. They are specialized knowledge — an analysis framework, a methodology, reference examples. Create a skill that defines how your agent should structure market analysis.",
        setupBlock: {
          terminalCode: 'mkdir -p .claude/skills/startup-analyst\ntouch .claude/skills/startup-analyst/skill.md',
          manualInstructions: 'In VS Code, create the folders ".claude/skills/startup-analyst" (nested). Then create "skill.md" inside "startup-analyst" and paste the content shown below.',
          fileContents: [
            {
              filename: '.claude/skills/startup-analyst/skill.md',
              language: 'markdown',
              code: '---\ndescription: Analysis framework for startup market research. Use when the user asks to analyze a market, validate an idea, or research competitors.\n---\n\n# Startup Analyst\n\nAlways structure the analysis in this order:\n1. **Competitor map**: direct (same problem, same solution), indirect (same problem, different solution), substitutes (alternative behavior)\n2. **Jobs to be done**: what job is the end user trying to get done?\n3. **TAM/SAM/SOM**: top-down with verifiable sources, never invent numbers\n4. **Gaps**: what no current competitor covers\n5. **Market signals**: recent funding, search trends, regulatory changes',
            },
          ],
        },
        errorCallouts: [
          {
            trigger: "If Claude doesn't apply the skill automatically",
            error: 'Claude analyzes without following the skill framework',
            solution:
              'The key is the frontmatter description — "use when..." needs to be precise so Claude understands when to activate it. You can also invoke it manually: "use the startup-analyst skill for this."',
          },
          {
            trigger: 'Want more skills?',
            error: "I want skills that already exist so I don't have to create them from scratch",
            solution:
              'Explore skillsmp.com — a community of skills for Claude Code. You can clone any skill directly: git clone [url] .claude/skills/[name]. There are skills for humanizing text, code review, SEO, and much more.',
          },
        ],
      },
      {
        title: 'Configure a validation Hook',
        explanation:
          "Hooks are automatic triggers that run when Claude does something. They don't use LLM tokens — they are pure, mechanical scripts. Perfect for validations that must always be met. Create a hook that verifies each research report has the required sections.",
        setupBlock: {
          terminalCode: 'touch .claude/settings.json',
          manualInstructions: 'In VS Code, create the file "settings.json" inside the ".claude/" folder of your project and paste the content shown below.',
          fileContents: [
            {
              filename: '.claude/settings.json',
              language: 'json',
              code: '{\n  "hooks": {\n    "PostToolUse": [\n      {\n        "matcher": "Write",\n        "hooks": [\n          {\n            "type": "command",\n            "command": "if echo \\"$CLAUDE_TOOL_OUTPUT\\" | grep -q \'/output/\'; then python3 -c \\"import sys; content=open(sys.argv[1]).read(); missing=[s for s in [\'Competitors\',\'TAM\',\'Gaps\'] if s not in content]; print(\'Missing sections:\', missing) if missing else print(\'Report complete\')\\" \\"$CLAUDE_TOOL_INPUT_path\\" 2>/dev/null || true; fi"\n          }\n        ]\n      }\n    ]\n  }\n}',
            },
          ],
        },
        errorCallouts: [
          {
            trigger: 'If the hook seems too complex',
            error: "I don't understand the settings.json syntax",
            solution:
              "You don't need to write hooks manually. Ask Claude: \"Create a hook in .claude/settings.json that after writing any file in /output/ verifies the file contains the words Competitors, TAM, and Gaps.\" Claude writes it for you.",
          },
        ],
      },
      {
        title: 'Understand the key distinction',
        explanation:
          'The difference between the three is fundamental. Skills = how Claude thinks: knowledge loaded automatically based on relevance, without you invoking it. Hooks = what happens automatically after Claude acts: no LLM tokens, pure mechanics, always consistent. Commands = what you trigger manually: shortcuts for repetitive tasks with $ARGUMENTS for dynamic inputs.',
        errorCallouts: [
          {
            trigger: 'When do I use each one?',
            error: "I don't know whether something should be a skill, hook, or command",
            solution:
              'Does Claude need to know it always without being asked? → Skill. Is it a mechanical validation that requires no reasoning? → Hook. Is it a task you manually initiate when you need it? → Command.',
          },
        ],
      },
    ],
  },

  // ─── Level 4: MCP Servers ────────────────────────────────────────────────
  {
    level: 4,
    title: 'MCP Servers',
    subtitle:
      'Claude connected to your external tools. Reads data from Notion, searches the web, and writes results back — without you writing integration code.',
    sourceUrl: 'https://code.claude.com/docs/en/mcp#installing-mcp-servers',
    summary:
      'You connected MCP servers to Claude Code. Your agent can now search the internet to enrich analysis and save reports directly to Notion — bidirectional, without integration code.',
    steps: [
      {
        title: 'Understand what an MCP Server is',
        explanation:
          "MCP (Model Context Protocol) is the protocol that turns Claude into an agent that acts on your apps. An MCP server is a bridge between Claude Code and an external tool. There are thousands of MCP servers available — Notion, Slack, Google, HubSpot, databases, and more. The key: MCP is not read-only. Claude can read data and write back to your apps.",
        errorCallouts: [
          {
            trigger: 'Seems complicated',
            error: "I don't understand what MCP is for",
            solution:
              "Think of MCP servers as plugins that give Claude superpowers. The filesystem server gives it the ability to read/write files. A Notion server lets it read pages and create new ones. Claude knows how to use them automatically — you just connect them.",
          },
        ],
      },
      {
        title: 'Open Claude Code',
        explanation: 'Open a new Claude Code session in the terminal.',
        codeBlock: {
          code: 'claude',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Add the filesystem MCP with /mcp',
        explanation:
          "Claude Code has a built-in command to add MCP servers without touching JSON. Type /mcp and follow the instructions. We start with the filesystem server — it gives access to project files and is the simplest entry point.",
        codeBlock: {
          code: '/mcp\n# Then choose "add" and follow the instructions to add filesystem\n\n# Or directly from the terminal:\nclaude mcp add filesystem -- npx -y @anthropic-ai/mcp-filesystem --dir .',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'If you see this error',
            error: 'Error: MCP server failed to start',
            solution:
              'Verify your Node.js version is 18 or higher: node --version  MCP servers require Node 18+. If you have an older version, update with: nvm install 18 && nvm use 18',
          },
        ],
      },
      {
        title: 'Open Claude Code',
        explanation: 'Open a new Claude Code session in the terminal.',
        codeBlock: {
          code: 'claude',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Test data reading',
        explanation:
          'Verify the filesystem MCP works by asking Claude to explicitly use the MCP tools.',
        codeBlock: {
          code: "\"Use the filesystem MCP to list all reports\nin /output/ and tell me which analyses I've already done\"",
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: "If Claude doesn't use the MCP tools",
            error: 'Claude responds without invoking the MCP server',
            solution:
              'Verify the server is configured correctly with: claude mcp list  It should show "filesystem" in the list. If not, repeat the previous configuration step.',
          },
        ],
      },
      {
        title: 'Add a Notion MCP to save research',
        explanation:
          "Here's where MCP gets really powerful: the connection is bidirectional. Claude can read your ideas database in Notion, do the analysis, and write the report directly to a new page — without you copying or pasting anything. Create a `.mcp.json` file at the root of the project with your Personal Access Token, then restart Claude Code.",
        setupBlock: {
          terminalCode: 'touch .mcp.json',
          manualInstructions: 'In VS Code, create the file ".mcp.json" in the main project folder (right-click in the file explorer → New File). Paste the content below and replace "your-notion-integration-token" with your actual token.',
          fileContents: [
            {
              filename: '.mcp.json',
              language: 'json',
              code: '{\n  "mcpServers": {\n    "notion": {\n      "command": "npx",\n      "args": ["-y", "@anthropic-ai/mcp-notion"],\n      "env": {\n        "NOTION_TOKEN": "your-notion-integration-token"\n      }\n    }\n  }\n}',
            },
          ],
        },
        errorCallouts: [
          {
            trigger: 'Where do I get the Notion token?',
            error: "I don't know how to get a NOTION_TOKEN",
            solution:
              'In Notion: Settings → Integrations → Create new integration. Give it access to the pages you want. Copy the "Internal Integration Secret" and use it as NOTION_TOKEN. Then connect the integration to specific pages from Notion.',
          },
          {
            trigger: 'Are there other MCP servers?',
            error: 'I want to connect other apps besides Notion',
            solution:
              'There are thousands of MCP servers available. Search github.com/modelcontextprotocol/servers for the official repository with servers for Slack, Google Drive, HubSpot, databases, and more. You can also ask Claude: "/mcp add [service-name]" and it configures it for you.',
          },
        ],
      },
      {
        title: 'Open Claude Code',
        explanation: 'Open a new Claude Code session in the terminal.',
        codeBlock: {
          code: 'claude',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Run a complete research flow',
        explanation:
          'Now combine everything: Claude reads an idea from your Notion, researches the market, and writes the report back to Notion. This is the complete loop: read data → analyze → write results.',
        codeBlock: {
          code: "\"Read the ideas from the Ideas database in Notion,\ntake the first one with status Pending,\nresearch the market using the /research command,\nand save the report to that idea's Notion page\"",
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: "If Claude only reads but doesn't write back",
            error: 'Claude does the analysis but does not update Notion',
            solution:
              "Be explicit: \"after doing the analysis, use the Notion MCP to create a new page with the report.\" MCP is bidirectional, but Claude needs you to tell it when to write back.",
          },
        ],
      },
    ],
  },

  // ─── Level 5: GSD Framework ──────────────────────────────────────────────
  {
    level: 5,
    title: 'GSD Framework',
    subtitle:
      'The solution to "context rot". A framework that splits complex projects into independent phases, each with its own plan, execution, and verification.',
    sourceUrl: 'https://code.claude.com/docs/en/best-practices#explore-first-then-plan-then-code',
    summary:
      'You used GSD to organize a complex market research into phases with verification. You understood the context rot problem and how GSD solves it with state files.',
    steps: [
      {
        title: 'The problem: context rot',
        explanation:
          "Claude has a limited context window. After ~10,000 tokens (about 7,500 words of conversation), Claude starts to \"forget\" the beginning — this is called context rot. You can see it in the context bar at the bottom of the terminal: when it reaches 95%, Claude compresses everything into summaries and precision drops. GSD solves this by saving context in files instead of keeping it in memory. Each phase has its own plan, execution, and verification file — Claude never needs to have everything in context at the same time.",
        errorCallouts: [
          {
            trigger: 'When do I need GSD?',
            error: "I don't know if my project is large enough for GSD",
            solution:
              'Use GSD when your project requires more than one session or when you have more than 3 interdependent steps. For simple tasks like "research this startup", the /research command is enough. For projects like "build a research strategy for Q2 with 20 markets", you need GSD.',
          },
        ],
      },
      {
        title: 'Open Claude Code',
        explanation: 'Open a new Claude Code session in the terminal.',
        codeBlock: {
          code: 'claude',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Install the GSD framework',
        explanation:
          "GSD is not an npm dependency — it's a file structure and prompts that Claude reads. The /gsd:new-project command creates the entire structure including the .planning/ folder with the roadmap, requirements, and the STATE file that tracks progress between sessions.",
        codeBlock: {
          code: '"/gsd:new-project"',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: "If Claude doesn't recognize /gsd:new-project",
            error: 'The command does not exist',
            solution:
              'GSD installs as a Claude Code skill. Type: "/plugin install gsd" or install it from skillsmp.com. Once installed, restart Claude Code.',
          },
        ],
      },
      {
        title: 'Open Claude Code',
        explanation: 'Open a new Claude Code session in the terminal.',
        codeBlock: {
          code: 'claude',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Create a plan with phases',
        explanation:
          'Give GSD a large research objective. It will ask questions, divide the work into phases, and create the roadmap file. Example: research the automation tools market for SMBs in LATAM.',
        codeBlock: {
          code: '"/gsd:plan-phase Research the automation tools market for\nSMBs in LATAM — I want to understand competitors,\nTAM, trends, and entry opportunities"',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'If the plan seems too detailed',
            error: 'GSD generated too many phases for what I need',
            solution:
              "Ask it to simplify: \"Reduce to maximum 3 phases, prioritizing the most important.\" GSD is designed for large projects — if your project is simpler, you can adjust the scope.",
          },
        ],
      },
      {
        title: 'Open Claude Code',
        explanation: 'Open a new Claude Code session in the terminal.',
        codeBlock: {
          code: 'claude',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Execute and verify',
        explanation:
          "GSD executes each phase and then verifies that the acceptance criteria were met before moving to the next. The STATE file in .planning/ is updated with progress — if you interrupt the work, you can resume it in another session and GSD will know exactly where it left off. First execute the phase, then verify:",
        codeBlock: {
          code: '"/gsd:execute-phase"\n\n"/gsd:verify-work"',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'If verification fails',
            error: 'Verification fails with a list of pending items',
            solution:
              "Read the output — it tells you exactly what's missing. Fix the issues and run verify again. Verification is iterative: fix → verify → fix → verify until it passes. This is what differentiates GSD from running everything without control.",
          },
          {
            trigger: 'If you interrupt and resume later',
            error: "Claude doesn't remember where the project was",
            solution:
              "Run /gsd:progress — GSD reads the STATE file and tells you exactly which phase you're on and what's left. You don't need to re-explain all the context.",
          },
        ],
      },
    ],
  },

  // ─── Level 6: Sub-agents ─────────────────────────────────────────────────
  {
    level: 6,
    title: 'Sub-agents',
    subtitle:
      'A team of specialized agents working in parallel. Each with its own context, tools, and role — like hiring specialists instead of a generalist.',
    sourceUrl: 'https://code.claude.com/docs/en/sub-agents#quickstart-create-your-first-subagent',
    summary:
      'You set up a team of research sub-agents: one per analysis dimension. You understood the difference between sequential (quality) and parallel (speed), and how --dangerously-skip-permissions enables real autonomy.',
    steps: [
      {
        title: 'Understand when to use sub-agents',
        explanation:
          "Sub-agents solve two distinct problems. First: quality — a specialist agent in market analysis will be better than a generalist. Second: speed — if you have independent tasks, you can run them in parallel across multiple terminals and finish 3x faster. There are two modes: Sequential (one terminal, sub-agents in chain): the researcher passes the brief to the analyst, the analyst passes to the writer. Better for quality and collaboration. Parallel (multiple terminals): three terminals researching three markets at the same time. Better for speed when tasks are independent.",
        errorCallouts: [
          {
            trigger: 'When NOT to use sub-agents?',
            error: "I don't know if I need sub-agents or if one session is enough",
            solution:
              "For a simple research on one market, a single session is enough. Sub-agents are worth it when you have multiple independent researches, or when you want one agent to specialize (research) and another to focus elsewhere (writing the final report).",
          },
        ],
      },
      {
        title: 'Create the agents folder',
        explanation:
          "Sub-agents are defined in .md files inside .claude/agents/. Each file has a description (when Claude uses this agent), allowed tools, and the specialized prompt.",
        setupBlock: {
          terminalCode: 'mkdir -p .claude/agents\ntouch .claude/agents/competitor-researcher.md\ntouch .claude/agents/market-sizer.md',
          manualInstructions: 'In VS Code, create the ".claude/agents" folder inside your project. Then create the two files inside that folder and paste the content for each from below.',
          fileContents: [
            {
              filename: '.claude/agents/competitor-researcher.md',
              language: 'markdown',
              code: '---\ndescription: Specialist researcher in competitive analysis. Use when mapping the competitor landscape of a market.\ntools: WebSearch, Read, Write\n---\n\nYou are a market analyst specialized in competitive research.\nWhen assigned a market:\n1. Identify at least 5 direct and 3 indirect competitors\n2. For each: funding, business model, pricing, strengths and weaknesses\n3. Save the analysis in /output/competitors-[market].md',
            },
            {
              filename: '.claude/agents/market-sizer.md',
              language: 'markdown',
              code: "---\ndescription: Specialist in market size estimation (TAM/SAM/SOM). Use when quantifying the size of a market opportunity.\ntools: WebSearch, Read, Write\n---\n\nYou are a quantitative analyst specialized in market sizing.\nAlways use the top-down method with verifiable sources.\nNever invent numbers — if you can't find data, say so with an uncertainty range.",
            },
          ],
        },
        errorCallouts: [
          {
            trigger: "If Claude doesn't use agents automatically",
            error: 'Claude does everything itself instead of delegating to sub-agents',
            solution:
              'Be explicit in the prompt: "Use the competitor-researcher sub-agent to analyze competitors." Sub-agents can also be invoked by telling Claude to delegate a specific part of the work.',
          },
        ],
      },
      {
        title: 'Open Claude Code',
        explanation: 'Open a new Claude Code session in the terminal.',
        codeBlock: {
          code: 'claude',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Run sub-agents sequentially',
        explanation:
          'First test sequential mode: ask the main Claude to coordinate the sub-agents, one after another. The output of one feeds into the next.',
        codeBlock: {
          code: '"Research the fintech market for freelancers in LATAM:\n1. Use the competitor-researcher sub-agent to map competitors\n2. Use the market-sizer sub-agent to estimate the TAM\n3. With both results, generate an executive report in /output/"',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: "If sub-agents can't access each other's files",
            error: "The market-sizer can't read the competitor-researcher's output",
            solution:
              "Sub-agents share the file system. Make sure the first agent saves its output with a specific path and the second reads it explicitly. You can coordinate this in the main prompt.",
          },
        ],
      },
      {
        title: 'Open Claude Code in each terminal',
        explanation:
          "Open multiple terminals and run Claude Code with the --dangerously-skip-permissions flag in each one. This flag prevents Claude from asking for confirmation on each action — necessary when you're not watching the terminals.",
        codeBlock: {
          code: 'claude --dangerously-skip-permissions',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Run sub-agents in parallel',
        explanation:
          'For maximum speed, run independent researches in parallel. With Claude running in each terminal, type a different research command in each one at the same time.',
        codeBlock: {
          code: "# Terminal 1:\n\"/research 'fintech for freelancers in Argentina'\"\n\n# Terminal 2 (simultaneously):\n\"/research 'fintech for freelancers in Mexico'\"\n\n# Terminal 3:\n\"/research 'fintech for freelancers in Colombia'\"",
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'About --dangerously-skip-permissions',
            error: 'Is it safe to use this flag?',
            solution:
              "The flag does exactly what it says: skips security confirmations. Use it only in projects where you trust what Claude is going to do — and always within a specific project folder, not in your home directory. With context well-defined in CLAUDE.md and agents well-specified, the risk is minimal.",
          },
        ],
      },
    ],
  },

  // ─── Level 7: RALPH Loop ─────────────────────────────────────────────────
  {
    level: 7,
    title: 'RALPH Loop',
    subtitle:
      'You give it a list of researches. RALPH executes them all autonomously, with fresh context on each iteration. You come back to find the reports ready.',
    sourceUrl: 'https://code.claude.com/docs/en/overview',
    summary:
      'You ran your first autonomous pipeline with RALPH. Claude executed all your market researches in batch, evaluating acceptance criteria on each one and moving to the next with fresh context. You completed all 8 levels of Claude Code.',
    steps: [
      {
        title: 'GSD vs RALPH: when to use each',
        explanation:
          "GSD and RALPH solve different problems. GSD is a planner and executor for complex projects where the scope isn't fully defined — you need a human supervising the phases. RALPH is a pure executor for well-defined batch tasks — it runs alone until everything is done, without human intervention. For 'research 10 markets with clear criteria', RALPH is the right tool. For 'build the Q2 research strategy', you need GSD first. RALPH also resolves context rot automatically: each task runs in a fresh context window, without carrying over history from previous ones.",
        errorCallouts: [
          {
            trigger: 'When NOT to use RALPH?',
            error: "I don't know if my tasks are suitable for RALPH",
            solution:
              "RALPH works when tasks are independent, have clear and verifiable acceptance criteria, and don't require creative decisions between steps. If your tasks depend on each other or need your input mid-process, use GSD or sequential sub-agents.",
          },
        ],
      },
      {
        title: 'Open Claude Code',
        explanation: 'Open a new Claude Code session in the terminal.',
        codeBlock: {
          code: 'claude',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Install RALPH',
        explanation:
          'RALPH installs as a Claude Code plugin. Run the install command.',
        codeBlock: {
          code: '/plugin install ralph',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: "If the plugin isn't recognized",
            error: "/plugin install ralph fails or doesn't exist",
            solution:
              "Verify you're using a recent version of Claude Code: claude --version. If it's outdated, update with: claude update. You can also install RALPH from skillsmp.com following the repository instructions.",
          },
        ],
      },
      {
        title: 'Create your prd.json',
        explanation:
          "prd.json is the task list that RALPH will execute. Each task has: a description (what to do), acceptance criteria (how Claude verifies it's done), and a status (pending → done). Criteria must be objective and verifiable — avoid things like \"the report is good\". Use things like \"the file exists in /output/\" or \"includes the TAM section\".",
        setupBlock: {
          terminalCode: 'touch prd.json',
          manualInstructions: 'In VS Code, create the file "prd.json" in the main project folder. Paste the content below and modify the tasks to match your research goals.',
          fileContents: [
            {
              filename: 'prd.json',
              language: 'json',
              code: '{\n  "tasks": [\n    {\n      "id": 1,\n      "description": "Research the freelance management tools market in LATAM",\n      "acceptance_criteria": [\n        "Report created in /output/ with a name that includes the date",\n        "Includes at least 5 direct competitors",\n        "Includes TAM estimate with sources",\n        "Includes Gaps and Opportunities section"\n      ],\n      "status": "pending"\n    },\n    {\n      "id": 2,\n      "description": "Research the e-commerce market for artisans in Argentina",\n      "acceptance_criteria": [\n        "Report created in /output/ with a name that includes the date",\n        "Includes analysis of distribution channels (Mercado Libre, Instagram, etc.)",\n        "Includes market commission and fee benchmarks"\n      ],\n      "status": "pending"\n    },\n    {\n      "id": 3,\n      "description": "Research the invoicing software market for SMBs in Mexico",\n      "acceptance_criteria": [\n        "Report created in /output/ with a name that includes the date",\n        "Includes regulatory context analysis (SAT, CFDI)",\n        "Includes at least 3 competitors with price comparison"\n      ],\n      "status": "pending"\n    }\n  ]\n}',
            },
          ],
        },
        errorCallouts: [
          {
            trigger: 'If criteria are hard to define',
            error: "I don't know how to write verifiable criteria",
            solution:
              'Ask yourself: can Claude answer yes or no to this without subjective reasoning? "The report exists" → yes. "The report is complete" → no (what is complete?). "The report includes the Competitors section" → yes. The more objective, the more reliable the autonomous execution.',
          },
        ],
      },
      {
        title: 'Open Claude Code',
        explanation: 'Open a new Claude Code session in the terminal.',
        codeBlock: {
          code: 'claude',
          language: 'bash',
        },
        errorCallouts: [],
      },
      {
        title: 'Run RALPH with an iteration limit',
        explanation:
          'Always run RALPH with --max-iterations as a safeguard. Without this limit, if something goes wrong it could run indefinitely and consume many tokens. A good rule: ~3x the number of tasks. With 3 tasks, use max-iterations 10.',
        codeBlock: {
          code: '/ralph --max-iterations 10',
          language: 'bash',
        },
        errorCallouts: [
          {
            trigger: 'If RALPH finishes before completing all tasks',
            error: 'RALPH stops with some tasks still "pending"',
            solution:
              'Check the prd.json — RALPH updates statuses in real time. If a task stayed pending, verify the criteria are verifiable. You can run RALPH again and it will resume from the pending tasks.',
          },
          {
            trigger: 'If you want to see progress in real time',
            error: "I don't know if RALPH is working or got stuck",
            solution:
              'Open another terminal and run: watch cat prd.json — you\'ll see statuses changing from "pending" to "done" in real time. Reports will also appear in /output/ as they are completed.',
          },
        ],
      },
      {
        title: 'Review what you built',
        explanation:
          "Look at your /output/ folder. You have complete market reports, generated fully autonomously, with fresh context for each one. You completed all 8 levels of Claude Code. You went from chatting with Claude to having research pipelines that run on their own while you do something else. Chat mode → Plan Mode → CLAUDE.md → Commands, Skills & Hooks → MCP Servers → GSD Framework → Sub-agents → Autonomous RALPH. These are the same patterns used by research teams and professional developers with Claude Code.",
        errorCallouts: [
          {
            trigger: "I can't believe I made it this far",
            error: "I feel like I didn't understand everything 100%",
            solution:
              "That's completely normal. The important thing is that you executed it and now recognize the patterns. The next time you face a problem with Claude Code, you'll know what level of tooling you need. That's exactly what separates someone who 'uses Claude Code' from someone who masters it.",
          },
        ],
      },
    ],
  },
];
