import { Bookmark } from 'lucide-react-native';
import { View } from 'react-native';

import { VoicePlayer } from '@/components/media';
import { Avatar, Button, Card, Chip, IconButton, Screen, TabHeader, Text, TAB_BAR_HEIGHT } from '@/components/ui';
import { adapter } from '@/data';
import { useAdapterQuery } from '@/hooks/useAdapterQuery';
import { useTheme } from '@/theme';

/** Private bookmarks. The other person is never notified. */
export function SavedScreen() {
  const { colors, spacing } = useTheme();
  const saved = useAdapterQuery(() => adapter.getSaved());
  const items = saved.data ?? [];

  return (
    <Screen grouped bottomInset={TAB_BAR_HEIGHT}>
      <TabHeader eyebrow="Only you can see this" title="Saved" />

      {items.length === 0 && saved.data ? (
        <Card>
          <Text variant="subheading" color="heading">
            Nothing saved yet
          </Text>
          <Text variant="caption" color="muted" style={{ marginTop: 4, lineHeight: 20 }}>
            Save someone from today's profiles to keep them past the daily refresh. They are never told.
          </Text>
        </Card>
      ) : (
        <View style={{ gap: spacing.md }}>
          {items.map((card) => (
            <Card key={card.profile.id}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <Avatar variant="blurred" size={56} seed={card.profile.id} name={card.profile.first_name} />
                <View style={{ flex: 1, gap: 4 }}>
                  <Text variant="subheading" color="heading">
                    {card.profile.first_name}, {card.age}
                  </Text>
                  <Text variant="caption" color="muted">
                    {card.profile.city} · {card.denomination_label}
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                    {card.profile.intent === 'spouse' ? <Chip label="Seeking a spouse" variant="status" small /> : null}
                    {card.profile.verified ? <Chip label="Verified" variant="tag" small /> : null}
                    {card.voice_intro ? <Chip label="Voice intro" variant="tag" small /> : null}
                  </View>
                </View>
                <IconButton
                  accessibilityLabel={`Remove ${card.profile.first_name} from Saved`}
                  icon={<Bookmark size={20} color={colors.primary} fill={colors.primary} />}
                  tone="tint"
                  size={48}
                  onPress={() => void adapter.unsaveProfile(card.profile.id)}
                />
              </View>
              {card.voice_intro ? <VoicePlayer clip={card.voice_intro} variant="inline" style={{ marginTop: spacing.md }} /> : null}
              {card.answers[0] ? (
                <Text variant="caption" color="muted" numberOfLines={3} style={{ marginTop: spacing.md, lineHeight: 20 }}>
                  {card.answers[0].prompt_short_label}: {card.answers[0].text}
                </Text>
              ) : null}
            </Card>
          ))}
          <Button
            label="Clear all saved"
            variant="ghost"
            onPress={() => {
              void Promise.all(items.map((c) => adapter.unsaveProfile(c.profile.id)));
            }}
          />
        </View>
      )}
    </Screen>
  );
}
