import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button, Text, TextField } from '@/components/ui';
import { onboardingCopy } from '@/config/onboarding';
import { rules } from '@/config/rules';
import type { Gender } from '@/data';
import { ageFromBirthdate } from '@/lib/time';
import { useTheme } from '@/theme';

import { ChoiceGroup } from '../form/ChoiceGroup';
import { StepFrame } from '../StepFrame';
import type { OnboardingController } from '../useOnboardingDraft';

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
];

export function BasicsStep({ ctrl }: { ctrl: OnboardingController }) {
  const { spacing } = useTheme();
  const draft = ctrl.draft!;
  const [firstName, setFirstName] = useState(draft.profile.first_name ?? '');
  const [gender, setGender] = useState<Gender | null>(draft.profile.gender ?? null);
  const [birthdate, setBirthdate] = useState(draft.profile.birthdate ?? '');
  const [city, setCity] = useState(draft.profile.city ?? '');
  const [birthError, setBirthError] = useState<string | null>(null);

  useEffect(() => {
    setFirstName(draft.profile.first_name ?? '');
    setGender(draft.profile.gender ?? null);
    setBirthdate(draft.profile.birthdate ?? '');
    setCity(draft.profile.city ?? '');
  }, [draft]);

  const age = /^\d{4}-\d{2}-\d{2}$/.test(birthdate) ? ageFromBirthdate(birthdate) : null;
  const under18 = age !== null && age < rules.onboarding.minAge;
  const canContinue = firstName.trim().length > 0 && gender !== null && Boolean(city.trim()) && age !== null && !under18;

  const onContinue = () => {
    if (under18) {
      setBirthError(onboardingCopy.under18);
      return;
    }
    if (age === null) {
      setBirthError('Enter your birthdate as YYYY-MM-DD.');
      return;
    }
    setBirthError(null);
    void ctrl.continueWith({
      profile: {
        first_name: firstName.trim(),
        gender: gender!,
        seeking: gender === 'male' ? 'female' : 'male',
        birthdate,
        city: city.trim(),
      },
    });
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
          <Button label={onboardingCopy.continue} onPress={onContinue} disabled={!canContinue} loading={ctrl.saving} />
        </View>
      }
    >
      <TextField
        label="First name"
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
        autoComplete="given-name"
        placeholder="Grace"
        maxLength={40}
      />
      <ChoiceGroup label="Gender" options={GENDERS} value={gender} onChange={setGender} />
      <TextField
        label="Birthdate"
        value={birthdate}
        onChangeText={(t) => {
          setBirthdate(t);
          setBirthError(null);
        }}
        placeholder="YYYY-MM-DD"
        keyboardType="numbers-and-punctuation"
        autoComplete="birthdate-full"
        error={birthError ?? (under18 ? onboardingCopy.under18 : null)}
        hint={age !== null && !under18 ? `Shown on your profile as age ${age}.` : 'Only your age is shown to others, never the date.'}
      />
      <TextField label="City" value={city} onChangeText={setCity} placeholder="Atlanta, GA" autoCapitalize="words" autoComplete="address-line2" />
    </StepFrame>
  );
}
