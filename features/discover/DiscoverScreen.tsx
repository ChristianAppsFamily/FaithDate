import { SlidersHorizontal } from 'lucide-react-native';

import { IconButton, Screen, TabHeader, TAB_BAR_HEIGHT } from '@/components/ui';
import { adapter } from '@/data';
import { ShellPlaceholder } from '@/features/shell/ShellPlaceholder';
import { useAdapterQuery } from '@/hooks/useAdapterQuery';
import { useTheme } from '@/theme';

export function DiscoverScreen() {
  const { colors } = useTheme();
  const batch = useAdapterQuery(() => adapter.getBatch());
  const remaining = batch.data?.remaining ?? 0;
  const total = batch.data ? Math.max(batch.data.remaining, batch.data.cards.length) : 10;

  return (
    <Screen grouped bottomInset={TAB_BAR_HEIGHT}>
      <TabHeader
        eyebrow={batch.data ? `${remaining} of ${Math.max(total, 10)} left today` : ' '}
        title="Today"
        action={<IconButton accessibilityLabel="Filter today's profiles" icon={<SlidersHorizontal size={20} color={colors.heading} />} tone="outline" size={48} />}
      />
      <ShellPlaceholder
        milestone="Milestone 3"
        rows={(batch.data?.cards ?? []).map((c) => ({
          id: c.profile.id,
          title: `${c.profile.first_name}, ${c.age}`,
          subtitle: `${c.profile.city} · ${c.denomination_label}${c.voice_intro ? ' · Voice intro' : ''}${c.profile.verified ? ' · Verified' : ''}`,
          avatarSeed: c.profile.id,
        }))}
        emptyTitle="You're caught up"
        emptyBody="New profiles arrive at 7pm."
      />
    </Screen>
  );
}
