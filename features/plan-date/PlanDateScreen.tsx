import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MapPin } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Avatar, Button, Chip, IconButton, Screen, Text, TextField } from '@/components/ui';
import { auntMartha } from '@/config/auntMartha';
import { rules } from '@/config/rules';
import { adapter, AdapterError, type DateActivity, type Place, type WhoPays } from '@/data';
import { useAdapterQuery } from '@/hooks/useAdapterQuery';
import { formatDateTime } from '@/lib/time';
import { useSession } from '@/store/useSession';
import { useTheme } from '@/theme';

const ACTIVITIES: { id: DateActivity; label: string }[] = [
  { id: 'coffee', label: 'Coffee' },
  { id: 'brunch', label: 'Brunch' },
  { id: 'walk', label: 'Walk' },
  { id: 'church_event', label: 'Church event' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'other', label: 'Other' },
];

const WHO_PAYS: { id: WhoPays; label: string }[] = [
  { id: 'treat', label: "I'll treat" },
  { id: 'split', label: "Let's split" },
  { id: 'each', label: 'Each pays' },
];

function defaultTimeOptions(): string[] {
  const a = new Date();
  a.setDate(a.getDate() + 2);
  a.setHours(11, 0, 0, 0);
  const b = new Date();
  b.setDate(b.getDate() + 3);
  b.setHours(14, 0, 0, 0);
  return [a.toISOString(), b.toISOString()];
}

/**
 * Design 12. Plan a date form — activity, times, public place, who pays, optional partner share.
 */
