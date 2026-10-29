import { useLocalSearchParams, useRouter } from 'expo-router';
import { Mic, MicOff, PhoneOff, TimerReset } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Waveform } from '@/components/media';
import { Avatar, Screen, Text } from '@/components/ui';
import { rules } from '@/config/rules';
import { adapter, AdapterError } from '@/data';
import { useAdapterQuery } from '@/hooks/useAdapterQuery';
import { formatClock } from '@/lib/time';
import { useSession } from '@/store/useSession';
import { MIN_TOUCH_TARGET, useTheme } from '@/theme';

/**
 * Design 11. Simulated Front Porch call — timer, mute (local), +10 min (both agree), end, report.
 * No real audio connection in Phase 1.
 */
export function CallScreen() {
  const { voiceDateId } = useLocalSearchParams<{ voiceDateId: string }>();
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const me = useSession((s) => s.profile);
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const matchQ = useAdapterQuery(async () => {
    if (!voiceDateId) throw new Error('Missing voice date');
    const matches = await adapter.getMatches();
    // Resolve match via voice dates on each chat would be heavy; scan matches' chats.
    for (const m of matches) {
      const chat = await adapter.getChat(m.match.id);
      const vd = chat.voice_dates.find((v) => v.id === voiceDateId);
      if (vd) return { chat, vd };
    }
    throw new Error('Voice date not found');
  }, [voiceDateId]);

  const pair = matchQ.data;
  const vd = pair?.vd;
  const otherName = pair?.chat.other.profile.first_name ?? 'them';
  const limitSeconds = (rules.voiceDates.defaultMinutes + (vd?.extended_count ?? 0) * rules.voiceDates.extensionMinutes) * 60;
  const remaining = Math.max(0, limitSeconds - elapsed);
  const progress = limitSeconds > 0 ? Math.min(1, elapsed / limitSeconds) : 0;
  const iVoted = Boolean(me && vd?.extension_votes.includes(me.id));

  useEffect(() => {
    if (!vd || vd.status !== 'live') return;
    const started = vd.started_at ? new Date(vd.started_at).getTime() : Date.now();
    const sync = () => setElapsed(Math.floor((Date.now() - started) / 1000));
    sync();
    tickRef.current = setInterval(sync, 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [vd?.id, vd?.status, vd?.started_at]);

  useEffect(() => {
    if (remaining === 0 && vd?.status === 'live' && elapsed > 0) {
      void endCall();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  const endCall = async () => {
    if (!voiceDateId || busy) return;
    setBusy(true);
    try {
      await adapter.endVoiceDate(voiceDateId, elapsed);
      router.replace({ pathname: '/front-porch/feedback/[voiceDateId]', params: { voiceDateId } });
    } catch (e) {
      setBusy(false);
      setError(e instanceof AdapterError ? e.message : 'Could not end the call.');
    }
  };

  const extend = async () => {
    if (!voiceDateId) return;
    setBusy(true);
    setError(null);
    try {
      await adapter.requestVoiceDateExtension(voiceDateId);
      await matchQ.refresh();
    } catch (e) {
      setError(e instanceof AdapterError ? e.message : 'Could not request more time.');
    } finally {
      setBusy(false);
    }
  };

  const report = async () => {
    if (!voiceDateId) return;
    setBusy(true);
    try {
      await adapter.reportVoiceDate(voiceDateId, 'Reported from Front Porch call');
      await endCall();
    } catch (e) {
      setBusy(false);
      setError(e instanceof AdapterError ? e.message : 'Could not send the report.');
    }
  };

  if (!pair) {
    return (
      <Screen immersive>
        <Text variant="body" color="immersiveMuted">
          {matchQ.error?.message ?? 'Connecting…'}
        </Text>
      </Screen>
    );
  }

  return (
    <Screen immersive scroll={false} padded>
      <View style={styles.center}>
        <Text variant="overline" color="immersiveMuted">
          FRONT PORCH
        </Text>
        <Text variant="title" color="immersiveText" align="center" style={{ marginTop: spacing.sm }}>
          Voice date with {otherName}
        </Text>
        <Text variant="caption" color="immersiveMuted" align="center" style={{ marginTop: spacing.sm }}>
          Voice only. Never recorded.
        </Text>

        <View style={[styles.ringWrap, { marginTop: spacing.xxxl }]}>
          <View
            style={[
              styles.ring,
              {
                borderColor: colors.lavender,
                borderTopColor: colors.primary,
                transform: [{ rotate: `${progress * 360}deg` }],
              },
            ]}
          />
          <Avatar variant="blurred" size={120} seed={pair.chat.other.profile.id} name={otherName} />
        </View>

        <Text variant="display" color="immersiveText" align="center" style={{ marginTop: spacing.xxl }}>
          {formatClock(remaining)}
        </Text>
        <Text variant="caption" color="immersiveMuted" align="center">
          left of {Math.round(limitSeconds / 60)} minutes
        </Text>

        <Waveform
          seed={otherName}
          bars={28}
          height={28}
          style={{ marginTop: spacing.xl, width: '70%', opacity: muted ? 0.35 : 1 }}
          color="rgba(196,181,253,0.45)"
          activeColor="#C4B5FD"
          progress={muted ? 0 : 0.65}
        />
        <Text variant="caption" color="immersiveMuted" style={{ marginTop: spacing.sm }}>
          {muted ? 'You are muted' : `${otherName} is speaking`}
        </Text>

        {error ? (
          <Text variant="caption" color="danger" style={{ marginTop: spacing.md }}>
            {error}
          </Text>
        ) : null}
        {iVoted && (vd?.extension_votes.length ?? 0) < 2 ? (
          <Text variant="caption" color="immersiveMuted" style={{ marginTop: spacing.sm }}>
            Waiting for {otherName} to agree to +{rules.voiceDates.extensionMinutes} min…
          </Text>
        ) : null}
      </View>

      <View style={[styles.controls, { marginBottom: spacing.lg }]}>
        <CallButton
          label={muted ? 'Unmute' : 'Mute'}
          bg={colors.immersiveSurface}
          onPress={() => setMuted((m) => !m)}
          icon={muted ? <MicOff size={22} color="#FFFFFF" /> : <Mic size={22} color="#FFFFFF" />}
        />
        <CallButton
          label={`+${rules.voiceDates.extensionMinutes} min`}
          bg={colors.primary}
          onPress={() => void extend()}
          disabled={busy || iVoted}
          icon={<TimerReset size={22} color="#FFFFFF" />}
        />
        <CallButton label="End" bg={colors.danger} onPress={() => void endCall()} disabled={busy} icon={<PhoneOff size={22} color="#FFFFFF" />} />
      </View>

      <Pressable accessibilityRole="button" accessibilityLabel="Report a problem" onPress={() => void report()} style={{ minHeight: MIN_TOUCH_TARGET, alignItems: 'center', justifyContent: 'center' }}>
        <Text variant="caption" color="immersiveMuted">
          Report a problem
        </Text>
      </Pressable>
    </Screen>
  );
}

function CallButton({
  label,
  icon,
  bg,
  onPress,
  disabled,
}: {
  label: string;
  icon: React.ReactNode;
  bg: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={{ alignItems: 'center', gap: 8, opacity: disabled ? 0.45 : 1, minWidth: 72 }}
    >
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>{icon}</View>
      <Text variant="captionStrong" color="immersiveText">
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringWrap: {
    width: 148,
    height: 148,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 148,
    height: 148,
    borderRadius: 74,
    borderWidth: 3,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 28,
  },
});
