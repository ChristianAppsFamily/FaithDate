import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Avatar, Button, Screen, Text, TextField } from '@/components/ui';
import { auntMartha } from '@/config/auntMartha';
import { adapter, AdapterError, type CheckinOutcome } from '@/data';
import { useAdapterQuery } from '@/hooks/useAdapterQuery';
import { formatDateTime } from '@/lib/time';
import { useTheme } from '@/theme';

const OUTCOMES: { id: CheckinOutcome; label: string }[] = [
  { id: 'great', label: 'Great' },
  { id: 'good', label: 'Good' },
  { id: 'not_a_fit', label: 'Not a fit' },
];

/** Day-after private check-in after a confirmed date. */
export function CheckinScreen() {
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const { colors, radii, spacing } = useTheme();
  const router = useRouter();
  const pending = useAdapterQuery(() => adapter.getPendingCheckins());
  const plan = (pending.data ?? []).find((p) => p.id === planId) ?? (pending.data ?? [])[0] ?? null;

  const [outcome, setOutcome] = useState<CheckinOutcome | null>(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!plan || !outcome) return;
    setBusy(true);
    setError(null);
    try {
      await adapter.submitDateCheckin(plan.id, outcome, note.trim() || undefined);
      setDone(true);
    } catch (e) {
      setError(e instanceof AdapterError ? e.message : 'Could not save your check-in.');
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <Screen
        footer={
          <View style={{ gap: spacing.sm }}>
            <Button
              label={auntMartha.entryPoints.checkin}
              variant="secondary"
              icon={<Avatar variant="coach" size={28} name={auntMartha.name} />}
              onPress={() => router.replace({ pathname: '/aunt-martha', params: { context: 'checkin' } })}
            />
            <Button label="Done" onPress={() => router.replace('/(tabs)/chats')} />
          </View>
        }
      >
        <Text variant="title" color="heading">
          Thanks for checking in
        </Text>
        <Text variant="body" color="muted" style={{ marginTop: spacing.md, lineHeight: 24 }}>
          Your note stays private. Talk it through with Aunt Martha if you want.
        </Text>
      </Screen>
    );
  }

  return (
    <Screen
      footer={
        <View style={{ gap: spacing.sm }}>
          {error ? (
            <Text variant="caption" color="danger" align="center">
              {error}
            </Text>
          ) : null}
          <Button label="Save check-in" onPress={() => void submit()} loading={busy} disabled={!outcome || !plan} />
        </View>
      }
    >
      <Text variant="title" color="heading">
        How did it go?
      </Text>
      {plan ? (
        <Text variant="body" color="muted" style={{ marginTop: spacing.md, lineHeight: 24 }}>
          {plan.place_name}
          {plan.chosen_time ? ` · ${formatDateTime(plan.chosen_time)}` : ''}
        </Text>
      ) : (
        <Text variant="body" color="muted" style={{ marginTop: spacing.md }}>
          No pending check-ins right now.
        </Text>
      )}

      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xxl }}>
        {OUTCOMES.map((o) => (
          <Pressable
            key={o.id}
            onPress={() => setOutcome(o.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: outcome === o.id }}
            style={{
              flex: 1,
              minHeight: 52,
              borderRadius: radii.lg,
              borderWidth: 1.5,
              borderColor: outcome === o.id ? colors.primary : colors.border,
              backgroundColor: outcome === o.id ? colors.primary : colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text variant="captionStrong" color={outcome === o.id ? 'onPrimary' : 'heading'} align="center">
              {o.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <TextField
        label="Optional note"
        value={note}
        onChangeText={setNote}
        placeholder="Anything you want to remember"
        multiline
        numberOfLines={3}
        style={{ marginTop: spacing.xxl, minHeight: 96, textAlignVertical: 'top', paddingTop: 12 }}
      />
    </Screen>
  );
}
