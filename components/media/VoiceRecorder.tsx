import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { Pause, Play, RotateCcw, Square } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, IconButton, Text } from '@/components/ui';
import { rules } from '@/config/rules';
import { formatClock } from '@/lib/time';
import { useTheme } from '@/theme';

import { Waveform } from './Waveform';

export interface RecordedClip {
  storage_path: string;
  duration_s: number;
}

interface VoiceRecorderProps {
  hint: string;
  seed: string;
  initial?: RecordedClip | null;
  onChange: (clip: RecordedClip | null) => void;
  minSeconds?: number;
  maxSeconds?: number;
}

type Phase = 'idle' | 'recording' | 'recorded';

/**
 * Record / replay / re-record for the voice intro (design 03).
 * Works on device and web through expo-audio. Enforces the 30–90s window.
 * Caps at maxSeconds via `record({ forDuration })`.
 */
export function VoiceRecorder({
  hint,
  seed,
  initial = null,
  onChange,
  minSeconds = rules.onboarding.voiceIntroMinSeconds,
  maxSeconds = rules.onboarding.voiceIntroMaxSeconds,
}: VoiceRecorderProps) {
  const { colors, spacing } = useTheme();
  const [phase, setPhase] = useState<Phase>(initial ? 'recorded' : 'idle');
  const [clip, setClip] = useState<RecordedClip | null>(initial);
  const [permError, setPermError] = useState<string | null>(null);
  const [tooShort, setTooShort] = useState(false);

  const onChangeRef = useRef(onChange);
  const minRef = useRef(minSeconds);
  const maxRef = useRef(maxSeconds);
  const finalized = useRef(false);
  const recorderRef = useRef<ReturnType<typeof useAudioRecorder> | null>(null);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY, (status) => {
    if (!status.isFinished) return;
    if (status.hasError) {
      setPermError(status.error ?? 'Could not save the recording. Try again.');
      setPhase('idle');
      return;
    }
    if (finalized.current) return;
    finalized.current = true;
    const durationMillis = recorderRef.current?.getStatus().durationMillis ?? 0;
    const duration_s = Math.round(durationMillis / 1000);
    const uri = status.url;
    if (!uri || duration_s < minRef.current) {
      setTooShort(true);
      setPhase('idle');
      setClip(null);
      onChangeRef.current(null);
      return;
    }
    const next: RecordedClip = {
      storage_path: uri,
      duration_s: Math.min(duration_s, maxRef.current),
    };
    setClip(next);
    setPhase('recorded');
    onChangeRef.current(next);
    setTooShort(false);
  });

  const recState = useAudioRecorderState(recorder, 200);
  const player = useAudioPlayer(clip?.storage_path ?? null, { updateInterval: 200 });
  const playStatus = useAudioPlayerStatus(player);

  useEffect(() => {
    onChangeRef.current = onChange;
    minRef.current = minSeconds;
    maxRef.current = maxSeconds;
    recorderRef.current = recorder;
  }, [onChange, minSeconds, maxSeconds, recorder]);

  useEffect(() => {
    if (playStatus.didJustFinish) {
      player.pause();
      player.seekTo(0).catch(() => undefined);
    }
  }, [playStatus.didJustFinish, player]);

  const stopRecording = async () => {
    if (phase !== 'recording') return;
    try {
      await recorder.stop();
    } catch {
      setPermError('Could not save the recording. Try again.');
      setPhase('idle');
    }
  };

  const startRecording = async () => {
    setPermError(null);
    setTooShort(false);
    finalized.current = false;
    try {
      const perm = await requestRecordingPermissionsAsync();
      if (!perm.granted) {
        setPermError('Microphone access is needed to record. You can skip for now and add a voice intro later.');
        return;
      }
      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
      await recorder.prepareToRecordAsync();
      recorder.record({ forDuration: maxSeconds });
      setPhase('recording');
      setClip(null);
      onChange(null);
    } catch {
      setPermError('Could not start the recorder. Check microphone permissions and try again.');
    }
  };

  const reset = () => {
    setClip(null);
    setPhase('idle');
    setTooShort(false);
    onChange(null);
    if (playStatus.playing) player.pause();
  };

  const togglePlay = () => {
    if (!clip) return;
    if (playStatus.playing) player.pause();
    else player.play();
  };

  const elapsed =
    phase === 'recording' ? Math.min(maxSeconds, Math.floor(recState.durationMillis / 1000)) : (clip?.duration_s ?? 0);
  const progress =
    phase === 'recording'
      ? Math.min(1, recState.durationMillis / (maxSeconds * 1000))
      : clip && playStatus.duration > 0
        ? Math.min(1, playStatus.currentTime / playStatus.duration)
        : clip
          ? 1
          : 0;

  return (
    <Card tone="tint" style={{ paddingVertical: spacing.xxl }}>
      <Text variant="body" color="heading" align="center" style={{ lineHeight: 24 }}>
        {hint}
      </Text>

      <View style={{ marginTop: spacing.xxl }}>
        <Waveform seed={seed} bars={36} height={48} progress={progress} color={colors.lavender} activeColor={colors.primary} />
      </View>

      <Text variant="subheading" color="heading" align="center" style={{ marginTop: spacing.lg }}>
        {formatClock(elapsed)} / {formatClock(maxSeconds)}
      </Text>

      <View style={[styles.controls, { marginTop: spacing.xl }]}>
        <IconButton
          accessibilityLabel={playStatus.playing ? 'Pause recording' : 'Play recording'}
          icon={
            playStatus.playing ? (
              <Pause size={18} color={colors.primary} fill={colors.primary} />
            ) : (
              <Play
                size={18}
                color={phase === 'recorded' ? colors.primary : colors.muted}
                fill={phase === 'recorded' ? colors.primary : colors.muted}
                style={{ marginLeft: 2 }}
              />
            )
          }
          tone="outline"
          size={48}
          disabled={phase !== 'recorded'}
          onPress={togglePlay}
        />
        <IconButton
          accessibilityLabel={phase === 'recording' ? 'Stop recording' : 'Start recording'}
          icon={
            phase === 'recording' ? (
              <Square size={22} color={colors.onPrimary} fill={colors.onPrimary} />
            ) : (
              <View style={[styles.recDot, { backgroundColor: colors.onPrimary }]} />
            )
          }
          tone="filled"
          size={72}
          onPress={() => {
            if (phase === 'recording') void stopRecording();
            else void startRecording();
          }}
        />
        <IconButton
          accessibilityLabel="Re-record"
          icon={<RotateCcw size={18} color={phase === 'idle' ? colors.muted : colors.primary} />}
          tone="outline"
          size={48}
          disabled={phase === 'idle' || phase === 'recording'}
          onPress={reset}
        />
      </View>

      {tooShort ? (
        <Text variant="caption" color="danger" align="center" style={{ marginTop: spacing.md }}>
          Keep going for at least {minSeconds} seconds.
        </Text>
      ) : null}
      {permError ? (
        <Text variant="caption" color="danger" align="center" style={{ marginTop: spacing.md }}>
          {permError}
        </Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  recDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
});
