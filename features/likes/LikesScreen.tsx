import { View } from 'react-native';

import { Card, Screen, TabHeader, Text, TAB_BAR_HEIGHT } from '@/components/ui';
import { adapter } from '@/data';
import { useAdapterQuery } from '@/hooks/useAdapterQuery';
import { useTheme } from '@/theme';

import { LikeInboxRow } from './LikeInboxRow';

/** Design 06. Who liked you — Lilies pinned with gold, standard rows expand to Pass / Like back. */
export function LikesScreen() {
  const { spacing } = useTheme();
  const inbox = useAdapterQuery(() => adapter.getLikesInbox());
  const items = inbox.data ?? [];
  const count = items.length;

  return (
    <Screen grouped bottomInset={TAB_BAR_HEIGHT}>
      <TabHeader eyebrow={`${count} ${count === 1 ? 'person' : 'people'} liked you`} title="Likes you" />

      {inbox.loading && !inbox.data ? (
        <Text variant="caption" color="muted">
          Loading likes…
        </Text>
      ) : null}

      {count === 0 && inbox.data ? (
        <Card>
          <Text variant="subheading" color="heading">
            No likes yet
          </Text>
          <Text variant="caption" color="muted" style={{ marginTop: 4, lineHeight: 20 }}>
            When someone likes your voice intro or an answer, it shows up here. Lilies always pin to the top.
          </Text>
        </Card>
      ) : (
        <View style={{ gap: spacing.md }}>
          {items.map((item) => (
            <LikeInboxRow
              key={item.like.id}
              item={item}
              defaultExpanded={item.like.is_lily}
              onChanged={() => void inbox.refresh()}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}
