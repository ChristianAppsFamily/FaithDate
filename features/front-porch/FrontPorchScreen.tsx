import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Phone } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { Avatar, Button, IconButton, Screen, Text } from '@/components/ui';
import { adapter, AdapterError } from '@/data';
import { useAdapterQuery } from '@/hooks/useAdapterQuery';
import { formatDateTime } from '@/lib/time';
import { useSession } from '@/store/useSession';
import { useTheme } from '@/theme';

/**
 * Invite or respond to a Front Porch voice date for a match.
 * Live call lives at /front-porch/call/[voiceDateId].
 */
export function FrontPorchScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const me = useSession((s) => s.profile);
  const chat = useAdapterQuery(() => (matchId ? adapter.getChat(matchId) : Promise.reject(new Error('Missing match'))), [matchId]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const thread = chat.data;
  const otherName = thread?.other.profile.first_name ?? 'them';
  const pending = thread?.next_voice_date ?? thread?.voice_dates.find((v) => v.status === 'invited' || v.status === 'scheduled' || v.status === 'live') ?? null;
  const iInvited = pending && me ? pending.invited_by === me.id : false;

  const invite = async (scheduled_for?: string) => {
    if (!matchId) return;
    setBusy(true);
    setError(null);
    try {
      const vd = await adapter.inviteVoiceDate(matchId, scheduled_for);
      await chat.refresh();
      if (vd.status === 'live') router.replace({ pathname: '/front-porch/call/[voiceDateId]', params: { voiceDateId: vd.id } });
    } catch (e) {
      setError(e instanceof AdapterError ? e.message : 'Could not send the invite.');
    } finally {
      setBusy(false);
    }
  };

  const respond = async (action: 'join_now' | 'schedule' | 'decline') => {
    if (!pending) return;
    setBusy(true);
    setError(null);
    try {
      if (action === 'join_now') {
        const vd = await adapter.respondToVoiceDate(pending.id, { action: 'join_now' });
        router.replace({ pathname: '/front-porch/call/[voiceDateId]', params: { voiceDateId: vd.id } });
        return;
      }
      if (action === 'schedule') {
        const when = new Date();
        when.setDate(when.getDate() + 1);
        when.setHours(19, 0, 0, 0);
        await adapter.respondToVoiceDate(pending.id, { action: 'schedule', scheduled_for: when.toISOString() });
        await chat.refresh();
        return;
      }
      await adapter.respondToVoiceDate(pending.id, { action: 'decline' });
      await chat.refresh();
    } catch (e) {
      setError(e instanceof AdapterError ? e.message : 'Could not respond.');
    } finally {
      setBusy(false);
    }
  };

  const startScheduled = async () => {
    if (!pending) return;
    setBusy(true);
    setError(null);
    try {
      const vd = await adapter.startVoiceDate(pending.id);
      router.replace({ pathname: '/front-porch/call/[voiceDateId]', params: { voiceDateId: vd.id } });
    } catch (e) {
      setError(e instanceof AdapterError ? e.message : 'Could not start the call.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen
      footer={
        <View style={{ gap: spacing.sm }}>
          {error ? (
            <Text variant="caption" color="danger" align="center">
              {error}
            </Text>
          ) : null}
          {!pending && thread?.can_invite_voice_date ? (
            <>
              <Button label="Invite to join now" icon={<Phone size={18} color={colors.onPrimary} />} onPress={() => void invite()} loading={busy} />
              <Button
                label="Invite for tomorrow at 7pm"
                variant="secondary"
                onPress={() => {
                  const when = new Date();
                  when.setDate(when.getDate() + 1);
                  when.setHours(19, 0, 0, 0);
                  void invite(when.toISOString());
                }}
                loading={busy}
              />
            </>
          ) : null}
          {pending?.status === 'invited' && !iInvited ? (
            <>
              <Button label="Join now" onPress={() => void respond('join_now')} loading={busy} />
              <Button label="Pick tomorrow at 7pm" variant="secondary" onPress={() => void respond('schedule')} loading={busy} />
              <Button label="Not now" variant="ghost" onPress={() => void respond('decline')} disabled={busy} />
            </>
          ) : null}
          {pending?.status === 'scheduled' ? (
            <Button label="Start voice date" onPress={() => void startScheduled()} loading={busy} />
          ) : null}
          {pending?.status === 'live' ? (
            <Button
              label="Return to call"
              onPress={() => router.replace({ pathname: '/front-porch/call/[voiceDateId]', params: { voiceDateId: pending.id } })}
            />
          ) : null}
          {pending?.status === 'invited' && iInvited ? (
            <Text variant="caption" color="muted" align="center">
              Waiting for {otherName} to join or pick a time.
            </Text>
          ) : null}
        </View>
      }
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xxl }}>
        <IconButton accessibilityLabel="Back" icon={<ArrowLeft size={20} color={colors.heading} />} tone="outline" size={48} onPress={() => router.back()} />
      </View>

      <Text variant="overline" color="muted">
        FRONT PORCH
      </Text>
      <Text variant="title" color="heading" style={{ marginTop: spacing.sm }}>
        Voice date with {otherName}
      </Text>
      <Text variant="body" color="muted" style={{ marginTop: spacing.md, lineHeight: 24 }}>
        Voice only. Never recorded. Women-first rules still apply — she sends the invite, or accepts one after the chat is open.
      </Text>

      <View style={{ alignItems: 'center', marginTop: spacing.xxxl, gap: spacing.md }}>
        <Avatar variant="blurred" size={96} seed={thread?.other.profile.id ?? 'other'} name={otherName} />
        {pending?.scheduled_for ? (
          <Text variant="bodyStrong" color="heading">
            {formatDateTime(pending.scheduled_for)}
          </Text>
        ) : null}
        {pending ? (
          <Text variant="caption" color="muted">
            Status: {pending.status.replace('_', ' ')}
          </Text>
        ) : (
          <Text variant="caption" color="muted">
            No voice date yet. Invite {otherName} when you are ready.
          </Text>
        )}
      </View>
    </Screen>
  );
}
