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
import { COLORS } from '../../constants';
import ProgressBar from '../../components/ProgressBar';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'PhotoUpload'>;

export default function PhotoUploadScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [photo, setPhoto] = useState<string | null>(null);

  const handleNext = () => {
    navigation.navigate('PersonalQuestions');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleUpload = () => {
    // Simulate photo upload
    setPhoto('placeholder');
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

      <ProgressBar progress={75} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.uploadContainer}>
          {/* Circular Progress Ring */}
          <View style={styles.progressRing}>
            <View style={styles.progressRingInner}>
              {photo ? (
                <View style={styles.photoPlaceholder}>
                  <Feather name="user" size={60} color={COLORS.primary} />
                </View>
              ) : (
                <Pressable style={styles.uploadButton} onPress={handleUpload}>
                  <Feather name="upload" size={40} color={COLORS.primary} />
                </Pressable>
              )}
            </View>
            {/* Progress dots */}
            <View style={styles.progressDots}>
              {[0, 1, 2, 3].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.progressDot,
                    i < 3 && styles.progressDotActive,
                  ]}
                />
              ))}
            </View>
          </View>

          <Text style={styles.uploadTitle}>Upload Profile!</Text>
          <Text style={styles.uploadSubtitle}>
            Create a Captivating First Impression
          </Text>

          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Tips for a great photo:</Text>
            <View style={styles.tipItem}>
              <Feather name="check" size={16} color={COLORS.primary} />
              <Text style={styles.tipText}>Use a clear, well-lit photo</Text>
            </View>
            <View style={styles.tipItem}>
              <Feather name="check" size={16} color={COLORS.primary} />
              <Text style={styles.tipText}>Show your genuine smile</Text>
            </View>
            <View style={styles.tipItem}>
              <Feather name="check" size={16} color={COLORS.primary} />
              <Text style={styles.tipText}>Avoid group photos or sunglasses</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Pressable onPress={handleBack} style={styles.backTextButton}>
            <Feather name="chevron-left" size={18} color={COLORS.textSecondary} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <Pressable
            style={[styles.nextButton, !photo && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={!photo}
          >
            <Text style={styles.nextButtonText}>Next</Text>
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
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadContainer: {
    alignItems: 'center',
    width: '100%',
  },
  progressRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  progressRingInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  uploadButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.accentLightPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDots: {
    position: 'absolute',
    bottom: -20,
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
  },
  uploadTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 32,
  },
  tipsContainer: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
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
  nextButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
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
