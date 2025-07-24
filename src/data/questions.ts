import gongwuData from './gongwuQuestions.json';
import tizhiData from './questionsNew.json';
import zhichangData from './zhichangQuestions.json';
import canzhuoliData from './canzhuoliQuestions.json';

export interface Question {
  id: string;
  category: string;
  scenario: string;
  question: string;
  options: {
    text: string;
    score: number;
    feedback: string;
    leaderThought: string;
    translation?: string;
  }[];
}

// 合并所有题库
export const questions: Question[] = [
  ...gongwuData.questions,
  ...tizhiData.questions,
  ...zhichangData.questions,
  ...canzhuoliData.questions
];