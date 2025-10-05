'use server';

import { explainAstronomicalConcept } from '@/ai/flows/explain-astronomical-concepts';
import { evaluateHypotheticalScenario } from '@/ai/flows/evaluate-hypothetical-scenario';
import { generateQuizQuestion, type GenerateQuizQuestionOutput } from '@/ai/flows/generate-quiz-question';


export type ExplanationState = {
  success: boolean;
  explanation?: string;
  error?: string;
};

export async function getExplanation(
  prevState: ExplanationState,
  formData: FormData
): Promise<ExplanationState> {
  const objectName = formData.get('objectName') as string;
  const language = formData.get('language') as string;

  try {
    if (!objectName) {
      return { success: false, error: 'Object name is required.' };
    }
    const result = await explainAstronomicalConcept({ objectName, language });
    return { success: true, explanation: result.explanation };
  } catch (error) {
    console.error('Error in getExplanation action:', error);
    return { success: false, error: 'An unexpected error occurred while generating the explanation.' };
  }
}

export type ScenarioState = {
  success: boolean;
  evaluation?: string;
  error?: string;
};

export async function getHypotheticalScenario(
  prevState: ScenarioState,
  formData: FormData
): Promise<ScenarioState> {
  const objectName = formData.get('objectName') as string;
  const scenario = formData.get('scenario') as string;
  const language = formData.get('language') as string;
  
  try {
    if (!objectName || !scenario) {
      return { success: false, error: 'Object name and scenario are required.' };
    }
    const result = await evaluateHypotheticalScenario({ objectName, scenario, language });
    return { success: true, evaluation: result.evaluation };
  } catch (error) {
    console.error('Error in getHypotheticalScenario action:', error);
    return { success: false, error: 'An unexpected error occurred while evaluating the scenario.' };
  }
}


export type QuizQuestionState = {
  success: boolean;
  questions?: GenerateQuizQuestionOutput[];
  error?: string;
};

export async function getQuizQuestions(
  prevState: QuizQuestionState,
  formData: FormData
): Promise<QuizQuestionState> {
  const category = formData.get('category') as string;
  const language = formData.get('language') as string;
  const count = 3;
  
  try {
    if (!category) {
      return { success: false, error: 'Category is required.' };
    }
    const questionPromises = Array.from({ length: count }, () => 
      generateQuizQuestion({ category, language })
    );

    const results = await Promise.all(questionPromises);
    
    return { success: true, questions: results };
  } catch (error) {
    console.error('Error in getQuizQuestions action:', error);
    return { success: false, error: 'An unexpected error occurred while generating the questions.' };
  }
}
