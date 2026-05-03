import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types';
import { COLORS, FAITH_OPTIONS } from '../../constants';
import ProgressBar from '../../components/ProgressBar';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'FaithStatus'>;

export default function FaithStatusScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [faith, setFaith] = useState<string | null>(null);
  const [showFaithDropdown, setShowFaithDropdown] = useState(false);
  const [isDivorced, setIsDivorced] = useState(false);
  const [isWidowed, setIsWidowed] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
  const [childrenCount, setChildrenCount] = useState<string | null>(null);
  const [showChildrenDropdown, setShowChildrenDropdown] = useState(false);

  const handleNext = () => {
    navigation.navigate('PhotoUpload');
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

      <ProgressBar progress={50} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Faith Selection */}
        <Text style={styles.sectionTitle}>What's your faith?</Text>
        <Pressable
          style={styles.dropdown}
          onPress={() => setShowFaithDropdown(!showFaithDropdown)}
        >
          <Text style={faith ? styles.dropdownTextActive : styles.dropdownText}>
            {faith || 'Select your faith...'}
          </Text>
          <Feather
            name={showFaithDropdown ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={COLORS.primary}
          />
        </Pressable>

        {showFaithDropdown && (
          <View style={styles.dropdownMenu}>
            {FAITH_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                style={styles.dropdownItem}
                onPress={() => {
                  setFaith(option.label);
                  setShowFaithDropdown(false);
                }}
              >
                <View style={styles.faithItem}>
                  <Text style={styles.faithIcon}>{option.icon}</Text>
                  <Text style={styles.dropdownItemText}>{option.label}</Text>
                </View>
                {faith === option.label && (
                  <Feather name="check" size={18} color={COLORS.primary} />
                )}
              </Pressable>
            ))}
          </View>
        )}

        {/* Marital Status */}
        <Text style={styles.sectionTitle}>Marital Status</Text>
        
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Have you been divorced?</Text>
          <Switch
            value={isDivorced}
            onValueChange={setIsDivorced}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor="#fff"
          />
        </View>

        {isDivorced && (
          <View style={styles.conditionalField}>
            <Text style={styles.conditionalLabel}>Since when?</Text>
            <Pressable style={styles.dateInput}>
              <Text style={styles.dateInputText}>Select date...</Text>
              <Feather name="calendar" size={18} color={COLORS.primary} />
            </Pressable>
          </View>
        )}

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Are you widowed?</Text>
          <Switch
            value={isWidowed}
            onValueChange={setIsWidowed}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor="#fff"
          />
        </View>

        {/* Children */}
        <Text style={styles.sectionTitle}>Do you have children?</Text>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>I have children</Text>
          <Switch
            value={hasChildren}
            onValueChange={setHasChildren}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor="#fff"
          />
        </View>

        {hasChildren && (
          <View style={styles.conditionalField}>
            <Text style={styles.conditionalLabel}>How many children?</Text>
            <Pressable
              style={styles.dropdown}
              onPress={() => setShowChildrenDropdown(!showChildrenDropdown)}
            >
              <Text style={childrenCount ? styles.dropdownTextActive : styles.dropdownText}>
                {childrenCount || 'Select...'}
              </Text>
              <Feather
                name={showChildrenDropdown ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={COLORS.primary}
              />
            </Pressable>

            {showChildrenDropdown && (
              <View style={styles.dropdownMenu}>
                {['1', '2', '3', '4', '5+'].map((count) => (
                  <Pressable
                    key={count}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setChildrenCount(count);
                      setShowChildrenDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{count} {count === '1' ? 'child' : 'children'}</Text>
                    {childrenCount === count && (
                      <Feather name="check" size={18} color={COLORS.primary} />
                    )}
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Pressable onPress={handleBack} style={styles.backTextButton}>
            <Feather name="chevron-left" size={18} color={COLORS.textSecondary} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <Pressable
            style={[styles.nextButton, !faith && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={!faith}
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
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
    marginTop: 24,
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
  faithItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  faithIcon: {
    fontSize: 20,
  },
  dropdownItemText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
  },
  toggleLabel: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  conditionalField: {
    marginLeft: 16,
    marginBottom: 16,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.border,
    gap: 8,
  },
  conditionalLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateInputText: {
    fontSize: 16,
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
