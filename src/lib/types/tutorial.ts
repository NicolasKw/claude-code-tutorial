export interface TutorialProgress {
  currentLevel: number;
  completedLevels: number[];
  completedSteps: Record<number, number[]>;
}

export const PROGRESS_KEY = 'tutorial_progress';
export const TOTAL_LEVELS = 7;
export const DEFAULT_PROGRESS: TutorialProgress = {
  currentLevel: 0,
  completedLevels: [],
  completedSteps: {},
};
