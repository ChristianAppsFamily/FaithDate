import { Screen, TabHeader, TAB_BAR_HEIGHT } from '@/components/ui';
import { adapter } from '@/data';
import { ShellPlaceholder } from '@/features/shell/ShellPlaceholder';
import { useAdapterQuery } from '@/hooks/useAdapterQuery';

export function LikesScreen() {
  const inbox = useAdapterQuery(() => adapter.getLikesInbox());
  const count = inbox.data?.length ?? 0;
  return (
    <Screen grouped bottomInset={TAB_BAR_HEIGHT}>
      <TabHeader eyebrow={`${count} ${count === 1 ? 'person' : 'people'} liked you`} title="Likes you" />
      <ShellPlaceholder
        milestone="Milestone 3"
        rows={(inbox.data ?? []).map((item) => ({
          id: item.like.id,
          title: `${item.from.profile.first_name}, ${item.from.age}${item.like.is_lily ? ' · Sent you a Lily' : ''}`,
          subtitle: `${item.target_label}${item.like.comment_text ? ` · "${item.like.comment_text}"` : ''}`,
          avatarSeed: item.from.profile.id,
        }))}
        emptyTitle="No likes yet"
        emptyBody="When someone likes your voice intro or an answer, it shows up here."
      />
    </Screen>
  );
}
