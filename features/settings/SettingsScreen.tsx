import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Switch, View } from 'react-native';

import { Button, Card, Chip, IconButton, Screen, Text, TextField } from '@/components/ui';
import { auntMartha } from '@/config/auntMartha';
import { currency } from '@/config/currency';
import { adapter } from '@/data';
import { useAdapterQuery } from '@/hooks/useAdapterQuery';
import { useSession } from '@/store/useSession';
import { MIN_TOUCH_TARGET, useTheme, useThemePreference, type ThemePreference } from '@/theme';

const themeOptions: { id: ThemePreference; label: string }[] = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];

/** SPEC §6.13 Settings hub. Edit profile lightly; Aunt Martha controls; stubs for ads/help. */
export function SettingsScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const { preference, setPreference } = useThemePreference();
  const applySession = useSession((s) => s.applySession);
  const me = useSession((s) => s.profile);
  const coach = useAdapterQuery(() => adapter.getCoachThread());
  const partner = useAdapterQuery(() => adapter.getAccountabilityPartner());

  const [city, setCity] = useState(me?.city ?? '');
  const [partnerName, setPartnerName] = useState(partner.data?.name ?? '');
  const [partnerEmail, setPartnerEmail] = useState(partner.data?.email ?? '');
  const [savedNote, setSavedNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const nudgesOn = coach.data?.settings.nudges_on ?? true;
  const freeLeft = coach.data?.free_left ?? 0;

  const saveProfile = async () => {
    setBusy(true);
    try {
      await adapter.saveProfile({ city: city.trim() || me?.city });
      setSavedNote('Profile saved.');
    } finally {
      setBusy(false);
    }
  };

  const savePartner = async () => {
    setBusy(true);
    try {
      if (!partnerName.trim() || !partnerEmail.trim()) await adapter.setAccountabilityPartner(null);
      else await adapter.setAccountabilityPartner({ name: partnerName.trim(), email: partnerEmail.trim() });
      await partner.refresh();
      setSavedNote('Accountability partner updated.');
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    await adapter.signOut();
    applySession({ profile: null, onboarding_complete: false, resume_step: 1 });
    router.replace('/(onboarding)/welcome');
  };

  return (
    <Screen grouped>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xl }}>
        <IconButton accessibilityLabel="Back" icon={<ArrowLeft size={20} color={colors.heading} />} tone="outline" size={48} onPress={() => router.back()} />
        <Text variant="title" color="heading">
          Settings
        </Text>
      </View>

      {savedNote ? (
        <Text variant="caption" color="primary" style={{ marginBottom: spacing.md }}>
          {savedNote}
        </Text>
      ) : null}

      <Card style={{ gap: spacing.md }}>
        <Text variant="captionStrong" color="muted">
          Edit profile
        </Text>
        <TextField label="City" value={city} onChangeText={setCity} />
        <Button label="Save profile" variant="secondary" onPress={() => void saveProfile()} loading={busy} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={auntMartha.entryPoints.profile}
          onPress={() => router.push({ pathname: '/aunt-martha', params: { context: 'profile' } })}
          style={{ minHeight: MIN_TOUCH_TARGET, justifyContent: 'center' }}
        >
          <Text variant="bodyStrong" color="primary">
            {auntMartha.entryPoints.profile}
          </Text>
        </Pressable>
      </Card>

      <Card style={{ marginTop: spacing.md, gap: spacing.md }}>
        <Text variant="captionStrong" color="muted">
          Appearance
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }} accessibilityRole="radiogroup">
          {themeOptions.map((o) => (
            <Chip key={o.id} variant="choice" label={o.label} selected={preference === o.id} onPress={() => setPreference(o.id)} />
          ))}
        </View>
      </Card>

      <Card style={{ marginTop: spacing.md, gap: spacing.md }}>
        <Text variant="captionStrong" color="muted">
          {auntMartha.name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: MIN_TOUCH_TARGET }}>
          <Text variant="body" color="heading" style={{ flex: 1 }}>
            Nudges from Aunt Martha
          </Text>
          <Switch
            value={nudgesOn}
            onValueChange={(on) => void adapter.setCoachNudges(on).then(() => coach.refresh())}
            accessibilityLabel="Aunt Martha nudges"
          />
        </View>
        <Text variant="caption" color="muted">
          {auntMartha.usage.freeLeft(freeLeft)} this week · Profile coaching is always free
        </Text>
        <Button
          label="Clear conversation history"
          variant="secondary"
          onPress={() => void adapter.clearCoachThread().then(() => coach.refresh())}
        />
      </Card>

      <Card style={{ marginTop: spacing.md, gap: spacing.md }}>
        <Text variant="captionStrong" color="muted">
          Accountability partner
        </Text>
        <TextField label="Name" value={partnerName} onChangeText={setPartnerName} />
        <TextField label="Email" value={partnerEmail} onChangeText={setPartnerEmail} autoCapitalize="none" keyboardType="email-address" />
        <Button label="Save partner" variant="secondary" onPress={() => void savePartner()} loading={busy} />
      </Card>

      <Card style={{ marginTop: spacing.md }} onPress={() => router.push('/wallet')} accessibilityRole="button" accessibilityLabel={`Open ${currency.name} wallet`}>
        <Row label={`${currency.name} wallet`} />
      </Card>

      <Card padding={0} style={{ marginTop: spacing.md }}>
        <StubRow label="Remove ads" subtitle="Coming soon" />
        <StubRow label="Promote my profile" subtitle="Coming soon" />
        <StubRow label="Help and support" />
        <StubRow label="Submit feedback" />
        <StubRow label="Community guidelines" />
        <StubRow label="Privacy policy" />
        <StubRow label="Terms of use" />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Log out"
          onPress={() => void signOut()}
          style={({ pressed }) => ({
            minHeight: MIN_TOUCH_TARGET,
            paddingHorizontal: 16,
            paddingVertical: 14,
            flexDirection: 'row',
            alignItems: 'center',
            opacity: pressed ? 0.7 : 1,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          })}
        >
          <Text variant="bodyStrong" color="danger" style={{ flex: 1 }}>
            Log out
          </Text>
        </Pressable>
      </Card>
    </Screen>
  );
}

function Row({ label }: { label: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: MIN_TOUCH_TARGET }}>
      <Text variant="bodyStrong" color="heading" style={{ flex: 1 }}>
        {label}
      </Text>
      <ChevronRight size={18} color={colors.muted} />
    </View>
  );
}

function StubRow({ label, subtitle }: { label: string; subtitle?: string }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        minHeight: MIN_TOUCH_TARGET,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.border,
        gap: 8,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text variant="bodyStrong" color="heading">
          {label}
        </Text>
        {subtitle ? (
          <Text variant="caption" color="muted">
            {subtitle}
          </Text>
        ) : null}
      </View>
      <ChevronRight size={18} color={colors.muted} />
    </View>
  );
}
