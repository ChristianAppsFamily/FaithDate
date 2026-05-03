import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList, RootStackParamList } from '../../types';
import { COLORS, INTERESTS } from '../../constants';
import ProgressBar from '../../components/ProgressBar';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'PersonalQuestions'>;
type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PersonalQuestionsScreen() {
  const navigation = useNavigation<NavigationProp & RootNavigationProp>();
  const [perfectDay, setPerfectDay] = useState('');
  const [travel, setTravel] = useState('');
  const [values, setValues] = useState('');
  const [faithJourney, setFaithJourney] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState('');

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else if (selectedInterests.length < 10) {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !selectedInterests.includes(customInterest.trim())) {
      setSelectedInterests([...selectedInterests, customInterest.trim()]);
      setCustomInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setSelectedInterests(selectedInterests.filter((i) => i !== interest));
  };

  const handleSubmit = () => {
    // Navigate to main app
    navigation.navigate('MainApp');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Feather name="chevron-left" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>FaithDate</Text>
        <View style={styles.placeholder} />
      </View>

      <ProgressBar progress={100} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Perfect Day */}
        <View style={styles.questionContainer}>
          <View style={styles.questionHeader}>
            <Feather name="cloud" size={20} color={COLORS.primary} />
            <Text style={styles.questionText}>Describe your perfect day</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={4}
              placeholder="What does your ideal day look like?"
              placeholderTextColor={COLORS.textSecondary}
              value={perfectDay}
              onChangeText={setPerfectDay}
              maxLength={250}
            />
            <Text style={styles.charCount}>{perfectDay.length}/250</Text>
          </View>
        </View>

        {/* Travel */}
        <View style={styles.questionContainer}>
          <View style={styles.questionHeader}>
            <Feather name="map-pin" size={20} color={COLORS.primary} />
            <Text style={styles.questionText}>Favorite travel destination?</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={3}
              placeholder="Where do you love to travel or want to go?"
              placeholderTextColor={COLORS.textSecondary}
              value={travel}
              onChangeText={setTravel}
              maxLength={250}
            />
            <Text style={styles.charCount}>{travel.length}/250</Text>
          </View>
        </View>

        {/* Interests */}
        <View style={styles.questionContainer}>
          <View style={styles.questionHeader}>
            <Feather name="heart" size={20} color={COLORS.primary} />
            <Text style={styles.questionText}>Select your interests</Text>
          </View>
          
          <View style={styles.interestsContainer}>
            {selectedInterests.map((interest) => (
              <Pressable
                key={interest}
                style={styles.selectedInterestChip}
                onPress={() => removeInterest(interest)}
              >
                <Text style={styles.selectedInterestText}>{interest}</Text>
                <Feather name="x" size={14} color="#fff" />
              </Pressable>
            ))}
          </View>

          <View style={styles.interestsGrid}>
            {INTERESTS.filter((i) => !selectedInterests.includes(i)).map((interest) => (
              <Pressable
                key={interest}
                style={styles.interestChip}
                onPress={() => toggleInterest(interest)}
              >
                <Text style={styles.interestText}>{interest}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.customInterestContainer}>
            <TextInput
              style={styles.customInterestInput}
              placeholder="Add other interest..."
              placeholderTextColor={COLORS.textSecondary}
              value={customInterest}
              onChangeText={setCustomInterest}
              onSubmitEditing={addCustomInterest}
            />
            <Pressable style={styles.addButton} onPress={addCustomInterest}>
              <Feather name="plus" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* Values */}
        <View style={styles.questionContainer}>
          <View style={styles.questionHeader}>
            <Feather name="star" size={20} color={COLORS.primary} />
            <Text style={styles.questionText}>What values matter most to you?</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={3}
              placeholder="Share your core values..."
              placeholderTextColor={COLORS.textSecondary}
              value={values}
              onChangeText={setValues}
              maxLength={250}
            />
            <Text style={styles.charCount}>{values.length}/250</Text>
          </View>
        </View>

        {/* Faith Journey */}
        <View style={styles.questionContainer}>
          <View style={styles.questionHeader}>
            <Feather name="book-open" size={20} color={COLORS.primary} />
            <Text style={styles.questionText}>Share your faith journey</Text>
            <View style={styles.optionalBadge}>
              <Text style={styles.optionalText}>Optional</Text>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={4}
              placeholder="Tell us about your spiritual journey..."
              placeholderTextColor={COLORS.textSecondary}
              value={faithJourney}
              onChangeText={setFaithJourney}
              maxLength={500}
            />
            <Text style={styles.charCount}>{faithJourney.length}/500</Text>
          </View>
        </View>

        {/* Upload Video Button */}
        <Pressable style={styles.videoButton}>
          <Feather name="video" size={20} color={COLORS.accentPurple} />
          <Text style={styles.videoButtonText}>Upload Video Introduction</Text>
        </Pressable>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Pressable onPress={handleBack} style={styles.backTextButton}>
            <Feather name="chevron-left" size={18} color={COLORS.textSecondary} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <Pressable
            style={[styles.submitButton, !perfectDay.trim() && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!perfectDay.trim()}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </Pressable>
        </View>
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
  questionContainer: {
    marginBottom: 24,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  optionalBadge: {
    backgroundColor: COLORS.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  optionalText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  inputContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    padding: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  selectedInterestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  selectedInterestText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  interestChip: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  interestText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  customInterestContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  customInterestInput: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: COLORS.accentPurple,
    marginBottom: 20,
  },
  videoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.accentPurple,
  },
  footer: {
    padding: 20,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backTextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 12,
  },
  backText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.textMuted,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
