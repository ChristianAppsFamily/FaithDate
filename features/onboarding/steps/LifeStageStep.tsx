import { useState } from 'react';

import { TextField } from '@/components/ui';
import type { MaritalHistory, WantsChildren } from '@/data';

import { ChoiceGroup } from '../form/ChoiceGroup';
import { ContinueFooter } from '../form/ContinueFooter';
import { PrivacyNote } from '../form/PrivacyNote';
import { StepFrame } from '../StepFrame';
import type { OnboardingController } from '../useOnboardingDraft';

const MARITAL: { value: MaritalHistory; label: string }[] = [
  { value: 'never', label: 'Never married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
];

const YES_NO: { value: 'yes' | 'no'; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const WANTS: { value: WantsChildren; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'open', label: 'Open' },
  { value: 'not_sure', label: 'Not sure' },
];

/** Design 02. Conditional fields appear when divorced/widowed or has children. */
export function LifeStageStep({ ctrl }: { ctrl: OnboardingController }) {
  const draft = ctrl.draft!;
  const [marital, setMarital] = useState<MaritalHistory | null>(draft.profile.marital_history ?? null);
  const [sinceYear, setSinceYear] = useState(draft.profile.marital_since_year ? String(draft.profile.marital_since_year) : '');
  const [hasChildren, setHasChildren] = useState<'yes' | 'no' | null>(
    draft.profile.has_children === undefined ? null : draft.profile.has_children ? 'yes' : 'no',
  );
  const [childrenAges, setChildrenAges] = useState((draft.profile.children_ages ?? []).join(', '));
  const [wants, setWants] = useState<WantsChildren | null>(draft.profile.wants_children ?? null);

  const needsYear = marital === 'divorced' || marital === 'widowed';
  const canContinue = marital !== null && hasChildren !== null && wants !== null;
  const need = !marital ? 'Choose your marital history.' : !hasChildren ? 'Do you have children?' : !wants ? 'Do you want children?' : null;

  const onContinue = () => {
    const ages = childrenAges
      .split(/[,\s]+/)
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n) && n > 0 && n < 40);
    const yearNum = sinceYear.trim() ? Number(sinceYear.trim()) : null;
    void ctrl.continueWith({
      profile: {
        marital_history: marital!,
        marital_since_year: needsYear && yearNum && yearNum >= 1950 && yearNum <= new Date().getFullYear() ? yearNum : null,
        has_children: hasChildren === 'yes',
        children_ages: hasChildren === 'yes' ? ages : [],
        wants_children: wants!,
      },
    });
  };

  return (
    <StepFrame
      step={ctrl.step}
      footer={<ContinueFooter disabled={!canContinue} loading={ctrl.saving} error={ctrl.error} need={need} onContinue={onContinue} />}
    >
      <ChoiceGroup label="Marital history" options={MARITAL} value={marital} onChange={setMarital} />
      {needsYear ? (
        <TextField
          label="Since what year? (optional)"
          value={sinceYear}
          onChangeText={setSinceYear}
          placeholder="e.g. 2019"
          keyboardType="number-pad"
          maxLength={4}
        />
      ) : null}
      <ChoiceGroup label="Do you have children?" options={YES_NO} value={hasChildren} onChange={setHasChildren} />
      {hasChildren === 'yes' ? (
        <TextField
          label="Ages of your children"
          value={childrenAges}
          onChangeText={setChildrenAges}
          placeholder="e.g. 4, 7"
          keyboardType="numbers-and-punctuation"
          hint="Comma-separated ages. Shown only if you choose to share them."
        />
      ) : null}
      <ChoiceGroup label="Do you want children?" options={WANTS} value={wants} onChange={setWants} />
      <PrivacyNote />
    </StepFrame>
  );
}
