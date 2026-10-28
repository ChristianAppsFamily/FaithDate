import { Mic, Send } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { IconButton, Text } from '@/components/ui';
import { AdapterError } from '@/data';
import { contactBlockedCopy, detectContactInfo } from '@/lib/contactFilter';
import { MIN_TOUCH_TARGET, useTheme } from '@/theme';

interface ChatComposerProps {
  otherName: string;
  contactBlocked: boolean;
  busy: boolean;
  onSendText: (text: string) => Promise<void>;
  onSendVoice: () => void;
}

/** Text input + mic. Blocks contact info before Photo Exchange. */
export function ChatComposer({ otherName, contactBlocked, busy, onSendText, onSendVoice }: ChatComposerProps) {
  const { colors, radii, spacing, typography } = useTheme();
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const send = async () => {
    const value = text.trim();
    if (!value || busy) return;
    if (contactBlocked && detectContactInfo(value)) {
      setError(contactBlockedCopy);
      return;
    }
    setError(null);
    try {
      await onSendText(value);
      setText('');
    } catch (e) {
      setError(e instanceof AdapterError ? e.message : 'Could not send.');
    }
  };

  return (
    <View style={{ gap: spacing.xs }}>
      {contactBlocked ? (
        <Text variant="caption" color="muted" style={{ paddingHorizontal: 4 }}>
          {contactBlockedCopy}
        </Text>
      ) : null}
      {error ? (
        <Text variant="caption" color="danger" style={{ paddingHorizontal: 4 }}>
          {error}
        </Text>
      ) : null}
      <View style={styles.row}>
        <TextInput
          accessibilityLabel={`Message ${otherName}`}
          placeholder={`Message ${otherName}`}
          placeholderTextColor={colors.muted}
          value={text}
          onChangeText={(t) => {
            setText(t);
            if (error) setError(null);
          }}
          editable={!busy}
          multiline
          style={[
            styles.input,
            typography.body,
            {
              color: colors.text,
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.xl,
              paddingHorizontal: spacing.lg,
              minHeight: MIN_TOUCH_TARGET,
              maxHeight: 120,
            },
          ]}
        />
        {text.trim() ? (
          <IconButton
            accessibilityLabel="Send message"
            icon={<Send size={18} color={colors.onPrimary} />}
            tone="filled"
            size={48}
            disabled={busy}
            onPress={() => void send()}
          />
        ) : (
          <IconButton accessibilityLabel="Record a voice note" icon={<Mic size={18} color={colors.onPrimary} />} tone="filled" size={48} disabled={busy} onPress={onSendVoice} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    paddingTop: 12,
    paddingBottom: 12,
  },
});
