import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button, Text, TextField } from '@/components/ui';
import { christianRoom, type AttendanceId, type DenominationId } from '@/config/faiths';
import { onboardingCopy } from '@/config/onboarding';
import { useTheme } from '@/theme';

import { ChoiceGroup } from '../form/ChoiceGroup';
import { StepFrame } from '../StepFrame';
import type { OnboardingController } from '../useOnboardingDraft';

export function FaithStep({ ctrl }: { ctrl: OnboardingController }) {
  const { spacing } = useTheme();
  const draft = ctrl.draft!;
  const [denomination, setDenomination] = useState<DenominationId | null>(draft.profile.denomination ?? null);
  const [attendance, setAttendance] = useState<AttendanceId | null>(draft.profile.church_attendance ?? null);
  const [homeChurch, setHomeChurch] = useState(draft.profile.home_church ?? '');

  useEffect(() => {
    setDenomination(draft.profile.denomination ?? null);
    setAttendance(draft.profile.church_attendance ?? null);
    setHomeChurch(draft.profile.home_church ?? '');
  }, [draft]);

  const canContinue = denomination !== null && attendance !== null;

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
                profile: {
                  faith: 'christian',
                  denomination: denomination!,
                  church_attendance: attendance!,
                  home_church: homeChurch.trim() || null,
                },
              })
            }
          />
        </View>
      }
    >
      <ChoiceGroup
        label="Denomination"
        options={christianRoom.denominations.map((d) => ({ value: d.id, label: d.label }))}
        value={denomination}
        onChange={setDenomination}
      />
      <ChoiceGroup
        label="Church attendance"
        options={christianRoom.attendanceLabels.map((a) => ({ value: a.id, label: a.label }))}
        value={attendance}
        onChange={setAttendance}
      />
      <TextField
        label="Home church (optional)"
        value={homeChurch}
        onChangeText={setHomeChurch}
        placeholder="e.g. Passion City Church"
        autoCapitalize="words"
      />
    </StepFrame>
  );
}
