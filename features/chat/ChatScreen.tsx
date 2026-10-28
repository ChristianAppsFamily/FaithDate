import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Lock, MoreHorizontal } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';

import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';

import { Avatar, IconButton, Screen, Text } from '@/components/ui';
import { adapter, AdapterError, type ChatThread } from '@/data';
import { useAdapterQuery } from '@/hooks/useAdapterQuery';
import { useSession } from '@/store/useSession';
import { formatRelative } from '@/lib/time';
import { useTheme } from '@/theme';

import { ChatComposer } from './ChatComposer';
import { CloseKindlySheet } from './CloseKindlySheet';
import { ExchangeBanner } from './ExchangeBanner';
import { FirstMovePanel } from './FirstMovePanel';
import { MessageList } from './MessageList';

/**
 * Designs 08 + 09. Women-first start, open chat with exchange banner, voice notes,
 * contact-info blocking, Close kindly. Gold only on Exchange photos when shown.
 */
export function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, radii, spacing } = useTheme();
  const router = useRouter();
  const me = useSession((s) => s.profile);
  const threadQ = useAdapterQuery(() => (id ? adapter.getChat(id) : Promise.reject(new Error('Missing chat'))), [id]);
  const thread = threadQ.data;

  const [composerOpen, setComposerOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [extending, setExtending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recState = useAudioRecorderState(recorder, 250);

  useEffect(() => {
    if (id) void adapter.markRead(id).catch(() => undefined);
  }, [id, thread?.messages.length]);

  useEffect(() => {
    if (thread?.status === 'open' || thread?.status === 'intro_invited') setComposerOpen(true);
  }, [thread?.status]);

  const needsFirstMove = Boolean(thread && thread.my_move && (thread.status === 'awaiting_her_move' || thread.status === 'intro_invited') && !composerOpen);

  const afterExchange = async (exchanged: boolean) => {
    if (!id) return;
    await threadQ.refresh();
    if (exchanged) router.push({ pathname: '/reveal/[id]', params: { id } });
  };

  const requestExchange = async () => {
    if (!id) return;
    setBusy(true);
    setError(null);
    try {
      const ex = await adapter.requestExchange(id);
      await afterExchange(Boolean(ex.exchanged_at));
    } catch (e) {
      setError(e instanceof AdapterError ? e.message : 'Could not request exchange.');
    } finally {
      setBusy(false);
    }
  };

  const respondExchange = async (agree: boolean) => {
    if (!id) return;
    setBusy(true);
    setError(null);
    try {
      const ex = await adapter.respondToExchange(id, agree);
      await afterExchange(Boolean(ex.exchanged_at));
    } catch (e) {
      setError(e instanceof AdapterError ? e.message : 'Could not respond.');
    } finally {
      setBusy(false);
    }
  };

  const startVoice = async () => {
    try {
      const perm = await requestRecordingPermissionsAsync();
      if (!perm.granted) {
        setError('Microphone access is needed for voice notes.');
        return;
      }
      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
      await recorder.prepareToRecordAsync();
      recorder.record({ forDuration: 90 });
      setRecording(true);
    } catch {
      setError('Could not start recording.');
    }
  };

  const stopVoice = async () => {
    if (!id || !recording) return;
    try {
      await recorder.stop();
      const uri = recorder.uri;
      const duration_s = Math.max(1, Math.round(recorder.getStatus().durationMillis / 1000));
      setRecording(false);
      if (!uri) return;
      await adapter.sendMessage(id, { voice_clip: { storage_path: uri, duration_s } });
      await threadQ.refresh();
    } catch (e) {
      setRecording(false);
      setError(e instanceof AdapterError ? e.message : 'Could not send voice note.');
    }
  };

  if (!thread) {
    return (
      <Screen>
        <Text variant="body" color="muted">
          {threadQ.error?.message ?? 'Loading conversation…'}
        </Text>
      </Screen>
    );
  }

  return (
    <Screen scroll={false} padded={false} noTopInset={false}>
      <ChatHeader
        thread={thread}
        onBack={() => router.back()}
        onMartha={() => router.push('/aunt-martha')}
        onMenu={() => setMenuOpen(true)}
      />

      <View style={{ flex: 1, paddingHorizontal: spacing.xl }}>
        {needsFirstMove ? (
          <FirstMovePanel
            summary={thread}
            extending={extending}
            onExtend={() => {
              if (!id) return;
              setExtending(true);
              void adapter
                .extendWindow(id)
                .then(() => threadQ.refresh())
                .finally(() => setExtending(false));
            }}
            onStart={() => setComposerOpen(true)}
            onInviteIntro={() => {
              if (!id) return;
              void adapter.inviteIntro(id).then(() => threadQ.refresh());
            }}
            onAskMartha={() => router.push('/aunt-martha')}
            onCloseKindly={() => setCloseOpen(true)}
          />
        ) : (
          <>
            <ExchangeBanner
              thread={thread}
              busy={busy}
              onRequest={() => void requestExchange()}
              onAgree={() => void respondExchange(true)}
              onNotYet={() => void respondExchange(false)}
            />
            {error ? (
              <Text variant="caption" color="danger" style={{ marginBottom: spacing.sm }}>
                {error}
              </Text>
            ) : null}
            {me ? <MessageList thread={thread} meId={me.id} /> : null}
          </>
        )}
      </View>

      {!needsFirstMove && thread.status === 'open' ? (
        <View style={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.md, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border }}>
          {recording ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm }}>
              <Text variant="bodyStrong" color="danger">
                Recording {Math.floor(recState.durationMillis / 1000)}s
              </Text>
              <IconButton accessibilityLabel="Stop and send voice note" icon={<Text variant="captionStrong" color="onPrimary">Send</Text>} tone="filled" size={48} onPress={() => void stopVoice()} />
            </View>
          ) : null}
          <ChatComposer
            otherName={thread.other.profile.first_name}
            contactBlocked={thread.contact_info_blocked}
            busy={busy || recording}
            onSendText={async (text) => {
              if (!id) return;
              await adapter.sendMessage(id, { text });
              await threadQ.refresh();
              setComposerOpen(true);
            }}
            onSendVoice={() => void startVoice()}
          />
        </View>
      ) : null}

      {needsFirstMove === false && thread.my_move === false && thread.status === 'awaiting_her_move' ? (
        <View style={{ padding: spacing.xl }}>
          <Text variant="body" color="muted" align="center">
            She makes the first move. You'll be notified when she does.
          </Text>
        </View>
      ) : null}

      <CloseKindlySheet
        visible={closeOpen}
        matchId={thread.match.id}
        otherName={thread.other.profile.first_name}
        onClose={() => setCloseOpen(false)}
        onClosed={() => {
          setCloseOpen(false);
          router.replace('/(tabs)/chats');
        }}
      />

      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(28,23,38,0.45)', justifyContent: 'flex-end' }} onPress={() => setMenuOpen(false)}>
          <View style={{ backgroundColor: colors.surface, borderTopLeftRadius: radii.xxl, borderTopRightRadius: radii.xxl, padding: spacing.xl, gap: spacing.sm }}>
            <Text variant="heading" color="heading">
              Chat options
            </Text>
            <Pressable
              onPress={() => {
                setMenuOpen(false);
                router.push('/aunt-martha');
              }}
              style={{ minHeight: 48, justifyContent: 'center' }}
            >
              <Text variant="bodyStrong" color="heading">
                Ask Aunt Martha
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setMenuOpen(false);
                setCloseOpen(true);
              }}
              style={{ minHeight: 48, justifyContent: 'center' }}
            >
              <Text variant="bodyStrong" color="danger">
                Close kindly
              </Text>
            </Pressable>
            <Pressable onPress={() => setMenuOpen(false)} style={{ minHeight: 48, justifyContent: 'center' }}>
              <Text variant="body" color="muted">
                Cancel
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </Screen>
  );
}

