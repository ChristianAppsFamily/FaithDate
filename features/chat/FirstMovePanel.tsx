import { MessageCircle, Mic } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Avatar, Button, Card, ProgressBar, Text } from '@/components/ui';
import { auntMartha } from '@/config/auntMartha';
import type { MatchSummary } from '@/data';
import { formatHoursLeft } from '@/lib/time';
import { useTheme } from '@/theme';

interface FirstMovePanelProps {
  summary: MatchSummary;
  extending: boolean;
  onExtend: () => void;
  onStart: () => void;
  onInviteIntro: () => void;
  onAskMartha: () => void;
  onCloseKindly: () => void;
}

/** Design 08. She makes the first move: timer, liked comment, start or invite intro. */
export function FirstMovePanel({ summary, extending, onExtend, onStart, onInviteIntro, onAskMartha, onCloseKindly }: FirstMovePanelProps) {
  const { colors, spacing } = useTheme();
  const name = summary.other.profile.first_name;
  const hours = summary.hours_left ?? 0;
  const progress = Math.max(0, Math.min(1, hours / 72));
  const liked = summary.liked_comment;

  return (
    <View style={{ gap: spacing.xl, flex: 1 }}>
      <Text variant="title" color="heading">
        You make the first move
      </Text>
      <Text variant="body" color="muted" style={{ lineHeight: 24 }}>
        {name} can't message until you start. Take your time.
      </Text>

      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
          <Text variant="captionStrong" color="heading">
            {formatHoursLeft(hours)}
          </Text>
          {summary.can_extend ? (
            <Pressable
              onPress={onExtend}
              disabled={extending}
              accessibilityRole="button"
              accessibilityLabel="Extend 24 hours"
              hitSlop={8}
              style={{ minHeight: 44, justifyContent: 'center' }}
            >
              <Text variant="captionStrong" color="primary">
                {extending ? 'Extending…' : 'Extend 24 hours'}
              </Text>
            </Pressable>
          ) : summary.match.extended ? (
            <Text variant="caption" color="muted">
              Already extended
            </Text>
          ) : null}
        </View>
        <ProgressBar value={progress} accessibilityLabel={`${formatHoursLeft(hours)} remaining`} />
      </View>

      {liked?.comment_text ? (
        <Card tone="tint">
          <Text variant="captionStrong" color="heading">
            {name} liked your answer
            {liked.target_type === 'intro' ? ': voice intro' : ''}
          </Text>
          <Text variant="body" color="text" style={{ marginTop: spacing.sm, lineHeight: 22 }}>
            {liked.comment_text}
          </Text>
        </Card>
      ) : null}

      <Button
        label="Start the conversation"
        sublabel="Send the first message."
        icon={<MessageCircle size={20} color={colors.onPrimary} />}
        onPress={onStart}
      />
      <Button
        label="Ask him to introduce himself"
        sublabel="He can send you one voice intro."
        variant="secondary"
        icon={<Mic size={20} color={colors.primary} />}
        onPress={onInviteIntro}
      />

      <Card tone="tint" onPress={onAskMartha} accessibilityRole="button" accessibilityLabel={auntMartha.entryPoints.chatStart}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <Avatar variant="coach" size={40} name={auntMartha.name} />
          <View style={{ flex: 1 }}>
            <Text variant="bodyStrong" color="heading">
              {auntMartha.entryPoints.chatStart}
            </Text>
            <Text variant="caption" color="muted">
              {auntMartha.entryPoints.chatStartSub}
            </Text>
          </View>
        </View>
      </Card>

      <Button label="Close kindly" variant="ghost" onPress={onCloseKindly} />
    </View>
  );
}
