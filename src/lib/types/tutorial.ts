export interface TutorialProgress {
  currentLevel: number;
  completedLevels: number[];
  completedSteps: Record<number, number[]>;
  completedAt?: string;
}

export const PROGRESS_KEY = 'tutorial_progress';
export const TOTAL_LEVELS = 8;   // niveles reales (0–7), usado en lógica interna
export const DISPLAY_LEVELS = 7; // niveles visibles (el 0 no cuenta)
export const DEFAULT_PROGRESS: TutorialProgress = {
  currentLevel: 0,
  completedLevels: [],
  completedSteps: {},
};

export interface ErrorCalloutContent {
  trigger: string;    // e.g. "Si ves este error"
  error: string;      // the error message / condition
  solution: string;   // what to do to fix it
}

export interface FileContent {
  code: string;
  language: string;
  filename?: string;
}

export interface SetupBlock {
  terminalCode: string;
  manualInstructions: string;
  fileContents?: FileContent[];
}

export interface StepContent {
  title: string;
  explanation: string;
  setupBlock?: SetupBlock;
  codeBlock?: {
    code: string;
    language: string;
  };
  errorCallouts: ErrorCalloutContent[];
}

export interface LevelContent {
  level: number;        // 0-7
  title: string;        // e.g. "Chatbot"
  subtitle: string;     // e.g. "Tu primera conversacion con Claude Code"
  summary: string;      // shown in AchievementOverlay "Que lograste" card
  sourceUrl?: string;   // link to official documentation for this level
  steps: StepContent[];
}
