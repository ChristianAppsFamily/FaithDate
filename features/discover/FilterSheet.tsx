import { Switch, View } from 'react-native';

import { Button, Sheet, Text } from '@/components/ui';
import type { BatchFilters } from '@/data';
import { useTheme } from '@/theme';

interface FilterSheetProps {
  visible: boolean;
  value: BatchFilters;
  onChange: (next: BatchFilters) => void;
  onClose: () => void;
}

/** Discover filter sheet. SPEC requires "Has voice intro"; other filters can grow later. */
export function FilterSheet({ visible, value, onChange, onClose }: FilterSheetProps) {
  const { colors, spacing } = useTheme();
  const hasVoice = Boolean(value.has_voice_intro);

  return (
    <Sheet
      visible={visible}
      title="Filter today's profiles"
      subtitle="Applies only to the profiles left in today's batch."
      onClose={onClose}
      footer={<Button label="Done" onPress={onClose} />}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.lg,
          minHeight: 44,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text variant="bodyStrong" color="heading">
            Has voice intro
          </Text>
          <Text variant="caption" color="muted" style={{ marginTop: 2 }}>
            Only show people who recorded a voice intro.
          </Text>
        </View>
        <Switch
          accessibilityLabel="Has voice intro"
          value={hasVoice}
          onValueChange={(on) => onChange({ ...value, has_voice_intro: on || undefined })}
          trackColor={{ false: colors.border, true: colors.lavender }}
          thumbColor={hasVoice ? colors.primary : colors.surface}
        />
      </View>
      {hasVoice ? (
        <Button label="Clear filters" variant="ghost" onPress={() => onChange({})} />
      ) : null}
    </Sheet>
  );
}
