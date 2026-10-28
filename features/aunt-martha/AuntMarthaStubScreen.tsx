import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { View } from 'react-native';

import { Avatar, Button, IconButton, Screen, Text } from '@/components/ui';
import { auntMartha } from '@/config/auntMartha';
import { useTheme } from '@/theme';

/**
 * Milestone 4 stub. Full Aunt Martha thread (canned replies, chips, usage) ships in M5.
 * Entry points from Chats and chat menus land here so navigation is real.
 */
export function AuntMarthaStubScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();

  return (
    <Screen
      footer={<Button label="Back" variant="secondary" onPress={() => router.back()} />}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xxl }}>
        <IconButton
          accessibilityLabel="Back"
          icon={<ArrowLeft size={20} color={colors.heading} />}
          tone="outline"
          size={48}
          onPress={() => router.back()}
        />
      </View>

      <View style={{ alignItems: 'center', gap: spacing.md, paddingTop: spacing.huge }}>
        <Avatar variant="coach" size={72} name={auntMartha.name} />
        <Text variant="title" color="heading" align="center">
          {auntMartha.name}
        </Text>
        <Text variant="captionStrong" color="muted" align="center">
          {auntMartha.label}
        </Text>
        <Text variant="body" color="muted" align="center" style={{ lineHeight: 24, marginTop: spacing.md }}>
          {auntMartha.greeting}
        </Text>
        <Text variant="caption" color="muted" align="center" style={{ lineHeight: 20, marginTop: spacing.lg }}>
          Her full coaching thread arrives in the next milestone — Front Porch, Plan a date, and Notifications.
        </Text>
      </View>
    </Screen>
  );
}
