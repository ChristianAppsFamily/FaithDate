import { useRouter } from 'expo-router';
import { Flower2, Heart } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Avatar, Button, Card, IconButton, Text } from '@/components/ui';
import { currency } from '@/config/currency';
import { adapter, type LikeInboxItem } from '@/data';
import { useTheme } from '@/theme';

interface LikeInboxRowProps {
  item: LikeInboxItem;
  /** Expand Lily rows by default; standard rows expand on heart tap. */
  defaultExpanded?: boolean;
  onChanged?: () => void;
}

/**
 * Design 06 inbox row. Lilies get the gold accent (once on that card).
 * Standard likes start collapsed; the heart expands Pass / Like back.
 */
export function LikeInboxRow({ item, defaultExpanded = false, onChanged }: LikeInboxRowProps) {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const [expanded, setExpanded] = useState(defaultExpanded || item.like.is_lily);
  const [busy, setBusy] = useState(false);
  const name = `${item.from.profile.first_name}, ${item.from.age}`;
  const isLily = item.like.is_lily;

  const likeBack = async () => {
    setBusy(true);
    try {
      const match = await adapter.likeBack(item.like.id);
      onChanged?.();
      router.push({ pathname: '/match/[id]', params: { id: match.id } });
    } finally {
      setBusy(false);
    }
  };

  const pass = async () => {
    setBusy(true);
    try {
      await adapter.passLike(item.like.id);
      onChanged?.();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card tone="outline" accentColor={isLily ? colors.gold : undefined} style={{ gap: spacing.md }}>
      {isLily ? (
        <View style={styles.lilyRow}>
          <Flower2 size={16} color={colors.gold} fill={colors.gold} />
          <Text variant="captionStrong" color="heading">
            Sent you a {currency.giftName}
          </Text>
        </View>
      ) : null}

      <View style={styles.header}>
        <Avatar variant="blurred" size={52} seed={item.from.profile.id} name={item.from.profile.first_name} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="subheading" color="heading">
            {name}
          </Text>
          <Text variant="caption" color="muted" numberOfLines={2}>
            {item.target_label}
            {item.from.profile.city ? ` · ${item.from.profile.city}` : ''}
          </Text>
        </View>
        {!expanded ? (
          <IconButton
            accessibilityLabel={`Respond to ${item.from.profile.first_name}`}
            icon={<Heart size={18} color={colors.onPrimary} fill={colors.onPrimary} />}
            tone="filled"
            size={48}
            onPress={() => setExpanded(true)}
          />
        ) : null}
      </View>

      {item.like.comment_text ? (
        <View style={[styles.bubble, { backgroundColor: colors.lavenderTint, borderRadius: 16, padding: spacing.md }]}>
          <Text variant="body" color="text" style={{ lineHeight: 22 }}>
            {item.like.comment_text}
          </Text>
        </View>
      ) : null}

      {expanded ? (
        <View style={styles.actions}>
          <View style={{ flex: 1 }}>
            <Button label="Pass" variant="secondary" onPress={() => void pass()} disabled={busy} />
          </View>
          <View style={{ flex: 1 }}>
            <Button label="Like back" onPress={() => void likeBack()} loading={busy} />
          </View>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  lilyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bubble: {},
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
});
