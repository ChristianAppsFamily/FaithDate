import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Button, Card, IconButton, Screen, Text } from '@/components/ui';
import { adapter, type AppNotification } from '@/data';
import { useAdapterQuery } from '@/hooks/useAdapterQuery';
import { formatRelative } from '@/lib/time';
import { useTheme } from '@/theme';

/** In-app notifications list (SPEC §6.11). Push is Phase 4. */
export function NotificationsScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const list = useAdapterQuery(() => adapter.getNotifications());
  const items = list.data ?? [];
  const unread = items.filter((n) => !n.read_at).length;

  const open = async (n: AppNotification) => {
    if (!n.read_at) await adapter.markNotificationRead(n.id);
    await list.refresh();
    const matchId = n.payload.match_id;
    if (matchId) {
      if (n.type === 'match') router.push({ pathname: '/match/[id]', params: { id: matchId } });
      else if (n.type === 'voice_date_invite' || n.type === 'voice_date_reminder') {
        router.push({ pathname: '/front-porch/[matchId]', params: { matchId } });
      } else router.push({ pathname: '/chat/[id]', params: { id: matchId } });
      return;
    }
    if (n.type === 'lily' || n.type === 'like') router.push('/(tabs)/likes');
  };

  return (
    <Screen
      grouped
      footer={
        unread > 0 ? (
          <Button
            label="Mark all read"
            variant="secondary"
            onPress={() => void adapter.markAllNotificationsRead().then(() => list.refresh())}
          />
        ) : undefined
      }
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xl }}>
        <IconButton accessibilityLabel="Back" icon={<ArrowLeft size={20} color={colors.heading} />} tone="outline" size={48} onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <Text variant="captionStrong" color="muted">
            {unread > 0 ? `${unread} unread` : 'All caught up'}
          </Text>
          <Text variant="title" color="heading">
            Notifications
          </Text>
        </View>
      </View>

      {items.length === 0 && list.data ? (
        <Card>
          <Text variant="subheading" color="heading">
            No notifications yet
          </Text>
          <Text variant="caption" color="muted" style={{ marginTop: 4, lineHeight: 20 }}>
            Likes, Lilies, matches, messages, and exchange requests will show up here.
          </Text>
        </Card>
      ) : (
        <View style={{ gap: spacing.sm }}>
          {items.map((n) => (
            <Pressable
              key={n.id}
              accessibilityRole="button"
              accessibilityLabel={n.payload.title}
              onPress={() => void open(n)}
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
            >
              <Card tone={n.read_at ? 'outline' : 'tint'}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                  <Text variant="bodyStrong" color="heading" style={{ flex: 1 }}>
                    {n.payload.title}
                  </Text>
                  <Text variant="caption" color="muted">
                    {formatRelative(n.created_at)}
                  </Text>
                </View>
                <Text variant="caption" color="muted" style={{ marginTop: 4, lineHeight: 18 }}>
                  {n.payload.body}
                </Text>
              </Card>
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}
