export type LevelId = 1 | 2 | 3;

export interface Question {
  id: string;
  level: LevelId;
  prompt: string;
  options: string[]; // A-D
  answerIndex: number; // 0..3
}
