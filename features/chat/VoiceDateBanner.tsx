import { useRouter } from 'expo-router';
import { Phone } from 'lucide-react-native';
import { View } from 'react-native';

import { Button, Card, Text } from '@/components/ui';
import type { ChatThread } from '@/data';
import { formatDateTime } from '@/lib/time';
import { useTheme } from '@/theme';

/** Pending Front Porch invite/schedule strip inside an open chat. */
export function VoiceDateBanner({ thread }: { thread: ChatThread }) {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const vd = thread.next_voice_date;
  if (!vd || vd.status === 'completed' || vd.status === 'declined' || vd.status === 'missed') return null;

  const label =
    vd.status === 'live'
      ? 'Voice date in progress'
      : vd.status === 'scheduled' && vd.scheduled_for
        ? `Voice date · ${formatDateTime(vd.scheduled_for)}`
        : 'Voice date invite';

  return (
    <Card tone="tint" style={{ marginBottom: spacing.md }}>
      <Text variant="bodyStrong" color="heading">
        {label}
      </Text>
      <Text variant="caption" color="muted" style={{ marginTop: 4, lineHeight: 18 }}>
        Front Porch is voice only and never recorded.
      </Text>
      <View style={{ marginTop: spacing.md }}>
        <Button
          label={vd.status === 'live' ? 'Return to call' : 'Open Front Porch'}
          variant="secondary"
          icon={<Phone size={18} color={colors.primary} />}
          onPress={() => router.push({ pathname: '/front-porch/[matchId]', params: { matchId: thread.match.id } })}
        />
      </View>
    </Card>
  );
}
