import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { onboardingSteps, type OnboardingStepId } from '@/config/onboarding';
import { rules } from '@/config/rules';
import { adapter, type OnboardingDraft } from '@/data';

export interface OnboardingController {
  step: number;
  stepId: OnboardingStepId;
  draft: OnboardingDraft | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  setError: (message: string | null) => void;
  /** Persist a patch, mark this step complete, and advance (or finish). */
  continueWith: (patch: Partial<OnboardingDraft>) => Promise<void>;
  /** Persist without advancing (e.g. skip voice while clearing the clip). */
  saveQuiet: (patch: Partial<OnboardingDraft>) => Promise<OnboardingDraft>;
}

/** Loads the draft and handles save-and-advance for steps 2 to 10. */
export function useOnboardingDraft(): OnboardingController {
  const { n } = useLocalSearchParams<{ n: string }>();
  const router = useRouter();
  const step = Math.min(rules.onboarding.totalSteps, Math.max(2, Number(n) || 2));
  const def = onboardingSteps.find((s) => s.number === step)!;
  const [draft, setDraft] = useState<OnboardingDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    adapter
      .getOnboardingDraft()
      .then((d) => {
        if (!cancelled) {
          setDraft(d);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Could not load your progress.');
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [step]);

  const saveQuiet = useCallback(
    async (patch: Partial<OnboardingDraft>) => {
      const next = await adapter.saveOnboardingStep(def.id, patch);
      setDraft(next);
      return next;
    },
    [def.id],
  );

  const continueWith = useCallback(
    async (patch: Partial<OnboardingDraft>) => {
      setSaving(true);
      setError(null);
      try {
        await adapter.saveOnboardingStep(def.id, { ...patch, completed_step: step });
        if (step >= rules.onboarding.totalSteps) router.replace('/(onboarding)/finish');
        else router.replace({ pathname: '/(onboarding)/step/[n]', params: { n: String(step + 1) } });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not save. Try again.');
        setSaving(false);
      }
    },
    [def.id, router, step],
  );

  return { step, stepId: def.id, draft, loading, saving, error, setError, continueWith, saveQuiet };
}
