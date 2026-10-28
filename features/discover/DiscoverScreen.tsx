import { useRouter } from 'expo-router';
import { SlidersHorizontal } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { Button, IconButton, Screen, TabHeader, Text, TAB_BAR_HEIGHT } from '@/components/ui';
import { rules } from '@/config/rules';
import { adapter, type BatchFilters, type ProfileCard, type PromptAnswerView } from '@/data';
import { useAdapterQuery } from '@/hooks/useAdapterQuery';
import { useTheme } from '@/theme';

import { DiscoverCard } from './DiscoverCard';
import { FilterSheet } from './FilterSheet';
import { LikeSheet, type LikeTarget } from './LikeSheet';

/** Design 05. Daily batch of 10, filter sheet, like sheet, caught-up empty state. No swipe. */
export function DiscoverScreen() {
  const { colors, radii, spacing } = useTheme();
  const router = useRouter();
  const [filters, setFilters] = useState<BatchFilters>({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [likeCard, setLikeCard] = useState<ProfileCard | null>(null);
  const [likeTarget, setLikeTarget] = useState<LikeTarget | null>(null);

  const batch = useAdapterQuery(() => adapter.getBatch(filters), [filters.has_voice_intro]);
  const wallet = useAdapterQuery(() => adapter.getWallet());

  const cards = batch.data?.cards ?? [];
  const remaining = batch.data?.remaining ?? 0;
  const likesLeft = batch.data?.likes_left_today ?? rules.likes.freePerDay;
  const filterActive = Boolean(filters.has_voice_intro);

  const firstSpouseId = useMemo(() => cards.find((c) => c.profile.intent === 'spouse')?.profile.id ?? null, [cards]);

  const openLike = (card: ProfileCard, target: LikeTarget) => {
    setLikeCard(card);
    setLikeTarget(target);
  };

  const toggleSave = async (card: ProfileCard) => {
    if (card.is_saved) await adapter.unsaveProfile(card.profile.id);
    else await adapter.saveProfileBookmark(card.profile.id);
  };

  return (
    <Screen grouped bottomInset={TAB_BAR_HEIGHT}>
      <TabHeader
        eyebrow={batch.data ? `${remaining} of ${rules.dailyBatch.size} left today` : ' '}
        title="Today"
        action={
          <IconButton
            accessibilityLabel={filterActive ? 'Filters on. Edit filters' : "Filter today's profiles"}
            icon={<SlidersHorizontal size={20} color={filterActive ? colors.onPrimary : colors.heading} />}
            tone={filterActive ? 'filled' : 'outline'}
            size={48}
            onPress={() => setFilterOpen(true)}
          />
        }
      />

      {batch.loading && !batch.data ? (
        <Text variant="caption" color="muted">
          Loading today's profiles…
        </Text>
      ) : null}

      {batch.error ? (
        <Text variant="body" color="danger">
          {batch.error.message}
        </Text>
      ) : null}

      {cards.length === 0 && batch.data ? (
        <View
          style={{
            marginTop: spacing.huge,
            padding: spacing.xxl,
            borderRadius: radii.xl,
            backgroundColor: colors.surface,
            gap: spacing.md,
          }}
        >
          <Text variant="title" color="heading">
            {filterActive && remaining > 0 ? 'No matches for these filters' : "You're caught up"}
          </Text>
          <Text variant="body" color="muted" style={{ lineHeight: 24 }}>
            {filterActive && remaining > 0
              ? 'Try clearing the voice filter to see the rest of today\'s profiles.'
              : 'New profiles arrive at 7pm. Saved people stay in Saved until you remove them.'}
          </Text>
          {filterActive ? <Button label="Clear filters" variant="secondary" onPress={() => setFilters({})} /> : null}
        </View>
      ) : (
        <View style={{ gap: spacing.xxl }}>
          {cards.map((card) => (
            <DiscoverCard
              key={card.profile.id}
              card={card}
              showGoldBadge={card.profile.id === firstSpouseId}
              onSave={() => void toggleSave(card)}
              onPass={() => void adapter.passProfile(card.profile.id)}
              onLikeVoice={() => {
                if (!card.voice_intro) return;
                openLike(card, { type: 'intro', id: card.voice_intro.id, label: 'Liked their voice intro' });
              }}
              onLikeAnswer={(answer: PromptAnswerView) =>
                openLike(card, { type: 'prompt_answer', id: answer.id, label: `Liked their answer: ${answer.prompt_short_label}` })
              }
            />
          ))}
        </View>
      )}

      <FilterSheet visible={filterOpen} value={filters} onChange={setFilters} onClose={() => setFilterOpen(false)} />

      <LikeSheet
        visible={likeCard !== null && likeTarget !== null}
        card={likeCard}
        target={likeTarget}
        likesLeft={likesLeft}
        talentBalance={wallet.data?.balance ?? 0}
        onClose={() => {
          setLikeCard(null);
          setLikeTarget(null);
        }}
        onSent={({ matched, matchId }) => {
          if (matched && matchId) {
            router.push({ pathname: '/match/[id]', params: { id: matchId } });
          }
        }}
      />
    </Screen>
  );
}
