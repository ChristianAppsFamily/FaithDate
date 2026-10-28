import { Plus, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { BlurBlob, IconButton, Text } from '@/components/ui';
import { rules } from '@/config/rules';
import { useTheme } from '@/theme';

import { ContinueFooter } from '../form/ContinueFooter';
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
  const slots = Array.from({ length: max }, (_, i) => i);
  const canContinue = count >= min;

  const addPhoto = () => setCount((c) => Math.min(max, c + 1));
  const removePhoto = () => setCount((c) => Math.max(0, c - 1));

  return (
    <StepFrame
      step={ctrl.step}
      footer={
        <ContinueFooter
          disabled={!canContinue}
          loading={ctrl.saving}
          error={ctrl.error}
          need={!canContinue ? `Add at least ${min} photos (${count} of ${max}).` : null}
          onContinue={() => void ctrl.continueWith({ photo_count: count })}
        />
      }
    >
      <View style={[styles.grid, { gap: spacing.md }]}>
        {slots.map((i) => {
          const filled = i < count;
          if (filled) {
            return (
              <View
                key={i}
                style={[
                  styles.slot,
                  {
                    backgroundColor: colors.lavenderTint,
                    borderRadius: radii.lg,
                    overflow: 'hidden',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}
                accessibilityLabel={`Photo ${i + 1}`}
              >
                <BlurBlob size={120} cx={0.45 + (i % 3) * 0.05} cy={0.4 + (i % 2) * 0.08} />
                <View style={styles.remove}>
                  <IconButton
                    accessibilityLabel={`Remove photo ${i + 1}`}
                    icon={<X size={16} color={colors.onPrimary} />}
                    tone="filled"
                    size={44}
                    onPress={removePhoto}
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
              onPress={addPhoto}
              accessibilityRole="button"
              accessibilityLabel={isNext ? 'Add a photo' : 'Photo slot locked'}
              style={({ pressed }) => [
                styles.slot,
                {
                  borderRadius: radii.lg,
                  borderWidth: 1.5,
                  borderColor: isNext ? colors.primary : colors.border,
                  borderStyle: 'dashed',
                  opacity: !isNext ? 0.45 : pressed ? 0.75 : 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing.xs,
                  backgroundColor: colors.surface,
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
