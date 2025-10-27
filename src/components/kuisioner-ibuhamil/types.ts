// Types for EPDS Questionnaire
export interface PregnantWoman {
  id: string;
  name: string;
  age?: number;
  trimester?: string;
}

export interface Question {
  id: number;
  text: string;
}

export interface ResponseOption {
  value: number;
  label: string;
  description: string;
}

export interface Answer {
  questionId: number;
  value: number | null;
}