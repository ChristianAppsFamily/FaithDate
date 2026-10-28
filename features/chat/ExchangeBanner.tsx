import { View } from 'react-native';

import { Button, Card, Text } from '@/components/ui';
import type { ChatThread } from '@/data';
import { useTheme } from '@/theme';

interface ExchangeBannerProps {
  thread: ChatThread;
  busy: boolean;
  onRequest: () => void;
  onAgree: () => void;
  onNotYet: () => void;
}

/** Photo Exchange prompt in an open chat (design 09). Gold used once: Exchange photos. */
export function ExchangeBanner({ thread, busy, onRequest, onAgree, onNotYet }: ExchangeBannerProps) {
  const { spacing } = useTheme();
  const ex = thread.exchange;
  if (ex.exchanged_at) return null;

  if (thread.exchange_pending_for_me) {
    return (
      <Card tone="outline" style={{ marginBottom: spacing.md }}>
        <Text variant="bodyStrong" color="heading">
          {thread.other.profile.first_name} wants to exchange photos
        </Text>
        <Text variant="caption" color="muted" style={{ marginTop: spacing.xs, lineHeight: 20 }}>
          Nothing is shared until you both agree. You both see each other at the same moment.
        </Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
          <View style={{ flex: 1 }}>
            <Button label="Not yet" variant="secondary" onPress={onNotYet} disabled={busy} />
          </View>
          <View style={{ flex: 1 }}>
            <Button label="Exchange photos" variant="gold" onPress={onAgree} loading={busy} />
          </View>
        </View>
      </Card>
    );
  }

  if (thread.exchange_ready && !ex.requested_by) {
    const fast = ex.fast_lane;
    return (
      <Card tone="outline" style={{ marginBottom: spacing.md }}>
        <Text variant="bodyStrong" color="heading">
          {fast ? "You're both verified and seeking a spouse" : 'Ready to exchange photos'}
        </Text>
        <Text variant="caption" color="muted" style={{ marginTop: spacing.xs, lineHeight: 20 }}>
          Exchange photos whenever you're ready. Nothing is shared until you both agree.
        </Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
          <View style={{ flex: 1 }}>
            <Button label="Not yet" variant="secondary" onPress={onNotYet} disabled={busy} />
          </View>
          <View style={{ flex: 1 }}>
            <Button label="Exchange photos" variant="gold" onPress={onRequest} loading={busy} />
          </View>
        </View>
      </Card>
    );
  }

  if (ex.requested_by && !thread.exchange_pending_for_me) {
    return (
      <Card tone="tint" style={{ marginBottom: spacing.md }}>
        <Text variant="captionStrong" color="heading">
          Waiting for {thread.other.profile.first_name} to agree
        </Text>
        <Text variant="caption" color="muted" style={{ marginTop: 4 }}>
          You asked to exchange. They can accept or tap Not yet — the chat stays open either way.
        </Text>
      </Card>
    );
  }

  return null;
}
