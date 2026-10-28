import { View } from 'react-native';

import { Avatar, Card, Text } from '@/components/ui';
import { useTheme } from '@/theme';

export interface ShellRow {
  id: string;
  title: string;
  subtitle: string;
  avatarSeed?: string;
}

interface ShellPlaceholderProps {
  milestone: string;
  rows: ShellRow[];
  emptyTitle: string;
  emptyBody: string;
}

/**
 * Milestone 1 stand-in for tab content: proves the adapter is wired by listing real
 * mock data, and says which milestone builds the full screen.
 */
export function ShellPlaceholder({ milestone, rows, emptyTitle, emptyBody }: ShellPlaceholderProps) {
  const { spacing } = useTheme();
  return (
    <View style={{ gap: spacing.md }}>
      <Card tone="tint">
        <Text variant="captionStrong" color="primary">
          Foundation build
        </Text>
        <Text variant="caption" color="muted" style={{ marginTop: 2 }}>
          This screen is designed in {milestone}. The rows below come from the mock data adapter.
        </Text>
      </Card>
      {rows.length === 0 ? (
        <Card>
          <Text variant="subheading" color="heading">
            {emptyTitle}
          </Text>
          <Text variant="caption" color="muted" style={{ marginTop: 4 }}>
            {emptyBody}
          </Text>
        </Card>
      ) : (
        rows.map((row) => (
          <Card key={row.id}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              {row.avatarSeed ? <Avatar variant="blurred" size={48} seed={row.avatarSeed} name={row.title} /> : null}
              <View style={{ flex: 1 }}>
                <Text variant="subheading" color="heading">
                  {row.title}
                </Text>
                <Text variant="caption" color="muted" numberOfLines={2}>
                  {row.subtitle}
                </Text>
              </View>
            </View>
          </Card>
        ))
      )}
    </View>
  );
}
