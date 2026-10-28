import { Star } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { VoiceRecorder, type RecordedClip } from '@/components/media/VoiceRecorder';
import { Button, Chip, Text } from '@/components/ui';
import { onboardingCopy, voiceIntroStarters, type VoiceIntroStarterId } from '@/config/onboarding';
import type { VoiceClip } from '@/data';
import { useTheme } from '@/theme';

import { ContinueFooter } from '../form/ContinueFooter';
import { StepFrame } from '../StepFrame';
import type { OnboardingController } from '../useOnboardingDraft';

/** Design 03. Optional voice intro with starters, record/replay/re-record, and a skip. */
export function VoiceIntroStep({ ctrl }: { ctrl: OnboardingController }) {
  const { colors, spacing } = useTheme();
  const draft = ctrl.draft!;
  const initialStarter = (voiceIntroStarters.find((s) => s.label === draft.voice_intro?.starter_label)?.id ??
    'who_i_am') as VoiceIntroStarterId;
  const [starterId, setStarterId] = useState<VoiceIntroStarterId>(initialStarter);
  const [clip, setClip] = useState<RecordedClip | null>(
    draft.voice_intro ? { storage_path: draft.voice_intro.storage_path, duration_s: draft.voice_intro.duration_s } : null,
  );

  const starter = voiceIntroStarters.find((s) => s.id === starterId) ?? voiceIntroStarters[0]!;

  const toVoiceClip = (recorded: RecordedClip): VoiceClip => ({
    id: 'draft_intro',
    profile_id: 'draft',
    kind: 'intro',
    storage_path: recorded.storage_path,
    duration_s: recorded.duration_s,
    transcript: null,
    starter_label: starter.label,
  });

  const saveWith = (recorded: RecordedClip | null) => {
    void ctrl.continueWith({ voice_intro: recorded ? toVoiceClip(recorded) : null });
  };

  return (
    <StepFrame
      step={ctrl.step}
      footer={
        <ContinueFooter
          disabled={!clip}
          loading={ctrl.saving}
          error={ctrl.error}
          need={!clip ? 'Record at least 30 seconds, or skip for now.' : null}
          onContinue={() => saveWith(clip)}
          secondary={
            <View style={{ gap: spacing.sm }}>
              <View style={styles.nudge}>
                <Star size={14} color={colors.primary} fill={colors.primary} />
                <Text variant="caption" color="muted" style={{ flex: 1 }}>
                  {onboardingCopy.voiceNudge}
                </Text>
              </View>
              <Button label={onboardingCopy.skipForNow} variant="ghost" disabled={ctrl.saving} onPress={() => saveWith(null)} />
            </View>
          }
        />
      }
    >
      <View style={[styles.starters, { gap: spacing.sm }]}>
        {voiceIntroStarters.map((s) => (
          <Chip key={s.id} label={s.label} variant="choice" selected={starterId === s.id} onPress={() => setStarterId(s.id)} />
        ))}
      </View>
      <VoiceRecorder hint={starter.hint} seed={starterId} initial={clip} onChange={setClip} />
    </StepFrame>
  );
}

const styles = StyleSheet.create({
  starters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  nudge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
  },
});
