import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../types';
import { COLORS } from '../../constants';

type NavigationProp = NativeStackNavigationProp<MainTabParamList>;

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'like',
    title: 'Sarah liked your profile',
    message: 'You have a new like from Sarah, 28',
    timestamp: '2m ago',
    date: 'Today',
    read: false,
  },
  {
    id: '2',
    type: 'message',
    title: 'New message from Rachel',
    message: 'Hey! I loved your profile. Would love to chat more about our shared faith.',
    timestamp: '1h ago',
    date: 'Today',
    read: false,
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment Successful',
    message: 'Your subscription has been renewed successfully.',
    timestamp: '3h ago',
    date: 'Today',
    read: true,
  },
  {
    id: '4',
    type: 'like',
    title: 'Emily liked your profile',
    message: 'You have a new like from Emily, 26',
    timestamp: 'Yesterday',
    date: 'Yesterday',
    read: true,
  },
  {
    id: '5',
    type: 'system',
    title: 'Profile Verification Complete',
    message: 'Your profile has been verified. You now have a verified badge!',
    timestamp: '2 days ago',
    date: 'Tuesday',
    read: true,
  },
];

const getIconForType = (type: string) => {
  switch (type) {
    case 'like':
      return 'heart';
    case 'message':
      return 'message-circle';
    case 'payment':
      return 'credit-card';
    case 'system':
      return 'info';
    default:
      return 'bell';
  }
};

const getIconColorForType = (type: string) => {
  switch (type) {
    case 'like':
      return COLORS.primary;
    case 'message':
      return COLORS.accentPurple;
    case 'payment':
      return COLORS.success;
    case 'system':
      return COLORS.textSecondary;
    default:
      return COLORS.textSecondary;
  }
};

export default function NotificationsScreen() {
  const navigation = useNavigation<NavigationProp>();

  const handleMarkAllRead = () => {
    Alert.alert('Success', 'All notifications marked as read');
  };

  const handleViewProfile = (userName: string) => {
    Alert.alert('View Profile', `Navigate to ${userName}'s profile`);
  };

  const handleOpenMessenger = (userName: string) => {
    navigation.navigate('Messages');
  };

  const groupedNotifications = NOTIFICATIONS.reduce((acc, notification) => {
    if (!acc[notification.date]) {
      acc[notification.date] = [];
    }
    acc[notification.date].push(notification);
    return acc;
  }, {} as Record<string, typeof NOTIFICATIONS>);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <Pressable style={styles.markAllButton} onPress={handleMarkAllRead}>
          <Text style={styles.markAllText}>Mark all as read</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {Object.entries(groupedNotifications).map(([date, notifications]) => (
          <View key={date} style={styles.dateGroup}>
            <View style={styles.dateHeader}>
              <Text style={styles.dateText}>{date}</Text>
            </View>
            
            {notifications.map((notification) => (
              <View
                key={notification.id}
                style={[styles.notificationCard, !notification.read && styles.unreadCard]}
              >
                <View style={styles.notificationHeader}>
                  <View style={styles.notificationInfo}>
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: `${getIconColorForType(notification.type)}20` },
                      ]}
                    >
                      <Feather
                        name={getIconForType(notification.type) as keyof typeof Feather.glyphMap}
                        size={18}
                        color={getIconColorForType(notification.type)}
                      />
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={styles.notificationTitle}>{notification.title}</Text>
                      <Text style={styles.notificationMessage}>{notification.message}</Text>
                    </View>
                  </View>
                  <Text style={styles.timestamp}>{notification.timestamp}</Text>
                </View>

                {!notification.read && notification.type === 'like' && (
                  <Pressable style={styles.actionButton} onPress={() => handleViewProfile(notification.title.replace(' liked your profile', '').replace('You have a new like from ', ''))}>
                    <Text style={styles.actionButtonText}>View Profile</Text>
                  </Pressable>
                )}
                {!notification.read && notification.type === 'message' && (
                  <Pressable style={styles.textButton} onPress={() => handleOpenMessenger(notification.title.replace('New message from ', ''))}>
                    <Text style={styles.textButtonText}>Open Messenger!</Text>
                  </Pressable>
                )}
              </View>
            ))}
          </View>
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
  markAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  markAllText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  notificationCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  unreadCard: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  notificationInfo: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginLeft: 8,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  textButton: {
    alignItems: 'center',
    marginTop: 12,
  },
  textButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
