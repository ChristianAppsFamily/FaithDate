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

type NavigationProp = NativeStackNavigationProp<SettingsStackParamList, 'ChangePassword'>;

export default function ChangePasswordScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSave = () => {
    // Handle password change
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Password</Text>
            <View style={styles.passwordInput}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showCurrentPassword}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor={COLORS.textSecondary}
              />
              <Pressable onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                <Feather name={showCurrentPassword ? 'eye-off' : 'eye'} size={20} color={COLORS.textSecondary} />
              </Pressable>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>New Password</Text>
            <View style={styles.passwordInput}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor={COLORS.textSecondary}
              />
              <Pressable onPress={() => setShowNewPassword(!showNewPassword)}>
                <Feather name={showNewPassword ? 'eye-off' : 'eye'} size={20} color={COLORS.textSecondary} />
              </Pressable>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm New Password</Text>
            <View style={styles.passwordInput}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor={COLORS.textSecondary}
              />
              <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Feather name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color={COLORS.textSecondary} />
              </Pressable>
            </View>
          </View>

          <View style={styles.requirements}>
            <Text style={styles.requirementsTitle}>Password Requirements:</Text>
            <View style={styles.requirementItem}>
              <Feather name="check-circle" size={16} color={COLORS.success} />
              <Text style={styles.requirementText}>At least 8 characters</Text>
            </View>
            <View style={styles.requirementItem}>
              <Feather name="check-circle" size={16} color={COLORS.success} />
              <Text style={styles.requirementText}>One uppercase letter</Text>
            </View>
            <View style={styles.requirementItem}>
              <Feather name="check-circle" size={16} color={COLORS.success} />
              <Text style={styles.requirementText}>One number</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.saveButton, (!currentPassword || !newPassword || !confirmPassword) && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!currentPassword || !newPassword || !confirmPassword}
        >
          <Text style={styles.saveButtonText}>Update Password</Text>
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
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  requirements: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  footer: {
    padding: 20,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.textMuted,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
