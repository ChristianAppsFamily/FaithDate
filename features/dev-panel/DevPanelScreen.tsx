import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { Button, Card, Chip, IconButton, Screen, Text } from '@/components/ui';
import { currency } from '@/config/currency';
import { adapter, mockAdapter, type DevEvent } from '@/data';
import { useAdapterQuery } from '@/hooks/useAdapterQuery';
import { useSession } from '@/store/useSession';
import { useTheme } from '@/theme';

/**
 * Dev panel (SPEC section 6 item 17). Prototype only; reachable from Profile in dev builds.
 * Every action goes through `adapter.devSimulate` so the Supabase adapter can ignore it.
 */
export function DevPanelScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const profile = useSession((s) => s.profile);
  const applySession = useSession((s) => s.applySession);
  const matches = useAdapterQuery(() => adapter.getMatches());
  const wallet = useAdapterQuery(() => adapter.getWallet());
  const autoReply = useAdapterQuery(() => mockAdapter.getAutoReply());
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const run = async (event: DevEvent, label: string) => {
    try {
      await adapter.devSimulate(event);
      setStatus(`${label} done.`);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Something went wrong.');
    }
  };

  const matchId = selectedMatch ?? matches.data?.[0]?.match.id;

  const resetAll = async () => {
    await adapter.devSimulate({ type: 'reset_all' });
    applySession({ profile: null, onboarding_complete: false, resume_step: 1 });
    router.replace('/(onboarding)/welcome');
  };

  return (
    <Screen grouped>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text variant="caption" color="muted">
            Prototype only
          </Text>
          <Text variant="title" color="heading" accessibilityRole="header">
            Dev panel
          </Text>
        </View>
        <IconButton accessibilityLabel="Close dev panel" icon={<X size={20} color={colors.heading} />} tone="outline" size={48} onPress={() => router.back()} />
      </View>

      {status ? (
        <Card tone="tint" style={{ marginTop: spacing.lg }}>
          <Text variant="caption" color="primary">
            {status}
          </Text>
        </Card>
      ) : null}

      <Section title="Incoming events">
        <Row>
          <Button label="Like" size="md" variant="secondary" fullWidth={false} onPress={() => run({ type: 'incoming_like' }, 'Incoming like')} />
          <Button label="Lily" size="md" variant="secondary" fullWidth={false} onPress={() => run({ type: 'incoming_like', is_lily: true }, 'Incoming Lily')} />
          <Button label="Match" size="md" variant="secondary" fullWidth={false} onPress={() => run({ type: 'incoming_match' }, 'New match')} />
        </Row>
      </Section>

      <Section title="For a match">
        <View style={styles.chips}>
          {(matches.data ?? []).map((m) => (
            <Chip
              key={m.match.id}
              variant="choice"
              label={m.other.profile.first_name}
              selected={m.match.id === matchId}
              onPress={() => setSelectedMatch(m.match.id)}
            />
          ))}
          {(matches.data ?? []).length === 0 ? (
            <Text variant="caption" color="muted">
              No matches yet. Create one above.
            </Text>
          ) : null}
        </View>
        <Row>
          <Button label="Message" size="md" variant="secondary" fullWidth={false} disabled={!matchId} onPress={() => run({ type: 'incoming_message', match_id: matchId }, 'Incoming message')} />
          <Button label="Exchange request" size="md" variant="secondary" fullWidth={false} disabled={!matchId} onPress={() => run({ type: 'exchange_request', match_id: matchId }, 'Exchange request')} />
        </Row>
        <Row>
          <Button label="Voice date invite" size="md" variant="secondary" fullWidth={false} disabled={!matchId} onPress={() => run({ type: 'voice_date_invite', match_id: matchId }, 'Voice date invite')} />
          <Button label="Date plan (past)" size="md" variant="secondary" fullWidth={false} disabled={!matchId} onPress={() => run({ type: 'date_plan', match_id: matchId }, 'Date plan')} />
        </Row>
        <Row>
          <Button
            label="+10 messages each"
            size="md"
            variant="secondary"
            fullWidth={false}
            disabled={!matchId}
            onPress={() => matchId && run({ type: 'fast_forward_messages', match_id: matchId, count: 10 }, 'Fast-forward')}
          />
        </Row>
      </Section>

      <Section title="My profile">
        <View style={styles.chips}>
          <Chip variant="choice" label={`Verified: ${profile?.verified ? 'yes' : 'no'}`} selected={profile?.verified ?? false} onPress={() => run({ type: 'toggle_verified' }, 'Verified toggled')} />
          <Chip variant="choice" label={profile?.intent === 'spouse' ? 'Seeking a spouse' : 'Dating with purpose'} selected={profile?.intent === 'spouse'} onPress={() => run({ type: 'toggle_intent' }, 'Intent toggled')} />
          <Chip variant="choice" label={`Gender: ${profile?.gender === 'female' ? 'woman' : 'man'}`} selected onPress={() => run({ type: 'toggle_gender' }, 'Gender toggled')} />
        </View>
      </Section>

      <Section title={`${currency.name} (${wallet.data?.balance ?? 0})`}>
        <Row>
          <Button label="+25" size="md" variant="secondary" fullWidth={false} onPress={() => run({ type: 'add_talents', amount: 25 }, `Added 25 ${currency.name}`)} />
          <Button label="+100" size="md" variant="secondary" fullWidth={false} onPress={() => run({ type: 'add_talents', amount: 100 }, `Added 100 ${currency.name}`)} />
        </Row>
      </Section>

      <Section title="Batch and simulation">
        <Row>
          <Button label="Reset daily batch" size="md" variant="secondary" fullWidth={false} onPress={() => run({ type: 'reset_batch' }, 'Batch reset')} />
        </Row>
        <View style={[styles.switchRow, { marginTop: spacing.sm }]}>
          <View style={{ flex: 1 }}>
            <Text variant="bodyStrong" color="heading">
              Simulated replies
            </Text>
            <Text variant="caption" color="muted">
              The other person replies a few seconds after you message, agrees to exchanges, and accepts date plans.
            </Text>
          </View>
          <Switch
            value={autoReply.data ?? true}
            onValueChange={(v) => void mockAdapter.setAutoReply(v)}
            accessibilityLabel="Simulated replies"
            trackColor={{ true: colors.primary, false: colors.border }}
          />
        </View>
      </Section>

      <Section title="Danger zone">
        <Button label="Reset everything and start over" variant="secondary" onPress={resetAll} />
      </Section>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { spacing } = useTheme();
  return (
    <Card style={{ marginTop: spacing.lg, gap: spacing.md }}>
      <Text variant="captionStrong" color="muted">
        {title}
      </Text>
      {children}
    </Card>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
