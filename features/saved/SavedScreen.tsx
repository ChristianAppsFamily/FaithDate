import { Screen, TabHeader, TAB_BAR_HEIGHT } from '@/components/ui';
import { adapter } from '@/data';
import { ShellPlaceholder } from '@/features/shell/ShellPlaceholder';
import { useAdapterQuery } from '@/hooks/useAdapterQuery';

export function SavedScreen() {
  const saved = useAdapterQuery(() => adapter.getSaved());
  return (
    <Screen grouped bottomInset={TAB_BAR_HEIGHT}>
      <TabHeader eyebrow="Only you can see this" title="Saved" />
      <ShellPlaceholder
        milestone="Milestone 3"
        rows={(saved.data ?? []).map((c) => ({
          id: c.profile.id,
          title: `${c.profile.first_name}, ${c.age}`,
          subtitle: `${c.profile.city} · ${c.denomination_label}`,
          avatarSeed: c.profile.id,
        }))}
        emptyTitle="Nothing saved yet"
        emptyBody="Save someone from today's profiles to keep them past the daily refresh. They are never told."
      />
    </Screen>
  );
}
