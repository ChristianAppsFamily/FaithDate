import { Plus, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { BlurBlob, Button, Text, IconButton } from '@/components/ui';
import { onboardingCopy } from '@/config/onboarding';
import { rules } from '@/config/rules';
import { useTheme } from '@/theme';

import { StepFrame } from '../StepFrame';
import type { OnboardingController } from '../useOnboardingDraft';

/**
 * Phase 1 photo slots use abstract blurred placeholders (no camera roll yet).
 * Count is what the adapter stores; real uploads arrive with Supabase storage.
 */
export function PhotosStep({ ctrl }: { ctrl: OnboardingController }) {
  const { colors, radii, spacing } = useTheme();
  const draft = ctrl.draft!;
  const [count, setCount] = useState(draft.photo_count);
  const min = rules.onboarding.photosMin;
  const max = rules.onboarding.photosMax;

  useEffect(() => {
    setCount(draft.photo_count);
  }, [draft]);

  const slots = Array.from({ length: max }, (_, i) => i);
  const canContinue = count >= min;

  return (
    <StepFrame
      step={ctrl.step}
      footer={
        <View style={{ gap: spacing.sm }}>
          <Text variant="caption" color="muted" align="center">
            {count} of {max} · add at least {min}
          </Text>
          {ctrl.error ? (
            <Text variant="caption" color="danger" align="center">
              {ctrl.error}
            </Text>
          ) : null}
          <Button
            label={onboardingCopy.continue}
            disabled={!canContinue}
            loading={ctrl.saving}
            onPress={() => void ctrl.continueWith({ photo_count: count })}
          />
        </View>
      }
    >
      <Text variant="caption" color="muted" style={{ lineHeight: 20 }}>
        {onboardingCopy.photosNote}
      </Text>
      <View style={[styles.grid, { gap: spacing.md }]}>
        {slots.map((i) => {
          const filled = i < count;
          if (filled) {
            return (
              <View
                key={i}
                style={[styles.slot, { backgroundColor: colors.lavenderTint, borderRadius: radii.lg, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }]}
                accessibilityLabel={`Photo ${i + 1}`}
              >
                <BlurBlob size={120} cx={0.45 + (i % 3) * 0.05} cy={0.4 + (i % 2) * 0.08} />
                <View style={styles.remove}>
                  <IconButton
                    accessibilityLabel={`Remove photo ${i + 1}`}
                    icon={<X size={16} color={colors.onPrimary} />}
                    tone="filled"
                    size={36}
                    onPress={() => setCount((c) => Math.max(0, c - 1))}
                  />
                </View>
              </View>
            );
          }
          const isNext = i === count;
          return (
            <Pressable
              key={i}
              disabled={!isNext}
              onPress={() => setCount((c) => Math.min(max, c + 1))}
              accessibilityRole="button"
              accessibilityLabel={isNext ? 'Add a photo' : 'Photo slot locked'}
              style={[
                styles.slot,
                {
                  borderRadius: radii.lg,
                  borderWidth: 1.5,
                  borderColor: isNext ? colors.primary : colors.border,
                  borderStyle: 'dashed',
                  opacity: isNext ? 1 : 0.45,
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing.xs,
                },
              ]}
            >
              <Plus size={22} color={isNext ? colors.primary : colors.muted} />
              <Text variant="captionStrong" color={isNext ? 'primary' : 'muted'}>
                Add
              </Text>
            </Pressable>
          );
        })}
      </View>
    </StepFrame>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  slot: {
    width: '31%',
    aspectRatio: 3 / 4,
    position: 'relative',
  },
  remove: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
});
