import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Button, Screen, Text } from '@/components/ui';
import { adapter } from '@/data';
import { useSession } from '@/store/useSession';
import { useTheme } from '@/theme';

/** Post-call: Want to talk again? + private 1–5 rating. */
export function FeedbackScreen() {
  const { voiceDateId } = useLocalSearchParams<{ voiceDateId: string }>();
  const { colors, radii, spacing } = useTheme();
  const router = useRouter();
  const me = useSession((s) => s.profile);
  const [talkAgain, setTalkAgain] = useState<boolean | null>(null);
  const [rating, setRating] = useState(0);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!voiceDateId || !me || talkAgain === null || rating < 1) return;
    setBusy(true);
    try {
      await adapter.submitVoiceDateFeedback({
        voice_date_id: voiceDateId,
        profile_id: me.id,
        talk_again: talkAgain,
        rating,
      });
      router.replace('/(tabs)/chats');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen
      footer={
        <Button
          label="Done"
          onPress={() => void submit()}
          loading={busy}
          disabled={talkAgain === null || rating < 1}
        />
      }
    >
      <Text variant="title" color="heading">
        How was the call?
      </Text>
      <Text variant="body" color="muted" style={{ marginTop: spacing.md, lineHeight: 24 }}>
        Your answers stay private. They help us keep Front Porch safe and useful.
      </Text>

      <Text variant="subheading" color="heading" style={{ marginTop: spacing.xxxl }}>
        Want to talk again?
      </Text>
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
        {[
          { v: true, label: 'Yes' },
          { v: false, label: 'Not sure' },
        ].map((o) => (
          <Pressable
            key={o.label}
            onPress={() => setTalkAgain(o.v)}
            accessibilityRole="button"
            accessibilityState={{ selected: talkAgain === o.v }}
            style={{
              flex: 1,
              minHeight: 48,
              borderRadius: radii.pill,
              borderWidth: 1.5,
              borderColor: talkAgain === o.v ? colors.primary : colors.border,
              backgroundColor: talkAgain === o.v ? colors.primary : colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text variant="bodyStrong" color={talkAgain === o.v ? 'onPrimary' : 'heading'}>
              {o.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text variant="subheading" color="heading" style={{ marginTop: spacing.xxl }}>
        Quick rating
      </Text>
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable
            key={n}
            onPress={() => setRating(n)}
            accessibilityRole="button"
            accessibilityLabel={`Rate ${n} of 5`}
            accessibilityState={{ selected: rating === n }}
            style={{
              flex: 1,
              minHeight: 48,
              borderRadius: radii.lg,
              backgroundColor: rating === n ? colors.lavenderTint : colors.surface,
              borderWidth: 1.5,
              borderColor: rating === n ? colors.primary : colors.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text variant="bodyStrong" color="heading">
              {n}
            </Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
