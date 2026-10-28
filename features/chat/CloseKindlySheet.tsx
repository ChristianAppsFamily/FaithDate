import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Button, Sheet, Text, TextField } from '@/components/ui';
import { adapter } from '@/data';
import { useTheme } from '@/theme';

interface CloseKindlySheetProps {
  visible: boolean;
  matchId: string;
  otherName: string;
  onClose: () => void;
  onClosed: () => void;
}

/** End a match with a respectful template (SPEC Close kindly). */
export function CloseKindlySheet({ visible, matchId, otherName, onClose, onClosed }: CloseKindlySheetProps) {
  const { colors, radii, spacing } = useTheme();
  const [templates, setTemplates] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    void adapter.getCloseKindlyTemplates().then((t) => {
      setTemplates(t);
      setMessage(t[0] ?? '');
    });
  }, [visible]);

  const submit = async () => {
    if (!message.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await adapter.closeMatch(matchId, message.trim());
      setBusy(false);
      onClosed();
    } catch (e) {
      setBusy(false);
      setError(e instanceof Error ? e.message : 'Could not close the match.');
    }
  };

  return (
    <Sheet
      visible={visible}
      title="Close kindly"
      subtitle={`End your match with ${otherName} with a short, respectful note.`}
      onClose={onClose}
      footer={
        <View style={{ gap: spacing.sm }}>
          {error ? (
            <Text variant="caption" color="danger" align="center">
              {error}
            </Text>
          ) : null}
          <Button label="Send and close" onPress={() => void submit()} loading={busy} disabled={!message.trim()} />
          <Button label="Keep chatting" variant="ghost" onPress={onClose} disabled={busy} />
        </View>
      }
    >
      <View style={{ gap: spacing.sm }}>
        {templates.map((t) => {
          const selected = message === t;
          return (
            <Pressable
              key={t}
              onPress={() => setMessage(t)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={{
                padding: spacing.md,
                borderRadius: radii.lg,
                borderWidth: 1.5,
                borderColor: selected ? colors.primary : colors.border,
                backgroundColor: selected ? colors.lavenderTint : colors.surface,
              }}
            >
              <Text variant="caption" color="text" style={{ lineHeight: 20 }}>
                {t}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <TextField
        label="Your message"
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={4}
        style={{ minHeight: 96, textAlignVertical: 'top', paddingTop: 12 }}
      />
    </Sheet>
  );
}
