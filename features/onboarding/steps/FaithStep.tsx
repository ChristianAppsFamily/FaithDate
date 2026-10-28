import { useState } from 'react';

import { TextField } from '@/components/ui';
import { christianRoom, type AttendanceId, type DenominationId } from '@/config/faiths';

import { ChoiceGroup } from '../form/ChoiceGroup';
import { ContinueFooter } from '../form/ContinueFooter';
import { StepFrame } from '../StepFrame';
import type { OnboardingController } from '../useOnboardingDraft';

export function FaithStep({ ctrl }: { ctrl: OnboardingController }) {
  const draft = ctrl.draft!;
  const [denomination, setDenomination] = useState<DenominationId | null>(draft.profile.denomination ?? null);
  const [attendance, setAttendance] = useState<AttendanceId | null>(draft.profile.church_attendance ?? null);
  const [homeChurch, setHomeChurch] = useState(draft.profile.home_church ?? '');

  const canContinue = denomination !== null && attendance !== null;
  const need = !denomination ? 'Choose a denomination.' : !attendance ? 'Choose how often you attend.' : null;

  return (
    <StepFrame
      step={ctrl.step}
      footer={
        <ContinueFooter
          disabled={!canContinue}
          loading={ctrl.saving}
          error={ctrl.error}
          need={need}
          onContinue={() =>
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
