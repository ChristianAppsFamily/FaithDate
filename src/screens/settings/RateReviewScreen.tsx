import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../types';
import { COLORS } from '../../constants';

type NavigationProp = NativeStackNavigationProp<SettingsStackParamList, 'RateReview'>;

export default function RateReviewScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);

  const handleSubmit = () => {
    setShowThankYou(true);
    setTimeout(() => {
      setShowThankYou(false);
      navigation.goBack();
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Rate & Review</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>How was your experience?</Text>
          <Text style={styles.subtitle}>
            Your feedback helps us improve FaithDate for everyone
          </Text>

          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => setRating(star)}>
                <Feather
                  name={star <= rating ? 'star' : 'star'}
                  size={36}
                  color={star <= rating ? '#fbbf24' : COLORS.border}
                  style={star <= rating ? styles.filledStar : styles.emptyStar}
                />
              </Pressable>
            ))}
          </View>

          <View style={styles.ratingLabels}>
            <Text style={styles.ratingLabel}>Poor</Text>
            <Text style={styles.ratingLabel}>Excellent</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Tell us more (optional)</Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={5}
              placeholder="Share your thoughts..."
              placeholderTextColor={COLORS.textSecondary}
              value={review}
              onChangeText={setReview}
              maxLength={250}
            />
            <Text style={styles.charCount}>{review.length}/250</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.submitButton, rating === 0 && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={rating === 0}
        >
          <Text style={styles.submitButtonText}>Submit Review</Text>
        </Pressable>
      </View>

      {/* Thank You Modal */}
      <Modal
        visible={showThankYou}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIcon}>
              <Feather name="check" size={48} color={COLORS.success} />
            </View>
            <Text style={styles.modalTitle}>Thank You!</Text>
            <Text style={styles.modalText}>Your feedback helps us improve</Text>
          </View>
        </View>
      </Modal>
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
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  filledStar: {
    color: '#fbbf24',
  },
  emptyStar: {
    color: COLORS.border,
  },
  ratingLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  ratingLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  inputContainer: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  charCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: 8,
  },
  footer: {
    padding: 20,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '80%',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${COLORS.success}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
