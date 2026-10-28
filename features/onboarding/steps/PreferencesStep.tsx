import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button, Text, TextField } from '@/components/ui';
import { christianRoom, type DenominationId } from '@/config/faiths';
import { onboardingCopy } from '@/config/onboarding';
import { useTheme } from '@/theme';

import { ChoiceGroup } from '../form/ChoiceGroup';
import { StepFrame } from '../StepFrame';
import type { OnboardingController } from '../useOnboardingDraft';

const DISTANCES = [
  { value: '25', label: '25 km' },
  { value: '50', label: '50 km' },
  { value: '80', label: '80 km' },
  { value: '160', label: '160 km' },
  { value: '0', label: 'Anywhere' },
] as const;

const YES_NO = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
] as const;

export function PreferencesStep({ ctrl }: { ctrl: OnboardingController }) {
  const { spacing } = useTheme();
  const draft = ctrl.draft!;
  const [ageMin, setAgeMin] = useState(String(draft.preferences.age_min ?? 25));
  const [ageMax, setAgeMax] = useState(String(draft.preferences.age_max ?? 40));
  const [distance, setDistance] = useState(String(draft.preferences.distance_km ?? 80));
  const [denoms, setDenoms] = useState<DenominationId[]>(draft.preferences.denominations ?? []);
  const [openDivorced, setOpenDivorced] = useState<'yes' | 'no' | null>(
    draft.preferences.open_to_divorced === undefined ? null : draft.preferences.open_to_divorced ? 'yes' : 'no',
  );
  const [openChildren, setOpenChildren] = useState<'yes' | 'no' | null>(
    draft.preferences.open_to_children === undefined ? null : draft.preferences.open_to_children ? 'yes' : 'no',
  );

  useEffect(() => {
    setAgeMin(String(draft.preferences.age_min ?? 25));
    setAgeMax(String(draft.preferences.age_max ?? 40));
    setDistance(String(draft.preferences.distance_km ?? 80));
    setDenoms(draft.preferences.denominations ?? []);
    setOpenDivorced(draft.preferences.open_to_divorced === undefined ? null : draft.preferences.open_to_divorced ? 'yes' : 'no');
    setOpenChildren(draft.preferences.open_to_children === undefined ? null : draft.preferences.open_to_children ? 'yes' : 'no');
  }, [draft]);

  const minN = Number(ageMin);
  const maxN = Number(ageMax);
  const agesOk = Number.isFinite(minN) && Number.isFinite(maxN) && minN >= 18 && maxN <= 99 && minN <= maxN;
  const canContinue = agesOk && openDivorced !== null && openChildren !== null;

  const toggleDenom = (id: DenominationId) => {
    setDenoms((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));
  };

  return (
    <StepFrame
      step={ctrl.step}
      footer={
        <View style={{ gap: spacing.sm }}>
          {ctrl.error ? (
            <Text variant="caption" color="danger" align="center">
              {ctrl.error}
            </Text>
          ) : null}
          <Button
            label={onboardingCopy.continue}
            disabled={!canContinue}
            loading={ctrl.saving}
            onPress={() =>
              void ctrl.continueWith({
                preferences: {
                  age_min: minN,
                  age_max: maxN,
                  distance_km: Number(distance) || 0,
                  denominations: denoms,
                  open_to_divorced: openDivorced === 'yes',
                  open_to_children: openChildren === 'yes',
                },
              })
            }
          />
        </View>
      }
    >
      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <TextField label="Age min" value={ageMin} onChangeText={setAgeMin} keyboardType="number-pad" maxLength={2} containerStyle={{ flex: 1 }} />
        <TextField
          label="Age max"
          value={ageMax}
          onChangeText={setAgeMax}
          keyboardType="number-pad"
          maxLength={2}
          containerStyle={{ flex: 1 }}
          error={!agesOk ? 'Min must be 18+ and not above max.' : null}
        />
      </View>

      <ChoiceGroup
        label="Distance"
        options={DISTANCES.map((d) => ({ value: d.value, label: d.label }))}
        value={distance}
        onChange={setDistance}
      />

      <ChoiceGroup
        label="Denominations you're open to"
        options={christianRoom.denominations.map((d) => ({ value: d.id, label: d.label }))}
        value={null}
        onChange={() => undefined}
        multi
        values={denoms}
        onToggle={toggleDenom}
        footer={
          <Text variant="caption" color="muted" style={{ marginTop: spacing.xs }}>
            Leave empty to see everyone in the Christian room.
          </Text>
        }
      />

      <ChoiceGroup label="Open to someone divorced?" options={[...YES_NO]} value={openDivorced} onChange={setOpenDivorced} />
      <ChoiceGroup label="Open to someone with children?" options={[...YES_NO]} value={openChildren} onChange={setOpenChildren} />
    </StepFrame>
  );
}
