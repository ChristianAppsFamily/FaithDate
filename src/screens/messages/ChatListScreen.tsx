import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MessageStackParamList } from '../../types';
import { COLORS } from '../../constants';

type NavigationProp = NativeStackNavigationProp<MessageStackParamList, 'ChatList'>;

const CHATS = [
  {
    id: '1',
    userId: '1',
    userName: 'Sarah',
    lastMessage: 'I loved your answer about serving together. Coffee after Sunday service?',
    lastMessageTime: '8m ago',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: '2',
    userId: '2',
    userName: 'Rachel',
    lastMessage: 'That devotional recommendation was exactly what I needed.',
    lastMessageTime: '1h ago',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '3',
    userId: '3',
    userName: 'Esther',
    lastMessage: 'Would love to hear more about your mission trip experience!',
    lastMessageTime: '2h ago',
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: '4',
    userId: '4',
    userName: 'Mary',
    lastMessage: 'Thanks for the prayer request. I\'ll be praying for you.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
  },
];

export default function ChatListScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Pressable style={styles.newMessageButton}>
          <Feather name="edit" size={20} color="#fff" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {CHATS.map((chat) => (
          <Pressable
            key={chat.id}
            style={styles.chatCard}
            onPress={() => navigation.navigate('Chat', { userId: chat.userId, userName: chat.userName })}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{chat.userName[0]}</Text>
              </View>
              {chat.isOnline && <View style={styles.onlineIndicator} />}
            </View>
            <View style={styles.chatInfo}>
              <View style={styles.chatHeader}>
                <Text style={styles.userName}>{chat.userName}</Text>
                <Text style={styles.timeText}>{chat.lastMessageTime}</Text>
              </View>
              <View style={styles.chatFooter}>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {chat.lastMessage}
                </Text>
                {chat.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadCount}>{chat.unreadCount}</Text>
                  </View>
                )}
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.secondary,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  newMessageButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accentLightPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  chatInfo: {
    flex: 1,
    marginLeft: 16,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  chatFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
});
