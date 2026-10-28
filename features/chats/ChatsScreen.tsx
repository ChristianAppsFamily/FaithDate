import { useRouter } from 'expo-router';
import { Pin } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar, Card, Chip, Screen, TabHeader, Text, TAB_BAR_HEIGHT } from '@/components/ui';
import { auntMartha } from '@/config/auntMartha';
import { adapter } from '@/data';
import { useAdapterQuery } from '@/hooks/useAdapterQuery';
import { formatRelative } from '@/lib/time';
import { useTheme } from '@/theme';

import { matchPreview, matchStatusLabel } from './matchStatusLabel';

/** Design 14. Aunt Martha pinned, then matches with status pills. */
export function ChatsScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const matches = useAdapterQuery(() => adapter.getMatches());
  const items = matches.data ?? [];
  const count = items.length;

  return (
    <Screen grouped bottomInset={TAB_BAR_HEIGHT}>
      <TabHeader eyebrow={`${count} ${count === 1 ? 'match' : 'matches'}`} title="Chats" />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${auntMartha.name}, ${auntMartha.shortLabel}`}
        onPress={() => router.push('/aunt-martha')}
        style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
      >
        <Card>
          <View style={styles.row}>
            <Avatar variant="coach" size={52} name={auntMartha.name} />
            <View style={{ flex: 1, gap: 2 }}>
              <View style={styles.nameRow}>
                <Text variant="subheading" color="heading">
                  {auntMartha.name}
                </Text>
                <Chip label={auntMartha.shortLabel} variant="status" small />
              </View>
              <Text variant="caption" color="muted" numberOfLines={1}>
                Want me to look at your first date plan, or something on your heart?
              </Text>
            </View>
            <Pin size={16} color={colors.muted} />
          </View>
        </Card>
      </Pressable>

      <Text variant="captionStrong" color="muted" style={{ marginTop: spacing.xl, marginBottom: spacing.sm }}>
        Your matches
      </Text>

      {count === 0 && matches.data ? (
        <Card>
          <Text variant="subheading" color="heading">
            No matches yet
          </Text>
          <Text variant="caption" color="muted" style={{ marginTop: 4, lineHeight: 20 }}>
            Like back someone who liked you, or wait for a like of yours to be returned.
          </Text>
        </Card>
      ) : (
        <View style={{ gap: spacing.md }}>
          {items.map((m) => {
            const status = matchStatusLabel(m);
            const when = m.last_message?.created_at ?? m.match.created_at;
            return (
              <Pressable
                key={m.match.id}
                accessibilityRole="button"
                accessibilityLabel={`Chat with ${m.other.profile.first_name}`}
                onPress={() => router.push({ pathname: '/chat/[id]', params: { id: m.match.id } })}
                style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
              >
                <Card>
                  <View style={styles.row}>
                    <Avatar variant="blurred" size={52} seed={m.other.profile.id} name={m.other.profile.first_name} />
                    <View style={{ flex: 1, gap: 4 }}>
                      <View style={styles.nameRow}>
                        <Text variant="subheading" color="heading" style={{ flex: 1 }}>
                          {m.other.profile.first_name}
                        </Text>
                        <Text variant="caption" color="muted">
                          {formatRelative(when)}
                        </Text>
                      </View>
                      <Text variant="caption" color="muted" numberOfLines={1}>
                        {matchPreview(m)}
                      </Text>
                      {status ? <Chip label={status} variant="status" small style={{ marginTop: 4 }} /> : null}
                    </View>
                  </View>
                  {m.unread_count > 0 ? (
                    <View style={[styles.unread, { backgroundColor: colors.primary }]}>
                      <Text variant="captionStrong" color="onPrimary">
                        {m.unread_count}
                      </Text>
                    </View>
                  ) : null}
                </Card>
              </Pressable>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unread: {
    position: 'absolute',
    top: 12,
    right: 12,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
});
