import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Card, IconButton, Screen, Text } from '@/components/ui';
import { currency } from '@/config/currency';
import { adapter, AdapterError } from '@/data';
import { useAdapterQuery } from '@/hooks/useAdapterQuery';
import { useTheme } from '@/theme';

const earnRows = [
  { label: 'Complete your profile', amount: currency.earn.completeProfile },
  { label: 'Add a voice intro', amount: currency.earn.addVoiceIntro },
  { label: 'Get verified', amount: currency.earn.getVerified },
  { label: 'Daily check-in', amount: currency.earn.dailyCheckIn },
] as const;

const spendRows = [
  { label: 'Extra like (after 8 free)', amount: currency.spend.extraLike },
  { label: `Send a ${currency.giftName}`, amount: currency.spend.sendLily },
  { label: 'Profile boost', amount: currency.spend.profileBoost },
  { label: 'Extra Aunt Martha question', amount: currency.spend.auntMarthaQuestion },
] as const;

/** Mock Talents wallet: balance, earn/spend, guardrails, and purchase bundles. */
export function WalletScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const wallet = useAdapterQuery(() => adapter.getWallet());
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const purchase = async (bundleId: string, label: string, talents: number) => {
    setBusyId(bundleId);
    setError(null);
    setMessage(null);
    try {
      await adapter.purchaseBundle(bundleId);
      setMessage(`Added ${talents} ${currency.name} from “${label}”. (Purchase is mocked in Phase 1.)`);
    } catch (e) {
      setError(e instanceof AdapterError ? e.message : 'Purchase failed.');
    } finally {
      setBusyId(null);
    }
  };

  const checkIn = async () => {
    setBusyId('checkin');
    setError(null);
    setMessage(null);
    try {
      const before = wallet.data?.balance ?? 0;
      const after = await adapter.claimDailyCheckIn();
      if (after.balance > before) setMessage(`+${currency.earn.dailyCheckIn} ${currency.name} for checking in today.`);
      else setMessage('You already checked in today.');
    } catch (e) {
      setError(e instanceof AdapterError ? e.message : 'Could not check in.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <IconButton accessibilityLabel="Back" icon={<ChevronLeft size={20} color={colors.heading} />} tone="outline" size={52} onPress={() => router.back()} />
        <Text variant="title" color="heading" style={{ flex: 1 }}>
          {currency.name}
        </Text>
      </View>

      <Card tone="tint" style={{ marginTop: spacing.xxl, alignItems: 'center', paddingVertical: spacing.xxxl }}>
        <Text variant="captionStrong" color="muted">
          Your balance
        </Text>
        <Text variant="display" color="heading" style={{ marginTop: spacing.sm }}>
          {wallet.data?.balance ?? 0}
        </Text>
        <Button
          label="Daily check-in"
          variant="secondary"
          onPress={() => void checkIn()}
          loading={busyId === 'checkin'}
          style={{ marginTop: spacing.xl }}
          fullWidth={false}
        />
      </Card>

      {message ? (
        <Text variant="caption" color="primary" style={{ marginTop: spacing.md }} align="center">
          {message}
        </Text>
      ) : null}
      {error ? (
        <Text variant="caption" color="danger" style={{ marginTop: spacing.md }} align="center">
          {error}
        </Text>
      ) : null}

      <Text variant="subheading" color="heading" style={{ marginTop: spacing.xxxl }}>
        How to earn
      </Text>
      <Card style={{ marginTop: spacing.md, gap: spacing.md }}>
        {earnRows.map((row) => (
          <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
            <Text variant="body" color="text" style={{ flex: 1 }}>
              {row.label}
            </Text>
            <Text variant="bodyStrong" color="primary">
              +{row.amount}
            </Text>
          </View>
        ))}
      </Card>

      <Text variant="subheading" color="heading" style={{ marginTop: spacing.xxxl }}>
        How to spend
      </Text>
      <Card style={{ marginTop: spacing.md, gap: spacing.md }}>
        {spendRows.map((row) => (
          <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
            <Text variant="body" color="text" style={{ flex: 1 }}>
              {row.label}
            </Text>
            <Text variant="bodyStrong" color="heading">
              {row.amount}
            </Text>
          </View>
        ))}
      </Card>

      <Card tone="tint" style={{ marginTop: spacing.lg }}>
        <Text variant="captionStrong" color="heading">
          {currency.name} never buy
        </Text>
        {currency.neverBuys.map((item) => (
          <Text key={item} variant="caption" color="muted" style={{ marginTop: 4 }}>
            · {item}
          </Text>
        ))}
      </Card>

      <Text variant="subheading" color="heading" style={{ marginTop: spacing.xxxl }}>
        Buy {currency.name}
      </Text>
      <Text variant="caption" color="muted" style={{ marginTop: spacing.xs }}>
        Purchases are mocked in this prototype — tapping a bundle credits your balance instantly.
      </Text>
      <View style={{ marginTop: spacing.md, gap: spacing.md }}>
        {currency.bundles.map((bundle) => {
          const popular = 'popular' in bundle && bundle.popular === true;
          return (
          <Card key={bundle.id} tone={popular ? 'tint' : 'outline'}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text variant="subheading" color="heading">
                  {bundle.label}
                </Text>
                <Text variant="caption" color="muted">
                  {bundle.talents} {currency.name}
                  {popular ? ' · Most chosen' : ''}
                </Text>
              </View>
              <Button
                label={`$${bundle.priceUsd}`}
                fullWidth={false}
                size="md"
                loading={busyId === bundle.id}
                onPress={() => void purchase(bundle.id, bundle.label, bundle.talents)}
              />
            </View>
          </Card>
          );
        })}
      </View>
    </Screen>
  );
}
