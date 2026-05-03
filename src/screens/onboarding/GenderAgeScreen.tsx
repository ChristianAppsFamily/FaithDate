import React, { useState } from 'react';
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
import { OnboardingStackParamList } from '../../types';
import { COLORS, AGE_RANGES } from '../../constants';
import ProgressBar from '../../components/ProgressBar';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'GenderAge'>;

export default function GenderAgeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [ageRange, setAgeRange] = useState<string | null>(null);
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);

  const handleNext = () => {
    navigation.navigate('FaithStatus');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>FaithDate</Text>
        <View style={styles.placeholder} />
      </View>

      <ProgressBar progress={25} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Gender Selection */}
        <Text style={styles.sectionTitle}>What's your gender?</Text>
        <View style={styles.genderContainer}>
          <Pressable
            style={[styles.genderCard, gender === 'male' && styles.genderCardActive]}
            onPress={() => setGender('male')}
          >
            <Text style={[styles.genderIcon, gender === 'male' && styles.genderIconActive]}>♂</Text>
            <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>Male</Text>
          </Pressable>
          <Pressable
            style={[styles.genderCard, gender === 'female' && styles.genderCardActive]}
            onPress={() => setGender('female')}
          >
            <Text style={[styles.genderIcon, gender === 'female' && styles.genderIconActive]}>♀</Text>
            <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>Female</Text>
          </Pressable>
        </View>

        {/* Age Range Selection */}
        <Text style={styles.sectionTitle}>Preferred age range?</Text>
        <Pressable
          style={styles.dropdown}
          onPress={() => setShowAgeDropdown(!showAgeDropdown)}
        >
          <Text style={ageRange ? styles.dropdownTextActive : styles.dropdownText}>
            {ageRange || 'Select age range...'}
          </Text>
          <Feather
            name={showAgeDropdown ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={COLORS.primary}
          />
        </Pressable>

        {showAgeDropdown && (
          <View style={styles.dropdownMenu}>
            {AGE_RANGES.map((range) => (
              <Pressable
                key={range.value}
                style={styles.dropdownItem}
                onPress={() => {
                  setAgeRange(range.label);
                  setShowAgeDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{range.label}</Text>
                {ageRange === range.label && (
                  <Feather name="check" size={18} color={COLORS.primary} />
                )}
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.nextButton, (!gender || !ageRange) && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!gender || !ageRange}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </Pressable>
      </View>
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
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
    marginTop: 24,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  genderCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  genderCardActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genderIcon: {
    fontSize: 48,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  genderIconActive: {
    color: '#fff',
  },
  genderText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  genderTextActive: {
    color: '#fff',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dropdownText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  dropdownTextActive: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  dropdownMenu: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownItemText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  footer: {
    padding: 20,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: COLORS.textMuted,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
