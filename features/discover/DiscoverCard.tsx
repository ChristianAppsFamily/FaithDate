import { Bookmark, Heart } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { BlurredPhotoFrame, VoicePlayer } from '@/components/media';
import { Button, Card, Chip, IconButton, Text } from '@/components/ui';
import type { ProfileCard, PromptAnswerView } from '@/data';
import { useTheme } from '@/theme';

export interface DiscoverCardProps {
  card: ProfileCard;
  /** Gold spouse badge only on the first spouse-seeker currently listed (once-per-screen rule). */
  showGoldBadge: boolean;
  onSave: () => void;
  onPass: () => void;
  onLikeVoice: () => void;
  onLikeAnswer: (answer: PromptAnswerView) => void;
}

/** Design 05 Discover card: blurred photo, voice, prompts, Save and Pass. No swipe. */
export function DiscoverCard({ card, showGoldBadge, onSave, onPass, onLikeVoice, onLikeAnswer }: DiscoverCardProps) {
  const { colors, spacing } = useTheme();
  const spouse = card.profile.intent === 'spouse';
  const voiceLabel = card.voice_intro?.starter_label
    ? `Voice · ${card.voice_intro.starter_label}`
    : 'Voice intro';

  return (
    <Card tone="outline" padding={0} style={styles.card}>
      <BlurredPhotoFrame
        seed={card.profile.id}
        height={220}
        flushBottom
        topRight={
          <IconButton
            accessibilityLabel={card.is_saved ? `Unsave ${card.profile.first_name}` : `Save ${card.profile.first_name}`}
            icon={<Bookmark size={20} color={colors.primary} fill={card.is_saved ? colors.primary : 'transparent'} />}
            tone="outline"
            size={48}
            onPress={onSave}
            style={{ backgroundColor: colors.surface }}
          />
        }
      />

      <View style={{ padding: spacing.xl, gap: spacing.md }}>
        <View style={styles.nameRow}>
          <Text variant="heading" color="heading" style={{ flex: 1 }}>
            {card.profile.first_name}, {card.age}
          </Text>
          {spouse ? (
            showGoldBadge ? <Chip label="Seeking a spouse" variant="gold" small /> : <Chip label="Seeking a spouse" variant="status" small />
          ) : (
            <Chip label="Dating with purpose" variant="status" small />
          )}
        </View>

        <View style={styles.tags}>
          <Chip label={card.profile.city} variant="tag" small />
          <Chip label={card.denomination_label} variant="tag" small />
          <Chip label={card.attendance_label} variant="tag" small />
          {card.profile.verified ? <Chip label="Verified" variant="tag" small /> : null}
        </View>

        {card.voice_intro ? (
          <VoicePlayer
            clip={card.voice_intro}
            variant="card"
            label={voiceLabel.toUpperCase()}
            trailing={
              <IconButton
                accessibilityLabel={`Like ${card.profile.first_name}'s voice intro`}
                icon={<Heart size={18} color={colors.onPrimary} fill={colors.onPrimary} />}
                tone="filled"
                size={44}
                onPress={onLikeVoice}
              />
            }
          />
        ) : (
          <Card tone="tint">
            <Text variant="caption" color="muted">
              No voice intro yet. Profiles with a voice intro get noticed more.
            </Text>
          </Card>
        )}

        {card.answers.map((answer) => (
          <Card key={answer.id} tone="outline">
            <Text variant="captionStrong" color="heading">
              {answer.prompt_text}
            </Text>
            <Text variant="body" color="text" style={{ marginTop: spacing.sm, lineHeight: 22 }}>
              {answer.text}
            </Text>
            <View style={styles.answerActions}>
              <IconButton
                accessibilityLabel={`Like ${card.profile.first_name}'s answer: ${answer.prompt_short_label}`}
                icon={<Heart size={18} color={colors.primary} />}
                tone="tint"
                size={44}
                onPress={() => onLikeAnswer(answer)}
              />
            </View>
          </Card>
        ))}

        <Button label="Pass" variant="secondary" onPress={onPass} accessibilityLabel={`Pass on ${card.profile.first_name}`} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  answerActions: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
});
