import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../types';
import { COLORS } from '../../constants';

type NavigationProp = NativeStackNavigationProp<MainTabParamList>;

const CATEGORIES = ['All', 'Profiles', 'Reels', 'Voice-over', 'Saved'];

const PROFILES = [
  {
    id: '1',
    name: 'Sarah',
    age: 28,
    faith: 'Christian',
    location: 'Austin, TX',
    bio: 'Worship leader passionate about community and faith. Looking for someone to share Sunday mornings and mission trips with.',
    compatibility: '96%',
  },
  {
    id: '2',
    name: 'Rachel',
    age: 26,
    faith: 'Christian',
    location: 'Dallas, TX',
    bio: 'Bible study host who loves building community around Scripture and shared Sunday rhythms.',
    compatibility: '91%',
  },
  {
    id: '3',
    name: 'Esther',
    age: 30,
    faith: 'Christian',
    location: 'Houston, TX',
    bio: 'Mission volunteer who believes in serving others. Looking for a partner to share that calling.',
    compatibility: '89%',
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleNotificationsPress = () => {
    navigation.navigate('Notifications');
  };

  const handleMenuPress = () => {
    navigation.navigate('Profile');
  };

  const handleSaveProfile = (profileId: string) => {
    Alert.alert('Profile Saved', 'This profile has been saved to your favorites.');
  };

  const handleLikeProfile = (profileId: string) => {
    Alert.alert('Profile Liked', 'You liked this profile! They will be notified.');
  };

  const handleReadMore = (profileName: string) => {
    Alert.alert('Profile Details', `View full profile for ${profileName}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Ionicons name="heart" size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.headerTitle}>FaithDate</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.iconButton} onPress={handleNotificationsPress}>
            <Feather name="bell" size={20} color="#fff" />
            <View style={styles.notificationDot} />
          </Pressable>
          <Pressable style={styles.iconButton} onPress={handleMenuPress}>
            <Feather name="menu" size={20} color="#fff" />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color={COLORS.primary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search profiles..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {CATEGORIES.map((category) => (
            <Pressable
              key={category}
              style={[styles.categoryTab, activeCategory === category && styles.categoryTabActive]}
              onPress={() => setActiveCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
              {activeCategory === category && <View style={styles.activeIndicator} />}
            </Pressable>
          ))}
        </ScrollView>

        {/* Profile Cards */}
        <View style={styles.profilesContainer}>
          {PROFILES.map((profile) => (
            <View key={profile.id} style={styles.profileCard}>
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{profile.name[0]}</Text>
                  </View>
                  <View>
                    <Text style={styles.userName}>{profile.name}</Text>
                    <View style={styles.faithBadge}>
                      <Ionicons name="heart" size={12} color={COLORS.primary} />
                      <Text style={styles.faithText}>{profile.faith}</Text>
                    </View>
                  </View>
                </View>
                <Pressable style={styles.moreButton} onPress={() => handleReadMore(profile.name)}>
                  <Feather name="more-vertical" size={20} color={COLORS.textSecondary} />
                </Pressable>
              </View>

              {/* Photo Placeholder */}
              <View style={styles.photoContainer}>
                <View style={styles.photoPlaceholder}>
                  <Feather name="user" size={60} color={COLORS.textMuted} />
                </View>
                <View style={styles.compatibilityBadge}>
                  <Text style={styles.compatibilityText}>{profile.compatibility}</Text>
                </View>
              </View>

              {/* Bio */}
              <View style={styles.bioContainer}>
                <Text style={styles.bioText} numberOfLines={2}>
                  {profile.bio}
                </Text>
                <Pressable onPress={() => handleReadMore(profile.name)}>
                  <Text style={styles.readMore}>Read More...</Text>
                </Pressable>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                <Pressable style={styles.saveButton} onPress={() => handleSaveProfile(profile.id)}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
                <Pressable style={styles.likeButton} onPress={() => handleLikeProfile(profile.id)}>
                  <Text style={styles.likeButtonText}>Like</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
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
    paddingVertical: 12,
    backgroundColor: COLORS.secondary,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  content: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    position: 'relative',
  },
  categoryTabActive: {
    backgroundColor: 'transparent',
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 1,
  },
  profilesContainer: {
    gap: 16,
  },
  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.accentLightPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  faithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  faithText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  moreButton: {
    padding: 4,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  photoPlaceholder: {
    width: '100%',
    height: 280,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compatibilityBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  compatibilityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  bioContainer: {
    marginBottom: 16,
  },
  bioText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  readMore: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: '700',
  },
  likeButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  likeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
