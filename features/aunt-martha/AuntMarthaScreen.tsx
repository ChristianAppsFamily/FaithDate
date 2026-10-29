import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ArrowUp } from 'lucide-react-native';
import { useEffect, useRef, useState, type ElementRef } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Avatar, Button, Chip, IconButton, Screen, Sheet, Text } from '@/components/ui';
import { auntMartha, resolveChipLabel, type CoachContextType } from '@/config/auntMartha';
import { rules } from '@/config/rules';
import { adapter, AdapterError, type CoachMessage, type Message } from '@/data';
import { useAdapterQuery } from '@/hooks/useAdapterQuery';
import { useSession } from '@/store/useSession';
import { MIN_TOUCH_TARGET, useTheme } from '@/theme';

/**
 * Design 13. Aunt Martha thread — canned replies, starter chips, usage, share consent.
 * Gold once: avatar ring.
 */
export function AuntMarthaScreen() {
  const params = useLocalSearchParams<{ context?: string; matchId?: string }>();
  const initialContext = (params.context as CoachContextType | undefined) ?? 'none';
  const matchId = params.matchId || undefined;

  const { colors, radii, spacing, typography } = useTheme();
  const router = useRouter();
  const me = useSession((s) => s.profile);
  const seeking = me?.seeking === 'male' ? 'male' : 'female';
  const threadQ = useAdapterQuery(() => adapter.getCoachThread());
  const scrollRef = useRef<ElementRef<typeof ScrollView>>(null);

  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [pendingShare, setPendingShare] = useState<{ text: string; context: CoachContextType } | null>(null);
  const [contextType, setContextType] = useState<CoachContextType>(initialContext);

  useEffect(() => {
    if (initialContext === 'profile') {
      // Prefill chip path for profile entry.
      setContextType('profile');
    }
  }, [initialContext]);

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    return () => clearTimeout(t);
  }, [threadQ.data?.messages.length]);

  const messages = threadQ.data?.messages ?? [];
  const freeLeft = threadQ.data?.free_left ?? rules.auntMartha.freeQuestionsPerWeek;

  const ask = async (raw: string, ctx: CoachContextType, shared?: Message[]) => {
    const value = raw.trim();
    if (!value || busy) return;
    setBusy(true);
    setError(null);
    try {
      await adapter.askAuntMartha({
        text: value,
        context_type: ctx,
        match_id: matchId,
        shared_messages: shared,
      });
      setText('');
      await threadQ.refresh();
    } catch (e) {
      setError(e instanceof AdapterError ? e.message : 'Could not reach Aunt Martha.');
    } finally {
      setBusy(false);
    }
  };

  const onSend = async (value?: string, ctx?: CoachContextType) => {
    const msg = (value ?? text).trim();
    const useCtx = ctx ?? contextType;
    if (!msg) return;
    if (useCtx === 'shared_chat' && matchId && !pendingShare) {
      setPendingShare({ text: msg, context: useCtx });
      setShareOpen(true);
      return;
    }
    await ask(msg, useCtx);
  };

  const confirmShare = async () => {
    if (!pendingShare || !matchId) return;
    setShareOpen(false);
    try {
      const chat = await adapter.getChat(matchId);
      const shared = chat.messages.filter((m) => m.kind !== 'system').slice(-rules.auntMartha.sharedMessageCount);
      await ask(pendingShare.text, pendingShare.context, shared);
    } finally {
      setPendingShare(null);
    }
  };

  const onChip = (chipId: string, label: string, ctx: CoachContextType) => {
    setContextType(ctx);
    if (ctx === 'shared_chat' && matchId) {
      setPendingShare({ text: label, context: ctx });
      setShareOpen(true);
      return;
    }
    void onSend(label, ctx);
  };

  return (
    <Screen scroll={false} padded={false} grouped>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.md }}>
        <IconButton accessibilityLabel="Back" icon={<ArrowLeft size={20} color={colors.heading} />} tone="outline" size={48} onPress={() => router.back()} />
        <View style={[styles.goldRing, { borderColor: colors.gold }]}>
          <Avatar variant="coach" size={44} name={auntMartha.name} />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="subheading" color="heading">
            {auntMartha.name}
          </Text>
          <Chip label={auntMartha.label} variant="status" small />
        </View>
      </View>

      <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.md, gap: spacing.sm }}>
        {messages.map((m) => (
          <MarthaBubble key={m.id} message={m} />
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.md, gap: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border }}>
        {error ? (
          <Text variant="caption" color="danger">
            {error}
          </Text>
        ) : null}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm, paddingVertical: 4 }}>
          {auntMartha.starterChips.map((chip) => {
            const label = resolveChipLabel(chip.label, seeking);
            return (
              <Chip
                key={chip.id}
                variant="starter"
                label={label}
                onPress={() => onChip(chip.id, label, chip.contextType)}
              />
            );
          })}
        </ScrollView>
        <View style={styles.composerRow}>
          <TextInput
            accessibilityLabel="Ask Aunt Martha"
            placeholder="Ask Aunt Martha."
            placeholderTextColor={colors.muted}
            value={text}
            onChangeText={setText}
            editable={!busy}
            style={[
              typography.body,
              {
                flex: 1,
                minHeight: MIN_TOUCH_TARGET,
                maxHeight: 100,
                borderWidth: 1.5,
                borderColor: colors.border,
                borderRadius: radii.pill,
                paddingHorizontal: spacing.lg,
                paddingVertical: 12,
                color: colors.text,
                backgroundColor: colors.surface,
              },
            ]}
          />
          <IconButton
            accessibilityLabel="Send"
            icon={<ArrowUp size={18} color={colors.onPrimary} />}
            tone="filled"
            size={48}
            disabled={busy || !text.trim()}
            onPress={() => void onSend()}
          />
        </View>
        <Text variant="caption" color="muted" align="center">
          {auntMartha.usage.freeLeft(freeLeft)} · {auntMartha.usage.profileCoachingFree}
        </Text>
      </View>

      <Sheet
        visible={shareOpen}
        title={auntMartha.shareConsent.title}
        subtitle={auntMartha.shareConsent.body}
        onClose={() => {
          setShareOpen(false);
          setPendingShare(null);
        }}
        footer={
          <View style={{ gap: spacing.sm }}>
            <Button label={auntMartha.shareConsent.confirm} onPress={() => void confirmShare()} loading={busy} />
            <Button
              label={auntMartha.shareConsent.cancel}
              variant="ghost"
              onPress={() => {
                setShareOpen(false);
                setPendingShare(null);
              }}
            />
          </View>
        }
      >
        <Text variant="caption" color="muted">
          She never shares anything with the other person.
        </Text>
      </Sheet>
    </Screen>
  );
}