function ChatHeader({
  thread,
  onBack,
  onMartha,
  onMenu,
}: {
  thread: ChatThread;
  onBack: () => void;
  onMartha: () => void;
  onMenu: () => void;
}) {
  const { colors, spacing } = useTheme();
  const exchanged = Boolean(thread.exchange.exchanged_at);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.md }}>
      <IconButton accessibilityLabel="Back" icon={<ArrowLeft size={20} color={colors.heading} />} tone="outline" size={48} onPress={onBack} />
      <Avatar variant="blurred" size={40} seed={thread.other.profile.id} name={thread.other.profile.first_name} />
      <View style={{ flex: 1 }}>
        <Text variant="subheading" color="heading">
          {thread.other.profile.first_name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          {!exchanged ? <Lock size={12} color={colors.muted} /> : null}
          <Text variant="caption" color="muted">
            {exchanged ? 'Photos shared' : 'Photos locked'}
            {thread.match.created_at ? ` · Matched ${formatRelative(thread.match.created_at)}` : ''}
          </Text>
        </View>
      </View>
      <IconButton accessibilityLabel="Ask Aunt Martha" icon={<Avatar variant="coach" size={28} name="Aunt Martha" />} tone="plain" size={44} onPress={onMartha} />
      <IconButton accessibilityLabel="Chat menu" icon={<MoreHorizontal size={20} color={colors.heading} />} tone="outline" size={44} onPress={onMenu} />
    </View>
  );
}