export function PlanDateScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const { colors, radii, spacing } = useTheme();
  const router = useRouter();
  const me = useSession((s) => s.profile);
  const chat = useAdapterQuery(() => (matchId ? adapter.getChat(matchId) : Promise.reject(new Error('Missing match'))), [matchId]);
  const partner = useAdapterQuery(() => adapter.getAccountabilityPartner());

  const [activity, setActivity] = useState<DateActivity>('coffee');
  const [activityOther, setActivityOther] = useState('');
  const [times, setTimes] = useState<string[]>(defaultTimeOptions);
  const [placeQuery, setPlaceQuery] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [place, setPlace] = useState<Place | null>(null);
  const [whoPays, setWhoPays] = useState<WhoPays>('split');
  const [sharePartner, setSharePartner] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const otherName = chat.data?.other.profile.first_name ?? 'them';
  const city = me?.city ?? chat.data?.other.profile.city ?? 'Atlanta';

  useEffect(() => {
    void adapter.searchPlaces(placeQuery, city).then(setPlaces);
  }, [placeQuery, city]);

  useEffect(() => {
    if (partner.data && sharePartner === false && partner.data.status === 'active') {
      // leave unchecked by default; user opts in
    }
  }, [partner.data, sharePartner]);

  const addTime = () => {
    if (times.length >= rules.datePlans.maxTimeOptions) return;
    const next = new Date();
    next.setDate(next.getDate() + 4 + times.length);
    next.setHours(18, 0, 0, 0);
    setTimes((t) => [...t, next.toISOString()]);
  };

  const submit = async () => {
    if (!matchId || !place) return;
    if (times.length < rules.datePlans.minTimeOptions) {
      setError(`Offer at least ${rules.datePlans.minTimeOptions} times.`);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await adapter.proposeDatePlan(matchId, {
        activity,
        activity_other: activity === 'other' ? activityOther.trim() || undefined : undefined,
        time_options: times,
        place,
        who_pays: whoPays,
        share_with_partner: sharePartner,
      });
      router.replace({ pathname: '/chat/[id]', params: { id: matchId } });
    } catch (e) {
      setError(e instanceof AdapterError ? e.message : 'Could not send the date plan.');
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
          <Button label="Send date plan" onPress={() => void submit()} loading={busy} disabled={!place || !chat.data?.can_plan_date} />
          <Text variant="caption" color="muted" align="center">
            FaithDate never books or charges for your date.
          </Text>
        </View>
      }
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xl }}>
        <IconButton accessibilityLabel="Close" icon={<ArrowLeft size={20} color={colors.heading} />} tone="outline" size={48} onPress={() => router.back()} />
        <Text variant="heading" color="heading" style={{ flex: 1 }}>
          Plan a date with {otherName}
        </Text>
      </View>

      {!chat.data?.can_plan_date ? (
        <Text variant="body" color="muted" style={{ lineHeight: 24 }}>
          Plan a date opens up after your Photo Exchange.
        </Text>
      ) : (
        <View style={{ gap: spacing.xxl }}>
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
              <Text variant="subheading" color="heading">
                What would you like to do?
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={auntMartha.entryPoints.planDate}
                onPress={() => router.push({ pathname: '/aunt-martha', params: { context: 'date_plan', matchId: matchId ?? '' } })}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44 }}
              >
                <Avatar variant="coach" size={28} name={auntMartha.name} />
                <Text variant="captionStrong" color="primary">
                  Ideas from Aunt Martha
                </Text>
              </Pressable>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {ACTIVITIES.map((a) => (
                <Chip key={a.id} variant="choice" label={a.label} selected={activity === a.id} onPress={() => setActivity(a.id)} />
              ))}
            </View>
            {activity === 'other' ? (
              <TextField label="Describe the activity" value={activityOther} onChangeText={setActivityOther} style={{ marginTop: spacing.md }} />
            ) : null}
          </View>

          <View>
            <Text variant="subheading" color="heading" style={{ marginBottom: spacing.md }}>
              Offer a few times
            </Text>
            <View style={{ gap: spacing.sm }}>
              {times.map((t, i) => (
                <View
                  key={t}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: spacing.md,
                    borderRadius: radii.lg,
                    borderWidth: 1.5,
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                    minHeight: 52,
                  }}
                >
                  <Text variant="bodyStrong" color="heading" style={{ flex: 1 }}>
                    {formatDateTime(t)}
                  </Text>
                  <Text variant="caption" color="muted">
                    Option {i + 1}
                  </Text>
                </View>
              ))}
              {times.length < rules.datePlans.maxTimeOptions ? (
                <Button label="+ Add another time" variant="secondary" onPress={addTime} />
              ) : null}
            </View>
          </View>

          <View>
            <Text variant="subheading" color="heading" style={{ marginBottom: spacing.md }}>
              Where
            </Text>
            <TextField label="Search public places" value={placeQuery} onChangeText={setPlaceQuery} placeholder="Coffee, park, church…" />
            {place ? (
              <View
                style={{
                  marginTop: spacing.md,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.md,
                  padding: spacing.md,
                  borderRadius: radii.lg,
                  borderWidth: 1.5,
                  borderColor: colors.primary,
                  backgroundColor: colors.surface,
                }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: colors.lavenderTint, alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={18} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyStrong" color="heading">
                    {place.name}
                  </Text>
                  <Text variant="caption" color="muted">
                    {place.address}, {place.city}
                  </Text>
                </View>
                <Chip label="Public" variant="status" small />
              </View>
            ) : (
              <View style={{ marginTop: spacing.sm, gap: spacing.xs }}>
                {places.slice(0, 5).map((p) => (
                  <Pressable
                    key={p.id}
                    onPress={() => setPlace(p)}
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${p.name}`}
                    style={{ minHeight: 48, justifyContent: 'center', paddingVertical: 8 }}
                  >
                    <Text variant="bodyStrong" color="heading">
                      {p.name}
                    </Text>
                    <Text variant="caption" color="muted">
                      {p.address}, {p.city}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View>
            <Text variant="subheading" color="heading" style={{ marginBottom: spacing.md }}>
              Who&apos;s paying?
            </Text>
            <View style={{ flexDirection: 'row', backgroundColor: colors.lavenderTint, borderRadius: radii.lg, padding: 4, gap: 4 }}>
              {WHO_PAYS.map((o) => (
                <Pressable
                  key={o.id}
                  onPress={() => setWhoPays(o.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: whoPays === o.id }}
                  style={{
                    flex: 1,
                    minHeight: 44,
                    borderRadius: radii.lg,
                    backgroundColor: whoPays === o.id ? colors.surface : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 4,
                  }}
                >
                  <Text variant="captionStrong" color={whoPays === o.id ? 'heading' : 'muted'} align="center">
                    {o.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: sharePartner }}
            onPress={() => setSharePartner((v) => !v)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 48 }}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                borderWidth: 2,
                borderColor: colors.primary,
                backgroundColor: sharePartner ? colors.primary : 'transparent',
              }}
            />
            <Text variant="body" color="text" style={{ flex: 1, lineHeight: 22 }}>
              Share the time and place with my accountability partner
            </Text>
          </Pressable>
        </View>
      )}
    </Screen>
  );
}
