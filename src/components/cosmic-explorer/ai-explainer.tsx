'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { getExplanation, getHypotheticalScenario, type ExplanationState, type ScenarioState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { WandSparkles, BrainCircuit } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from '@/context/language-context';

interface AiExplainerProps {
  objectName: string;
}

const initialExplanationState: ExplanationState = { success: false };
const initialScenarioState: ScenarioState = { success: false };

export function AiExplainer({ objectName }: AiExplainerProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const [explanationState, submitExplanation, isExplanationPending] = useActionState(getExplanation, initialExplanationState);
  const [scenarioState, submitScenario, isScenarioPending] = useActionState(getHypotheticalScenario, initialScenarioState);

  const [isExplanationDialogOpen, setIsExplanationDialogOpen] = React.useState(false);
  const [isScenarioDialogOpen, setIsScenarioDialogOpen] = React.useState(false);
  const scenarioInputRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (explanationState.success && explanationState.explanation) {
      setIsExplanationDialogOpen(true);
    } else if (explanationState.error) {
      toast({
        variant: 'destructive',
        title: t('toast.error.title'),
        description: explanationState.error || t('toast.error.defaultAi'),
      });
    }
  }, [explanationState, toast, t]);

  React.useEffect(() => {
    if (scenarioState.success && scenarioState.evaluation) {
      setIsScenarioDialogOpen(true);
    } else if (scenarioState.error) {
      toast({
        variant: 'destructive',
        title: t('toast.error.title'),
        description: scenarioState.error || t('toast.error.scenarioFailed'),
      });
    }
  }, [scenarioState, toast, t]);

  return (
    <div className="space-y-4">
       <form action={submitExplanation}>
          <input type="hidden" name="objectName" value={objectName} />
          <input type="hidden" name="language" value={language === 'es' ? 'Spanish' : 'English'} />
          <Button type="submit" disabled={isExplanationPending} className="mt-2 w-full">
            <WandSparkles className="mr-2 h-4 w-4" />
            {isExplanationPending ? t('ai.explainer.loading') : `${t('ai.explainer.button')} "${objectName}"`}
          </Button>
      </form>
      
      <form action={submitScenario} className="space-y-4">
        <div className="grid w-full gap-2">
           <Label htmlFor="hypothetical-scenario">{t('ai.hypothetical.label')}</Label>
          <Textarea 
            id="hypothetical-scenario"
            name="scenario"
            ref={scenarioInputRef}
            placeholder={t('ai.hypothetical.placeholder')} 
            disabled={isScenarioPending}
          />
           <input type="hidden" name="objectName" value={objectName} />
           <input type="hidden" name="language" value={language === 'es' ? 'Spanish' : 'English'} />
          <Button type="submit" disabled={isScenarioPending}>
            <BrainCircuit className="mr-2 h-4 w-4" />
            {isScenarioPending ? t('ai.hypothetical.loading') : t('ai.hypothetical.button')}
          </Button>
        </div>
      </form>

      <AlertDialog open={isExplanationDialogOpen} onOpenChange={setIsExplanationDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('ai.explainer.dialogTitle')} {objectName}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="prose prose-invert text-foreground max-h-[60vh] overflow-y-auto">
               {explanationState.explanation}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsExplanationDialogOpen(false)}>{t('common.close')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isScenarioDialogOpen} onOpenChange={setIsScenarioDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('ai.hypothetical.dialogTitle')}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="prose prose-invert text-foreground max-h-[60vh] overflow-y-auto">
                {scenarioState.evaluation}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsScenarioDialogOpen(false)}>{t('common.close')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
