'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { getQuizQuestions, type QuizQuestionState, type GenerateQuizQuestionOutput } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuizMinigame } from '@/components/cosmic-explorer/quiz-minigame';


const initialQuizState: QuizQuestionState = { success: false };

function QuestionCard({ 
  question, 
  questionIndex,
  selectedAnswer,
  onAnswerChange,
  isSubmitted,
  t
}: { 
  question: GenerateQuizQuestionOutput, 
  questionIndex: number,
  selectedAnswer: string | null,
  onAnswerChange: (answer: string) => void,
  isSubmitted: boolean,
  t: (key: string) => string
}) {
  const isCorrect = isSubmitted && selectedAnswer === question.correctAnswer;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">{questionIndex + 1}. {question.question}</CardTitle>
        {!isSubmitted && <CardDescription>{t('cuestionario.selectOption')}</CardDescription>}
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAnswer ?? ''}
          onValueChange={onAnswerChange}
          disabled={isSubmitted}
          className="space-y-3"
        >
          {question.options.map((option, index) => {
            const id = `q${questionIndex}-option-${index}`;
            let itemClass = '';
            if (isSubmitted) {
              if (option === question.correctAnswer) {
                itemClass = 'text-green-500 font-bold';
              } else if (option === selectedAnswer) {
                itemClass = 'text-destructive font-bold';
              }
            }
            return (
              <div key={id} className="flex items-center space-x-3">
                <RadioGroupItem value={option} id={id} />
                <Label htmlFor={id} className={`flex-1 ${itemClass}`}>
                  {option}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
      {isSubmitted && (
        <CardFooter>
            <Alert variant={isCorrect ? 'default' : 'destructive'} className={`${isCorrect ? 'border-green-500/50' : 'border-destructive/50'} w-full`}>
                {isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>
                {isCorrect ? t('cuestionario.correct') : t('cuestionario.incorrect')}
                </AlertTitle>
                <AlertDescription>
                {question.explanation}
                </AlertDescription>
            </Alert>
        </CardFooter>
      )}
    </Card>
  )
}

export default function CuestionarioPage() {
  const { t, language } = useLanguage();
  const [quizState, submitAction, isPending] = useActionState(getQuizQuestions, initialQuizState);
  const [selectedAnswers, setSelectedAnswers] = React.useState<(string | null)[]>([]);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [category, setCategory] = React.useState('Asteroids');
  const [results, setResults] = React.useState<boolean[]>([]);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleCheckAnswers = () => {
    if (!quizState.questions) return;
    const newResults = quizState.questions.map((question, index) => {
      return selectedAnswers[index] === question.correctAnswer;
    });
    setResults(newResults);
    setIsSubmitted(true);
  };
  
  const startNewQuiz = React.useCallback(() => {
    setSelectedAnswers(Array(3).fill(null));
    setIsSubmitted(false);
    setResults([]);
    
    React.startTransition(() => {
      const formData = new FormData();
      formData.append('category', category);
      formData.append('language', language === 'es' ? 'Spanish' : 'English');
      submitAction(formData);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, language]);
  
  React.useEffect(() => {
    startNewQuiz();
  }, [startNewQuiz]);

  const allQuestionsAnswered = selectedAnswers.every(answer => answer !== null) && selectedAnswers.length === 3;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold tracking-tighter">{t('cuestionario.page.title')}</h1>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('cuestionario.category.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Asteroids">{t('types.Asteroid')}</SelectItem>
              <SelectItem value="Comets">{t('types.Comet')}</SelectItem>
              <SelectItem value="Dwarf Planets">{t('types.Dwarf Planet')}</SelectItem>
              <SelectItem value="Meteoroids">{t('types.Meteoroid')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-8">
          {isPending && (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-lg text-muted-foreground">{t('cuestionario.loading')}</p>
            </div>
          )}

          {!isPending && quizState.error && (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                <XCircle className="h-12 w-12 text-destructive mb-4" />
                <p className="text-lg text-destructive">{t('toast.error.title')}</p>
                <p className="text-muted-foreground">{quizState.error}</p>
            </div>
          )}

          {!isPending && quizState.success && quizState.questions && (
            <>
              {quizState.questions.map((q, index) => (
                <QuestionCard 
                  key={index}
                  question={q}
                  questionIndex={index}
                  selectedAnswer={selectedAnswers[index]}
                  onAnswerChange={(answer) => handleAnswerChange(index, answer)}
                  isSubmitted={isSubmitted}
                  t={t}
                />
              ))}

              <div className="flex justify-center pt-4">
                {!isSubmitted ? (
                  <Button 
                    size="lg" 
                    onClick={handleCheckAnswers}
                    disabled={!allQuestionsAnswered}
                  >
                    {t('cuestionario.checkAnswers')}
                  </Button>
                ) : (
                  <Button size="lg" onClick={startNewQuiz}>
                    {t('cuestionario.newQuiz')}
                  </Button>
                )}
              </div>

              {isSubmitted && (
                <QuizMinigame results={results} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
