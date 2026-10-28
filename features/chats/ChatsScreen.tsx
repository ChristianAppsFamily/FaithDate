import { auntMartha } from '@/config/auntMartha';
import { Screen, TabHeader, TAB_BAR_HEIGHT } from '@/components/ui';
import { adapter } from '@/data';
import { ShellPlaceholder } from '@/features/shell/ShellPlaceholder';
import { useAdapterQuery } from '@/hooks/useAdapterQuery';

export function ChatsScreen() {
  const matches = useAdapterQuery(() => adapter.getMatches());
  const count = matches.data?.length ?? 0;
  return (
    <Screen grouped bottomInset={TAB_BAR_HEIGHT}>
      <TabHeader eyebrow={`${count} ${count === 1 ? 'match' : 'matches'}`} title="Chats" />
      <ShellPlaceholder
        milestone="Milestone 4"
        rows={[
          { id: 'aunt_martha', title: auntMartha.name, subtitle: `${auntMartha.shortLabel} · pinned` },
          ...(matches.data ?? []).map((m) => ({
            id: m.match.id,
            title: m.other.profile.first_name,
            subtitle: m.last_message?.text ?? (m.my_move ? `Your move · ${Math.floor(m.hours_left ?? 0)} hours left` : 'Voice note'),
            avatarSeed: m.other.profile.id,
          })),
        ]}
        emptyTitle="No matches yet"
        emptyBody="Like back someone who liked you, or wait for a like of yours to be returned."
      />
    </Screen>
  );
}
