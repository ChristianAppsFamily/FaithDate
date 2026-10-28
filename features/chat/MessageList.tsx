import { useEffect, useRef, type ElementRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { VoicePlayer } from '@/components/media';
import { Text } from '@/components/ui';
import type { ChatThread, Id } from '@/data';
import { useTheme } from '@/theme';

interface MessageListProps {
  thread: ChatThread;
  meId: Id;
}

/** Chat bubbles for text, voice, system, and intro invites. */
export function MessageList({ thread, meId }: MessageListProps) {
  const { colors, radii, spacing } = useTheme();
  const scrollRef = useRef<ElementRef<typeof ScrollView>>(null);

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    return () => clearTimeout(t);
  }, [thread.messages.length]);

  return (
    <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: spacing.md, gap: spacing.sm }} keyboardShouldPersistTaps="handled">
      {thread.messages.map((msg) => {
        if (msg.kind === 'system') {
          return (
            <Text key={msg.id} variant="caption" color="muted" align="center" style={{ marginVertical: spacing.sm }}>
              {msg.text}
            </Text>
          );
        }
        const mine = msg.sender_id === meId;
        const clip = msg.voice_clip_id ? thread.voice_clips[msg.voice_clip_id] : null;
        return (
          <View key={msg.id} style={[styles.row, { justifyContent: mine ? 'flex-end' : 'flex-start' }]}>
            <View
              style={[
                styles.bubble,
                {
                  backgroundColor: mine ? colors.primary : colors.surface,
                  borderRadius: radii.xl,
                  borderBottomRightRadius: mine ? radii.sm : radii.xl,
                  borderBottomLeftRadius: mine ? radii.xl : radii.sm,
                  borderWidth: mine ? 0 : 1,
                  borderColor: colors.border,
                  maxWidth: '82%',
                  padding: spacing.md,
                },
              ]}
            >
              {clip ? (
                <VoicePlayer clip={clip} variant={mine ? 'bubble' : 'bubble'} style={{ minWidth: 180 }} />
              ) : (
                <Text variant="body" color={mine ? 'onPrimary' : 'text'} style={{ lineHeight: 22 }}>
                  {msg.text}
                </Text>
              )}
              {msg.kind === 'intro_invite' && !clip ? (
                <Text variant="caption" color={mine ? 'onPrimary' : 'muted'} style={{ marginTop: 4, opacity: 0.85 }}>
                  Voice intro
                </Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  bubble: {},
});
