'use server';

/**
 * @fileOverview Generates a multiple-choice quiz question about a given astronomical category.
 *
 * - generateQuizQuestion - A function that takes a category and returns a question, options, answer, and explanation.
 * - GenerateQuizQuestionInput - The input type for the function.
 * - GenerateQuizQuestionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizQuestionInputSchema = z.object({
  category: z.string().describe('The category of the astronomy question (e.g., "Comets", "Asteroids").'),
  language: z.string().describe('The language for the response (e.g., "Spanish", "English").'),
});
export type GenerateQuizQuestionInput = z.infer<typeof GenerateQuizQuestionInputSchema>;

const GenerateQuizQuestionOutputSchema = z.object({
  question: z.string().describe('The generated multiple-choice question.'),
  options: z.array(z.string()).describe('An array of 4-5 plausible options for the question.'),
  correctAnswer: z.string().describe('The correct answer from the options array.'),
  explanation: z.string().describe('A brief explanation of why the correct answer is right.'),
});
export type GenerateQuizQuestionOutput = z.infer<typeof GenerateQuizQuestionOutputSchema>;

export async function generateQuizQuestion(input: GenerateQuizQuestionInput): Promise<GenerateQuizQuestionOutput> {
  return generateQuizQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizQuestionPrompt',
  input: {schema: GenerateQuizQuestionInputSchema},
  output: {schema: GenerateQuizQuestionOutputSchema},
  prompt: `You are an astronomy expert creating a fun and educational quiz. Your task is to generate a single multiple-choice question.

**Instructions:**
- **Language:** Always respond in **{{{language}}}**.
- **Category:** The question must be about **{{{category}}}**.
- **Difficulty:** The question should be challenging but not obscure. Suitable for an enthusiastic amateur.
- **Options:** Provide 4 plausible options. Only one can be correct.
- **Explanation:** Provide a concise, clear explanation for the correct answer.

Generate one question based on the category: {{{category}}}`,
});

const generateQuizQuestionFlow = ai.defineFlow({
    name: 'generateQuizQuestionFlow',
    inputSchema: GenerateQuizQuestionInputSchema,
    outputSchema: GenerateQuizQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
