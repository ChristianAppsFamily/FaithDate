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
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants';

type LandingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Landing'>;

export default function LandingScreen() {
  const navigation = useNavigation<LandingScreenNavigationProp>();

  const handleCreateProfile = () => {
    navigation.navigate('Onboarding');
  };

  const handleExploreMatches = () => {
    navigation.navigate('MainApp');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Brand Header */}
        <View style={styles.brandRow}>
          <LinearGradient colors={['#ff6f86', '#f9b74d']} style={styles.brandMark}>
            <MaterialCommunityIcons name="heart-multiple" size={24} color="#fff" />
          </LinearGradient>
          <Text style={styles.brandText}>FaithDate</Text>
        </View>

        {/* Hero Section */}
        <View style={styles.heroCopy}>
          <View style={styles.eyebrowContainer}>
            <Text style={styles.eyebrow}>Faith-based dating app</Text>
          </View>
          <Text style={styles.heroTitle}>Meet someone who shares your walk with God.</Text>
          <Text style={styles.heroSubtitle}>
            FaithDate brings intentional discovery, values-led matching, and meaningful
            conversations into one calm mobile experience.
          </Text>

          {/* CTA Buttons */}
          <View style={styles.ctaRow}>
            <Pressable style={styles.primaryCta} onPress={handleCreateProfile}>
              <Text style={styles.primaryCtaText}>Create your profile</Text>
            </Pressable>
            <Pressable style={styles.secondaryCta} onPress={handleExploreMatches}>
              <Text style={styles.secondaryCtaText}>Explore matches</Text>
            </Pressable>
          </View>

          {/* Trust Pills */}
          <View style={styles.trustRow}>
            <View style={styles.trustPill}>
              <MaterialCommunityIcons name="shield-check" size={17} color="#704f43" />
              <Text style={styles.trustText}>Verified profiles</Text>
            </View>
            <View style={styles.trustPill}>
              <MaterialCommunityIcons name="church" size={17} color="#704f43" />
              <Text style={styles.trustText}>Faith filters</Text>
            </View>
          </View>
        </View>

        {/* Feature Cards */}
        <View style={styles.featuresContainer}>
          <LinearGradient colors={['#fbe2d1', '#d96e88']} style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Feather name="heart" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.featureTitle}>Faith-First Matching</Text>
            <Text style={styles.featureText}>
              Connect with people who share your values and beliefs
            </Text>
          </LinearGradient>

          <LinearGradient colors={['#f9d7e7', '#9566b8']} style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Feather name="message-circle" size={24} color={COLORS.accentPurple} />
            </View>
            <Text style={styles.featureTitle}>Meaningful Conversations</Text>
            <Text style={styles.featureText}>
              Start with intention and build real connections
            </Text>
          </LinearGradient>

          <LinearGradient colors={['#fee5b6', '#ce7a5a']} style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Feather name="shield" size={24} color="#ce7a5a" />
            </View>
            <Text style={styles.featureTitle}>Safe & Verified</Text>
            <Text style={styles.featureText}>
              All profiles are verified for your safety
            </Text>
          </LinearGradient>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 44,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  brandMark: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 46,
    height: 46,
    borderRadius: 18,
  },
  brandText: {
    color: '#3a251e',
    fontSize: 24,
    fontWeight: '900',
  },
  heroCopy: {
    gap: 18,
    marginBottom: 32,
  },
  eyebrowContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderColor: 'rgba(255,137,107,0.22)',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  eyebrow: {
    color: '#a24e3c',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#30201a',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1.5,
    lineHeight: 42,
  },
  heroSubtitle: {
    color: '#765a51',
    fontSize: 16,
    lineHeight: 24,
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  primaryCta: {
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 999,
  },
  primaryCtaText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },
  secondaryCta: {
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderColor: 'rgba(116,77,62,0.12)',
    borderWidth: 1,
    borderRadius: 999,
  },
  secondaryCtaText: {
    color: '#3a251e',
    fontWeight: '900',
    fontSize: 16,
  },
  trustRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  trustPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 13,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.58)',
    borderRadius: 999,
  },
  trustText: {
    color: '#704f43',
    fontSize: 13,
    fontWeight: '800',
  },
  featuresContainer: {
    gap: 16,
  },
  featureCard: {
    padding: 20,
    borderRadius: 24,
    gap: 12,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  featureText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
});
