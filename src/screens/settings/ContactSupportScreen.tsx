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
import { SettingsStackParamList } from '../../types';
import { COLORS } from '../../constants';

type NavigationProp = NativeStackNavigationProp<SettingsStackParamList, 'ContactSupport'>;

const ATTACHMENT_OPTIONS = [
  { id: 'recording', icon: 'video' as const, label: 'Screen Recording' },
  { id: 'screenshot', icon: 'image' as const, label: 'Screenshot' },
  { id: 'gallery', icon: 'folder' as const, label: 'From Gallery' },
];

export default function ContactSupportScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  const handleSubmit = () => {
    navigation.goBack();
  };

  const categories = ['Bug Report', 'Feature Request', 'Account Issue', 'Billing', 'Other'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Contact Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Contact Info */}
        <View style={styles.contactInfo}>
          <Text style={styles.contactLabel}>Email us directly at</Text>
          <Text style={styles.contactEmail}>support@faithdate.com</Text>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What can we help with?</Text>
          <View style={styles.categoriesContainer}>
            {categories.map((cat) => (
              <Pressable
                key={cat}
                style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    category === cat && styles.categoryChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Your Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email address"
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Message Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>What went wrong?</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={6}
            value={message}
            onChangeText={setMessage}
            placeholder="Describe your issue in detail..."
            placeholderTextColor={COLORS.textSecondary}
            maxLength={500}
          />
          <Text style={styles.charCount}>{message.length}/500</Text>
        </View>

        {/* Attachments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attachments (optional)</Text>
          <View style={styles.attachmentsContainer}>
            {ATTACHMENT_OPTIONS.map((option) => (
              <Pressable key={option.id} style={styles.attachmentButton}>
                <Feather name={option.icon} size={24} color={COLORS.primary} />
                <Text style={styles.attachmentLabel}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.submitButton, (!message || !email || !category) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!message || !email || !category}
        >
          <Text style={styles.submitButtonText}>Send Message</Text>
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
    padding: 16,
  },
  contactInfo: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  contactLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  contactEmail: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  categoryChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    minHeight: 150,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: 8,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  attachmentButton: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  attachmentLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
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
});
