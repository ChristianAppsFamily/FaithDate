import { Flower2 } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Sheet, Text, TextField } from '@/components/ui';
import { currency } from '@/config/currency';
import { rules } from '@/config/rules';
import { adapter, AdapterError, type LikeInput, type ProfileCard } from '@/data';
import { useTheme } from '@/theme';

export type LikeTarget =
  | { type: 'intro'; id: string; label: string }
  | { type: 'prompt_answer'; id: string; label: string };

interface LikeSheetProps {
  visible: boolean;
  card: ProfileCard | null;
  target: LikeTarget | null;
  likesLeft: number;
  talentBalance: number;
  onClose: () => void;
  onSent: (result: { matched: boolean; matchId: string | null; otherName: string }) => void;
}

/** Like a specific voice intro or prompt answer. Optional comment; Lily spends Talents. */
export function LikeSheet({ visible, card, target, likesLeft, talentBalance, onClose, onSent }: LikeSheetProps) {
  const { colors, spacing } = useTheme();
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lilyCost = currency.spend.sendLily;
  const canLily = talentBalance >= lilyCost;

  const close = () => {
    setComment('');
    setError(null);
    onClose();
  };

  const send = async (asLily: boolean) => {
    if (!card || !target) return;
    setBusy(true);
    setError(null);
    const input: LikeInput = {
      to_id: card.profile.id,
      target_type: target.type,
      target_id: target.id,
      comment_text: comment.trim() || undefined,
    };
    try {
      const result = asLily ? await adapter.sendLily(input) : await adapter.likeTarget(input);
      const otherName = card.profile.first_name;
      setComment('');
      setBusy(false);
      onClose();
      onSent({ matched: result.match !== null, matchId: result.match?.id ?? null, otherName });
    } catch (e) {
      setBusy(false);
      if (e instanceof AdapterError) setError(e.message);
      else setError('Could not send that like. Try again.');
    }
  };

  return (
    <Sheet
      visible={visible}
      title={card ? `Like ${card.profile.first_name}` : 'Like'}
      subtitle={target?.label}
      onClose={close}
      footer={
        <View style={{ gap: spacing.sm }}>
          {error ? (
            <Text variant="caption" color="danger" align="center">
              {error}
            </Text>
          ) : (
            <Text variant="caption" color="muted" align="center">
              {likesLeft} of {rules.likes.freePerDay} free likes left today · {talentBalance} {currency.name}
            </Text>
          )}
          <Button label="Send like" onPress={() => void send(false)} loading={busy} disabled={!card || !target} />
          <Button
            label={`Send a ${currency.giftName}`}
            sublabel={`${lilyCost} ${currency.name} · pins to the top of their Likes`}
            variant="secondary"
            icon={<Flower2 size={18} color={colors.primary} />}
            onPress={() => void send(true)}
            loading={busy}
            disabled={!card || !target || !canLily}
          />
        </View>
      }
    >
      <TextField
        label="Add a note (optional)"
        value={comment}
        onChangeText={setComment}
        placeholder="What moved you?"
        multiline
        numberOfLines={3}
        maxLength={280}
        style={{ minHeight: 88, textAlignVertical: 'top', paddingTop: 12 }}
      />
      {!canLily ? (
        <Text variant="caption" color="muted">
          You need {lilyCost} {currency.name} to send a {currency.giftName}. Earn them by completing your profile, or buy a bundle in your wallet.
        </Text>
      ) : null}
    </Sheet>
  );
}
