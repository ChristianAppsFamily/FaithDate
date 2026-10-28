import { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Button, Chip, Text, TextField } from '@/components/ui';
import { christianRoom, getPrompt } from '@/config/faiths';
import { onboardingCopy } from '@/config/onboarding';
import { rules } from '@/config/rules';
import type { PromptAnswer } from '@/data';
import { useTheme } from '@/theme';

import { StepFrame } from '../StepFrame';
import type { OnboardingController } from '../useOnboardingDraft';

interface PromptSlot {
  promptId: string;
  text: string;
}

const DEFAULT_IDS = christianRoom.prompts.filter((p) => p.isDefault).map((p) => p.id);

/** Three prompt answers, interests, core values, optional testimony. */
export function StoryStep({ ctrl }: { ctrl: OnboardingController }) {
  const { colors, spacing } = useTheme();
  const draft = ctrl.draft!;

  const initialSlots: PromptSlot[] = useMemo(() => {
    const fromDraft = draft.answers
      .filter((a): a is Partial<PromptAnswer> & { prompt_id: string } => Boolean(a.prompt_id))
      .slice(0, rules.onboarding.promptAnswersRequired)
      .map((a) => ({ promptId: a.prompt_id, text: a.text ?? '' }));
    while (fromDraft.length < rules.onboarding.promptAnswersRequired) {
      const nextId = DEFAULT_IDS[fromDraft.length] ?? christianRoom.prompts[fromDraft.length]!.id;
      fromDraft.push({ promptId: nextId, text: '' });
    }
    return fromDraft;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [slots, setSlots] = useState<PromptSlot[]>(initialSlots);
  const [interests, setInterests] = useState<string[]>(draft.profile.interests ?? []);
  const [coreValues, setCoreValues] = useState(draft.profile.core_values ?? '');
  const [testimony, setTestimony] = useState(draft.testimony?.text ?? '');
  const [swapIndex, setSwapIndex] = useState<number | null>(null);

  useEffect(() => {
    setInterests(draft.profile.interests ?? []);
    setCoreValues(draft.profile.core_values ?? '');
    setTestimony(draft.testimony?.text ?? '');
  }, [draft]);

  const usedIds = new Set(slots.map((s) => s.promptId));
  const canContinue = slots.every((s) => s.text.trim().length >= 10);

  const toggleInterest = (label: string) => {
    setInterests((prev) => (prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]));
  };

  const swapPrompt = (index: number, promptId: string) => {
    setSlots((prev) => prev.map((s, i) => (i === index ? { promptId, text: '' } : s)));
    setSwapIndex(null);
  };

  const onContinue = () => {
    void ctrl.continueWith({
      answers: slots.map((s) => ({ prompt_id: s.promptId, text: s.text.trim(), voice_clip_id: null })),
      profile: { interests, core_values: coreValues.trim() },
      testimony: testimony.trim() ? { text: testimony.trim(), voice_clip_id: null } : null,
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
          <Button label={onboardingCopy.continue} disabled={!canContinue} loading={ctrl.saving} onPress={onContinue} />
        </View>
      }
    >
      {slots.map((slot, index) => {
        const prompt = getPrompt('christian', slot.promptId);
        return (
          <View key={`${slot.promptId}-${index}`} style={{ gap: spacing.sm }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.md }}>
              <Text variant="captionStrong" color="heading" style={{ flex: 1, lineHeight: 20 }}>
                {prompt?.text ?? slot.promptId}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Swap prompt ${index + 1}`}
                onPress={() => setSwapIndex(swapIndex === index ? null : index)}
                hitSlop={8}
              >
                <Text variant="captionStrong" color="primary">
                  Swap
                </Text>
              </Pressable>
            </View>
            {swapIndex === index ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                {christianRoom.prompts
                  .filter((p) => !usedIds.has(p.id) || p.id === slot.promptId)
                  .map((p) => (
                    <Chip
                      key={p.id}
                      label={p.shortLabel}
                      variant="starter"
                      selected={p.id === slot.promptId}
                      small
                      onPress={() => swapPrompt(index, p.id)}
                    />
                  ))}
              </View>
            ) : null}
            <TextField
              label={`Your answer`}
              value={slot.text}
              onChangeText={(text) => setSlots((prev) => prev.map((s, i) => (i === index ? { ...s, text } : s)))}
              placeholder="A few sentences is perfect."
              multiline
              numberOfLines={4}
              style={{ minHeight: 96, textAlignVertical: 'top', paddingTop: 12 }}
            />
          </View>
        );
      })}

      <View>
        <Text variant="captionStrong" color="heading" style={{ marginBottom: spacing.sm }}>
          Interests
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {christianRoom.interests.map((label) => (
            <Chip key={label} label={label} variant="choice" selected={interests.includes(label)} onPress={() => toggleInterest(label)} />
          ))}
        </View>
      </View>

      <TextField
        label="Core values"
        value={coreValues}
        onChangeText={setCoreValues}
        placeholder="Faithfulness, kindness, honesty…"
        multiline
        numberOfLines={2}
        style={{ minHeight: 64, textAlignVertical: 'top', paddingTop: 12 }}
      />

      <TextField
        label="Testimony / faith journey (optional)"
        value={testimony}
        onChangeText={setTestimony}
        placeholder="A short note about how you came to faith, or what it looks like now."
        multiline
        numberOfLines={4}
        style={{ minHeight: 96, textAlignVertical: 'top', paddingTop: 12 }}
        hint="Adds 10% to your profile strength."
      />

      <Text variant="caption" color="muted" style={{ color: colors.muted }}>
        Answers need at least a couple of sentences so people have something real to like.
      </Text>
    </StepFrame>
  );
}
