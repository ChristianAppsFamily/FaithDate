import { useState } from 'react';
import { View } from 'react-native';

import { Button, Card, Text } from '@/components/ui';
import { adapter, AdapterError, type DatePlan } from '@/data';
import { shareDatePlanIcs } from '@/lib/ics';
import { formatDateTime } from '@/lib/time';
import { useTheme } from '@/theme';

interface DatePlanCardProps {
  plan: DatePlan;
  otherName: string;
  /** True when the current user proposed this plan (shows waiting state). */
  iProposed: boolean;
  onChanged: () => void;
}

const whoPaysLabel: Record<DatePlan['who_pays'], string> = {
  treat: "I'll treat",
  split: "Let's split",
  each: 'Each pays our own',
};

/** Chat card for proposed / confirmed date plans (SPEC Plan a date). */
export function DatePlanCard({ plan, otherName, iProposed, onChanged }: DatePlanCardProps) {
  const { spacing } = useTheme();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activity = plan.activity === 'other' ? plan.activity_other ?? 'Date' : plan.activity.replace('_', ' ');

  const respond = async (action: 'accept' | 'suggest_changes' | 'not_yet', chosen?: string) => {
    setBusy(true);
    setError(null);
    try {
      if (action === 'accept' && chosen) await adapter.respondToDatePlan(plan.id, { action: 'accept', chosen_time: chosen });
      else if (action === 'suggest_changes') await adapter.respondToDatePlan(plan.id, { action: 'suggest_changes', note: 'Could we try another time or place?' });
      else if (action === 'not_yet') await adapter.respondToDatePlan(plan.id, { action: 'not_yet' });
      onChanged();
    } catch (e) {
      setError(e instanceof AdapterError ? e.message : 'Could not update the plan.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card tone="outline" style={{ marginVertical: spacing.sm, gap: spacing.sm }}>
      <Text variant="captionStrong" color="muted">
        Date plan
      </Text>
      <Text variant="subheading" color="heading">
        {activity.charAt(0).toUpperCase() + activity.slice(1)} at {plan.place_name}
      </Text>
      <Text variant="caption" color="muted" style={{ lineHeight: 20 }}>
        {plan.place_address} · {whoPaysLabel[plan.who_pays]}
      </Text>

      {plan.status === 'proposed' && !iProposed ? (
        <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
          <Text variant="captionStrong" color="heading">
            Pick a time
          </Text>
          {plan.time_options.map((t) => (
            <Button key={t} label={formatDateTime(t)} variant="secondary" onPress={() => void respond('accept', t)} disabled={busy} />
          ))}
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <View style={{ flex: 1 }}>
              <Button label="Suggest changes" variant="ghost" onPress={() => void respond('suggest_changes')} disabled={busy} />
            </View>
            <View style={{ flex: 1 }}>
              <Button label="Not yet" variant="ghost" onPress={() => void respond('not_yet')} disabled={busy} />
            </View>
          </View>
        </View>
      ) : null}

      {plan.status === 'proposed' && iProposed ? (
        <Text variant="caption" color="muted">
          Waiting for {otherName} to pick a time.
        </Text>
      ) : null}

      {plan.status === 'confirmed' && plan.chosen_time ? (
        <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
          <Text variant="bodyStrong" color="heading">
            Confirmed · {formatDateTime(plan.chosen_time)}
          </Text>
          <Button label="Add to calendar" variant="secondary" onPress={() => void shareDatePlanIcs(plan, otherName)} />
          <Button
            label="Share with accountability partner"
            variant="ghost"
            onPress={() => void adapter.shareDatePlan(plan.id, 'partner').then(onChanged)}
          />
        </View>
      ) : null}

      {plan.status === 'changes_requested' ? (
        <Text variant="caption" color="muted">
          {otherName} suggested changes{plan.change_note ? `: ${plan.change_note}` : '.'}
        </Text>
      ) : null}

      {error ? (
        <Text variant="caption" color="danger">
          {error}
        </Text>
      ) : null}
    </Card>
  );
}