function MarthaBubble({ message }: { message: CoachMessage }) {
  const { colors, radii, spacing } = useTheme();
  const mine = message.role === 'user';
  const levelLabel =
    message.review?.level === 'lovely'
      ? auntMartha.coachingLevels.lovely
      : message.review?.level === 'small_change'
        ? auntMartha.coachingLevels.small_change
        : message.review?.level === 'go_deeper'
          ? auntMartha.coachingLevels.go_deeper
          : null;

  return (
    <View style={{ alignItems: mine ? 'flex-end' : 'flex-start' }}>
      <View
        style={{
          maxWidth: '92%',
          backgroundColor: mine ? colors.primary : colors.surface,
          borderRadius: radii.xl,
          borderBottomRightRadius: mine ? radii.sm : radii.xl,
          borderBottomLeftRadius: mine ? radii.xl : radii.sm,
          padding: spacing.md,
          borderWidth: mine ? 0 : 1,
          borderColor: colors.border,
          gap: spacing.sm,
        }}
      >
        <Text variant="body" color={mine ? 'onPrimary' : 'text'} style={{ lineHeight: 22 }}>
          {message.text}
        </Text>
        {message.review ? (
          <View style={{ backgroundColor: colors.surfaceAlt, borderRadius: radii.lg, padding: spacing.md, gap: spacing.sm }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <Text variant="captionStrong" color="heading" style={{ flex: 1 }}>
                {message.review.prompt_short_label}
              </Text>
              {levelLabel ? <Chip label={levelLabel} variant="status" small /> : null}
            </View>
            <Text variant="caption" color="muted" style={{ lineHeight: 18 }}>
              “{message.review.answer_excerpt}”
            </Text>
            <Text variant="captionStrong" color="primary">
              Edit this answer
            </Text>
          </View>
        ) : null}
        {message.flagged ? (
          <Text variant="captionStrong" color="danger">
            Safety note — use Report in the chat menu if you need it.
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  goldRing: {
    borderWidth: 2,
    borderRadius: 28,
    padding: 2,
  },
  composerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
});
