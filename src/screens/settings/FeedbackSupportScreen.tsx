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
import { SettingsStackParamList } from '../../types';
import { COLORS } from '../../constants';

type NavigationProp = NativeStackNavigationProp<SettingsStackParamList, 'FeedbackSupport'>;

const SUPPORT_OPTIONS = [
  {
    id: 'feedback',
    icon: 'message-square' as const,
    label: 'Submit Feedback',
    description: 'Share your thoughts and suggestions',
  },
  {
    id: 'rate',
    icon: 'star' as const,
    label: 'Rate Us',
    description: 'Rate your experience with FaithDate',
  },
  {
    id: 'support',
    icon: 'life-buoy' as const,
    label: 'Support',
    description: 'Get help with common issues',
  },
  {
    id: 'help',
    icon: 'help-circle' as const,
    label: 'Help Center',
    description: 'Browse FAQs and guides',
  },
  {
    id: 'contact',
    icon: 'mail' as const,
    label: 'Contact Support',
    description: 'Reach out to our support team',
  },
];

export default function FeedbackSupportScreen() {
  const navigation = useNavigation<NavigationProp>();

  const handleOptionPress = (id: string) => {
    switch (id) {
      case 'rate':
        navigation.navigate('RateReview');
        break;
      case 'contact':
        navigation.navigate('ContactSupport');
        break;
      default:
        // Handle other options
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Feedback & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Support Options */}
        <View style={styles.optionsContainer}>
          {SUPPORT_OPTIONS.map((option) => (
            <Pressable
              key={option.id}
              style={styles.optionCard}
              onPress={() => handleOptionPress(option.id)}
            >
              <View style={styles.optionLeft}>
                <View style={styles.optionIcon}>
                  <Feather name={option.icon} size={20} color={COLORS.primary} />
                </View>
                <View>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color={COLORS.textSecondary} />
            </Pressable>
          ))}
        </View>

        {/* Contact Info */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Need immediate help?</Text>
          <Text style={styles.contactEmail}>support@faithdate.com</Text>
          <Text style={styles.contactHours}>Available 24/7</Text>
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.accentLightPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  contactSection: {
    marginTop: 32,
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.card,
    borderRadius: 16,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  contactEmail: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  contactHours: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
