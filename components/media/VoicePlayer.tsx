import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Pause, Play } from 'lucide-react-native';
import { useEffect, useState, type ReactNode } from 'react';
import { StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';

import { IconButton } from '@/components/ui/IconButton';
import { Text } from '@/components/ui/Text';
import { resolveAudioSource } from '@/data/mock/placeholderAudio';
import type { VoiceClip } from '@/data/types';
import { formatClock } from '@/lib/time';
import { useTheme } from '@/theme';

import { Waveform } from './Waveform';

export type VoicePlayerVariant =
  /** LavenderTint panel with an overline label (design 05). */
  | 'card'
  /** Compact tinted row inside a card (design 04). */
  | 'inline'
  /** Chat bubble sized, no background of its own (design 09). */
  | 'bubble'
  /** On a dark immersive background (design 01). */
  | 'onDark';

export interface VoicePlayerProps {
  clip: Pick<VoiceClip, 'id' | 'storage_path' | 'duration_s'>;
  variant?: VoicePlayerVariant;
  /** Overline label for the card variant, e.g. "Voice · Who I am". */
  label?: string;
  /** Slot on the right (e.g. a like button). Replaces the clock when present. */
  trailing?: ReactNode;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

const BAR_WIDTH = 3;
const BAR_GAP = 3;

/** Play button plus waveform for any voice clip. Real playback through expo-audio. */
export function VoicePlayer({ clip, variant = 'inline', label, trailing, accessibilityLabel, style }: VoicePlayerProps) {
  const { colors, radii, spacing } = useTheme();
  const player = useAudioPlayer(resolveAudioSource(clip.storage_path), { updateInterval: 250 });
  const status = useAudioPlayerStatus(player);
  const [bars, setBars] = useState(24);

  useEffect(() => {
    if (status.didJustFinish) {
      player.pause();
      player.seekTo(0).catch(() => undefined);
    }
  }, [status.didJustFinish, player]);

  const total = status.duration > 0 ? status.duration : clip.duration_s;
  const progress = total > 0 ? Math.min(1, status.currentTime / total) : 0;
  const playing = status.playing;
  // The seeded clips are short placeholders; show the clip's stated length counting down proportionally.
  const shown = playing ? Math.max(0, Math.ceil(clip.duration_s * (1 - progress))) : clip.duration_s;

  const toggle = () => {
    if (playing) player.pause();
    else player.play();
  };

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    const next = Math.max(8, Math.floor((w + BAR_GAP) / (BAR_WIDTH + BAR_GAP)));
    if (next !== bars) setBars(next);
  };

  const onDark = variant === 'onDark';
  const buttonSize = variant === 'card' ? 56 : variant === 'bubble' ? 40 : 44;
  const waveHeight = variant === 'card' ? 36 : variant === 'bubble' ? 22 : 28;
  const iconColor = onDark ? colors.plumDeep : colors.onPrimary;
  const icon = playing ? (
    <Pause size={variant === 'card' ? 22 : 18} color={iconColor} fill={iconColor} />
  ) : (
    <Play size={variant === 'card' ? 22 : 18} color={iconColor} fill={iconColor} style={{ marginLeft: 2 }} />
  );
  const a11y = accessibilityLabel ?? (playing ? 'Pause voice clip' : 'Play voice clip');

  const wave = (
    <View style={styles.wave} onLayout={onLayout}>
      <Waveform
        seed={clip.id}
        bars={bars}
        barWidth={BAR_WIDTH}
        gap={BAR_GAP}
        progress={progress}
        height={waveHeight}
        color={onDark ? 'rgba(255,255,255,0.45)' : colors.lavender}
        activeColor={onDark ? '#FFFFFF' : colors.primary}
      />
    </View>
  );

  const clock = (
    <Text variant={variant === 'bubble' ? 'caption' : 'captionStrong'} color={onDark ? 'immersiveMuted' : 'muted'} style={styles.clock}>
      {formatClock(shown)}
    </Text>
  );

  if (variant === 'card') {
    return (
      <View style={[styles.cardPanel, { backgroundColor: colors.lavenderTint, borderRadius: radii.lg, padding: spacing.lg }, style]}>
        {label ? (
          <View style={styles.cardHeader}>
            <Text variant="overline" color="primary">
              {label}
            </Text>
            {clock}
          </View>
        ) : null}
        <View style={styles.row}>
          <IconButton accessibilityLabel={a11y} icon={icon} tone="filled" size={buttonSize} onPress={toggle} />
          {wave}
          {trailing}
        </View>
      </View>
    );
  }

  const row = (
    <View style={styles.row}>
      <IconButton
        accessibilityLabel={a11y}
        icon={icon}
        tone={onDark ? 'outline' : 'filled'}
        size={buttonSize}
        onPress={toggle}
        style={onDark ? { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' } : undefined}
      />
      {wave}
      {trailing ?? clock}
    </View>
  );

  if (variant === 'inline') {
    return <View style={[{ backgroundColor: colors.lavenderTint, borderRadius: radii.lg, padding: spacing.sm, paddingRight: spacing.md }, style]}>{row}</View>;
  }

  return <View style={style}>{row}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  wave: {
    flex: 1,
    overflow: 'hidden',
  },
  clock: {
    minWidth: 36,
    textAlign: 'right',
  },
  cardPanel: {
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
