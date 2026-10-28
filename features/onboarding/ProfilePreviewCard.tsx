import { StyleSheet, View } from 'react-native';

import { VoicePlayer } from '@/components/media';
import { Card, Chip, Text } from '@/components/ui';
import type { ProfileCard } from '@/data';
import { useTheme } from '@/theme';

/** How others will see you on the finish screen (design 04). Gold used once: spouse badge. */
export function ProfilePreviewCard({ card }: { card: ProfileCard }) {
  const { spacing } = useTheme();
  const answer = card.answers[0];
  const isSpouse = card.profile.intent === 'spouse';

  return (
    <Card tone="outline" style={{ padding: spacing.xl }}>
      <View style={styles.header}>
        <Text variant="heading" color="heading" style={{ flex: 1 }}>
          {card.profile.first_name}, {card.age}
        </Text>
        {isSpouse ? <Chip label="Seeking a spouse" variant="gold" small /> : <Chip label="Dating with purpose" variant="status" small />}
      </View>
      <Text variant="caption" color="muted" style={{ marginTop: spacing.xs }}>
        {card.profile.city} · {card.denomination_label}
      </Text>

      {card.voice_intro ? (
        <VoicePlayer
          clip={card.voice_intro}
          variant="inline"
          style={{ marginTop: spacing.lg }}
          accessibilityLabel="Play your voice intro"
        />
      ) : null}

      {answer ? (
        <View style={{ marginTop: spacing.lg }}>
          <Text variant="captionStrong" color="heading">
            {answer.prompt_short_label}
          </Text>
          <Text variant="body" color="text" style={{ marginTop: spacing.xs, lineHeight: 22 }}>
            {answer.text}
          </Text>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
